from bson import ObjectId  # MongoDB 문서 id(_id) 타입을 다루는 라이브러리
from motor.motor_asyncio import AsyncIOMotorDatabase

from apps.post.models.entities import PostEntity

# MongoDB에서 게시글이 저장되는 컬렉션(=RDB의 테이블과 비슷한 개념) 이름
COLLECTION_NAME = "posts"


# Project 생성(C) API
async def create_post(db: AsyncIOMotorDatabase, post: PostEntity) -> str:
    result = await db[COLLECTION_NAME].insert_one(post.model_dump())
    return str(result.inserted_id)


# Project 목록 조회(R-A) API
async def find_posts(
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


# Project 상세 조회(R-D) API
async def find_post_by_id(
    db: AsyncIOMotorDatabase, post_id: str
) -> dict | None:
    if not ObjectId.is_valid(post_id):
        return None
    return await db[COLLECTION_NAME].find_one({"_id": ObjectId(post_id)})


# Project 수정(U) API
async def update_post(
    db: AsyncIOMotorDatabase, post_id: str, update_fields: dict
) -> None:
    await db[COLLECTION_NAME].update_one(
        {"_id": ObjectId(post_id)}, {"$set": update_fields}
    )


# Project 삭제(D) API
async def delete_post(db: AsyncIOMotorDatabase, post_id: str) -> int:
    # 실제로 삭제된 문서 수 반환(0이면 이미 없는 게시글이라는 뜻)
    result = await db[COLLECTION_NAME].delete_one({"_id": ObjectId(post_id)})
    return result.deleted_count
