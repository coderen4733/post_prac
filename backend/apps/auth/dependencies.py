import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from apps.user import repository as user_repository
from apps.user.models.enums import UserRole
from core.config import ACCESS_TOKEN_SECRET, JWT_ALGORITHM
from core.database import get_database

# Authorization: Bearer <token> 헤더에서 토큰만 꺼내주는 FastAPI 보안 스킴
bearer_scheme = HTTPBearer()


# 현재 요청의 Access Token을 검증하고, 그 토큰의 주인(User)을 조회
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    try:
        # 1. Access Token 디코딩
        payload = jwt.decode(
            credentials.credentials,
            ACCESS_TOKEN_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        # 1-1. user_id가 없거나 토큰 타입이 "access"가 아닌 경우
        if user_id is None or token_type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 액세스 토큰입니다.",
            )
    except jwt.ExpiredSignatureError:  # 액세스 토큰 만료기간이 지났을 때
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="액세스 토큰이 만료되었습니다.",
        )
    except jwt.PyJWTError:  # 토큰이 위조되었거나 변조되었을 때
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 세션이 유효하지 않습니다.",
        )

    # 2. user_id로 실제 User 조회
    user = await user_repository.find_user_by_id(db, user_id)
    # 2-1. 존재하지 않는 User라면(탈퇴 등) 에러처리
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="존재하지 않는 사용자입니다.",
        )
    return user


# 허용된 role(관리자/직원 등)만 API를 쓸 수 있게 막는 의존성을 만들어주는 함수
def require_roles(*allowed_roles: UserRole):
    # 실제로 라우터에 Depends(...)로 꽂히는 의존성 함수
    async def _verify_role(
        current_user: dict = Depends(get_current_user),
    ) -> dict:
        # 1. 현재 User의 role이 허용된 role 목록에 없으면 에러처리(403)
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="이 작업을 수행할 권한이 없습니다.",
            )
        return current_user

    return _verify_role
