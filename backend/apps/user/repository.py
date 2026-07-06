from bson import ObjectId  # MongoDB 문서 id(_id) 타입을 다루는 라이브러리
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError

from apps.user.models.entities import UserEntity

# MongoDB에서 User가 저장되는 컬렉션(=RDB의 테이블과 비슷한 개념) 이름
COLLECTION_NAME = "users"


# User 생성(C) API
async def create_user(db: AsyncIOMotorDatabase, user: UserEntity) -> str:
    try:
        # 1. DB에 저장
        result = await db[COLLECTION_NAME].insert_one(user.model_dump())
        # 2. 생성된 _id를 반환
        return str(result.inserted_id)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 가입된 이메일입니다.",
        )


# User 목록 조회(R-A) API
async def find_users(
    db: AsyncIOMotorDatabase, skip: int, limit: int
) -> list[dict]:
    # skip/limit으로 페이지네이션
    cursor = (
        db[COLLECTION_NAME]
        .find()
        .sort("created_at", -1)  # 최신순 정렬
        .skip(skip)  # 페이지네이션
        .limit(limit)  # 페이지네이션
    )
    return await cursor.to_list(length=limit)


# User 상세 조회(R-D) API by user_id
async def find_user_by_id(
    db: AsyncIOMotorDatabase, user_id: str
) -> dict | None:
    if not ObjectId.is_valid(user_id):
        return None
    return await db[COLLECTION_NAME].find_one({"_id": ObjectId(user_id)})


# User 상세 조회(R-D) API by email
async def find_user_by_email(
    db: AsyncIOMotorDatabase, email: str
) -> dict | None:
    return await db[COLLECTION_NAME].find_one({"email": email})


# User 수정(U) API
async def update_user(
    db: AsyncIOMotorDatabase, user_id: str, update_fields: dict
) -> None:
    await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_fields}
    )


# User 삭제(D) API
async def delete_user(db: AsyncIOMotorDatabase, user_id: str) -> int:
    # 실제로 삭제된 문서 수 반환(0이면 이미 없는 사용자라는 뜻)
    result = await db[COLLECTION_NAME].delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count


# 마지막 로그인 일시 기록(last_sign_in_time)
async def last_sign_in_time(
    db: AsyncIOMotorDatabase, user_id: str, sign_in_time: any
) -> None:
    await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(user_id)}, {"$set": {"last_sign_in_at": sign_in_time}}
    )
