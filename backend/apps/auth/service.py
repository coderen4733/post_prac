from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from apps.auth import repository as auth_repository
from apps.auth.models.entities import TokenEntity
from apps.auth.models.schemas import (
    ReTokenRequest,
    ReTokenResponse,
    SignInRequest,
    SignInResponse,
    SignOutRequest,
    SignOutResponse,
    SignUpRequest,
    SignUpResponse,
)
from apps.user import repository as user_repository
from apps.user.models.entities import UserEntity
from core.config import (
    ACCESS_TOKEN_EXPIRE,
    ACCESS_TOKEN_SECRET,
    JWT_ALGORITHM,
    REFRESH_TOKEN_EXPIRE,
    REFRESH_TOKEN_SECRET,
)


# MongoDB에서 조회한 문서(dict)를 schema에 맞게끔 변환
# 회원가입(sign-up) Response
def _to_sign_up_response(user: dict) -> SignUpResponse:
    # 1. 반환(schema에 맞게)
    return SignUpResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        role=user["role"],
        created_at=user["created_at"],
    )


# 로그인(sign-in) Response
def _to_sign_in_response(token: dict) -> SignInResponse:
    # 1. 반환(schema에 맞게)
    return SignInResponse(
        access_token=token["access_token"],
        refresh_token=token["refresh_token"],
        token_type=token["token_type"],
        role=token["role"],
    )


# 토큰재발급(re-token) Response
def _to_re_token_response(re_token: dict) -> ReTokenResponse:
    # 1. 반환(schema에 맞게)
    return ReTokenResponse(
        access_token=re_token["access_token"],
        token_type=re_token["token_type"],
    )


# 로그아웃(sign-out) Response
def _to_sign_out_response(result: dict) -> SignOutResponse:
    # 1. 반환(schema에 맞게)
    return SignOutResponse(success=result["success"])


# 회원가입(sign-up) API
async def sign_up(db: AsyncIOMotorDatabase, dto: SignUpRequest) -> dict:
    # 0. password, password_confirm 비교
    if dto.password != dto.password_confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        )
    # 1. email 중복 체크를 위해 조회
    is_duplicate_email = await user_repository.find_user_by_email(
        db, dto.email
    )
    # 1-1. 만약 중복이라면 에러처리(409)
    if is_duplicate_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 가입된 이메일입니다.",
        )
    # 2. password 해싱(암호화)
    # 2-1. bcrypt는 바이트(bytes) 타입을 입력받으므로 .encode('utf-8')이 필요
    password_bytes = dto.password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    # 2-2. DB에는 문자열로 저장하기 위해 .decode('utf-8') 해주기
    hashed_password_str = hashed_password.decode("utf-8")
    # 3. 엔터티 생성 (해싱된 패스워드 주입)
    user_entity = UserEntity(
        name=dto.name,
        email=dto.email,
        password=hashed_password_str,
    )
    # 4. 새로운 사용자 생성 및 조회(생성 확인)
    new_user_id = await user_repository.create_user(db, user_entity)
    new_user = await user_repository.find_user_by_id(db, new_user_id)
    # 5. 데이터 변환 및 반환
    return _to_sign_up_response(new_user)


# 로그인(sign-in) API
async def sign_in(
    db: AsyncIOMotorDatabase, dto: SignInRequest, ip_address: str
) -> dict:
    # 1. User 조회
    user = await user_repository.find_user_by_email(db, dto.email)
    # 1-1. User가 없거나 비밀번호 불일치 시
    if not user or not bcrypt.checkpw(
        dto.password.encode("utf-8"), user["password"].encode("utf-8")
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 일치하지 않습니다.",
        )
    # 2. Token 생성
    now = datetime.now(timezone.utc)
    # 2-1. Access Token (기본값: 30분)
    access_expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    access_payload = {
        "sub": str(user["_id"]),
        "type": "access",
        "exp": access_expire,
    }
    access_token = jwt.encode(
        access_payload, ACCESS_TOKEN_SECRET, algorithm=JWT_ALGORITHM
    )
    # 2-2. Refresh Token (기본값: 14일)
    refresh_expire = now + timedelta(days=REFRESH_TOKEN_EXPIRE)
    refresh_payload = {
        "sub": str(user["_id"]),
        "type": "refresh",
        "exp": refresh_expire,
    }
    refresh_token = jwt.encode(
        refresh_payload, REFRESH_TOKEN_SECRET, algorithm=JWT_ALGORITHM
    )
    # 3. 엔터티 생성
    token_entity = TokenEntity(
        user_id=str(user["_id"]),
        ip_address=ip_address,
        refresh_token=refresh_token,
    )
    # 4. Refresh Token을 DB에 저장
    await auth_repository.create_refresh_token(db, token_entity)
    # 5. 로그인 일시 기록
    await user_repository.last_sign_in_time(db, token_entity.user_id, now)
    # 6. 데이터 변환 및 반환
    result = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": user["role"],
    }
    return _to_sign_in_response(result)


# 토큰재발급(re-token) API
async def re_token(db: AsyncIOMotorDatabase, dto: ReTokenRequest) -> dict:
    try:
        # 1. Refresh Token 디코딩
        payload = jwt.decode(
            dto.refresh_token,
            REFRESH_TOKEN_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        # 1-1. 해당 user_id가 없거나 토큰 타입이 "refresh"가 아닌 경우
        if user_id is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 리프레시 토큰입니다.",
            )
        # 2. DB에 저장된 토큰과 일치하는지 확인 (중요: 보안 강화)
        user = await user_repository.find_user_by_id(db, user_id)
        refresh_token = (
            await auth_repository.find_refresh_token_by_refresh_token(
                db, dto.refresh_token
            )
        )
        # 2-1. 만약 해당 user가 없거나, DB에 토큰이 없거나(로그아웃 등),
        #      토큰 소유 user가 일치하지 않는 경우
        if (
            user is None
            or refresh_token is None
            or user_id != refresh_token["user_id"]
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="토큰의 사용자가 일치하지 않습니다.",
            )
        # 3. 새로운 Access Token 발행
        now = datetime.now(timezone.utc)
        access_expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE)
        new_access_token = jwt.encode(
            {"sub": user_id, "type": "access", "exp": access_expire},
            ACCESS_TOKEN_SECRET,
            algorithm=JWT_ALGORITHM,
        )
        # 4. 데이터 변환 및 반환
        result = {
            "access_token": new_access_token,
            "token_type": "bearer",
        }
        return _to_re_token_response(result)
    except jwt.ExpiredSignatureError:  # 리프레시 토큰 만료기간이 지났을 때
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="리프레시 토큰이 만료되었습니다.",
        )
    except jwt.PyJWTError:  # 토큰이 위조되었거나 변조되었을 때
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 세션이 유효하지 않습니다.",
        )


# 로그아웃(sign-out) API
async def sign_out(db: AsyncIOMotorDatabase, dto: SignOutRequest) -> dict:
    # 1. 요청받은 Refresh Token을 DB에서 삭제 (로그아웃 처리)
    deleted_count = (
        await auth_repository.delete_refresh_token_by_refresh_token(
            db, dto.refresh_token
        )
    )
    # 1-1. 삭제된 문서가 없다면(이미 로그아웃됐거나 잘못된 토큰) 에러처리
    if deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 리프레시 토큰입니다.",
        )
    # 2. 데이터 변환 및 반환
    return _to_sign_out_response({"success": True})
