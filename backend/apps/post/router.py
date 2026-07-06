from fastapi import APIRouter, Depends, File, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from apps.post import service
from apps.post.models.schemas import (
    ImageUploadResponse,
    PostCreateRequest,
    PostResponse,
    PostSummaryResponse,
)
from core.database import get_database

post_router = APIRouter()


# Project 이미지 파일 S3 처리 API
@post_router.post("/images", response_model=ImageUploadResponse)
async def upload_post_image(file: UploadFile = File(...)):
    url = await service.upload_image(file)
    return ImageUploadResponse(url=url)


# Project 생성(C) API
@post_router.post("", response_model=PostResponse)
async def create_post(
    payload: PostCreateRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await service.create_post(db, payload)


# Project 목록 조회(R-A) API
@post_router.get("", response_model=list[PostSummaryResponse])
async def get_posts(
    skip: int = 0,
    limit: int = 20,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await service.list_posts(db, skip, limit)


# Project 상세 조회(R-D) API
@post_router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await service.get_post(db, post_id)


# Project 수정(U) API
@post_router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    payload: PostCreateRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await service.update_post(db, post_id, payload)


# Project 삭제(D) API
@post_router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    await service.delete_post(db, post_id)
