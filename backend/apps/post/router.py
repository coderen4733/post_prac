from fastapi import APIRouter, Depends, File, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from apps.auth.dependencies import require_roles
from apps.post import service
from apps.post.models.schemas import (
    ImageUploadResponse,
    PostCreateRequest,
    PostResponse,
    PostSummaryResponse,
)
from apps.user.models.enums import UserRole
from common.response import ResponseSchema
from core.database import get_database

post_router = APIRouter()

# Project 생성/수정/삭제는 admin, staff만 가능 (목록/상세 조회는 누구나 가능)
_require_staff_or_admin = require_roles(UserRole.ADMIN, UserRole.STAFF)


# Project 이미지 파일 S3 처리 API
@post_router.post(
    "/images",
    response_model=ResponseSchema[ImageUploadResponse],
    dependencies=[Depends(_require_staff_or_admin)],
)
async def upload_post_image(file: UploadFile = File(...)):
    # 1. Data(Router <- Service)
    url = await service.upload_image(file)
    # 2. Response(Router -> FrontEnd)
    return {
        "message": "이미지 업로드가 완료되었습니다.",
        "data": ImageUploadResponse(url=url),
    }


# Project 생성(C) API
@post_router.post(
    "",
    response_model=ResponseSchema[PostResponse],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(_require_staff_or_admin)],
)
async def create_post(
    payload: PostCreateRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.create_post(db, payload)
    # 2. Response(Router -> FrontEnd)
    return {"message": "프로젝트가 생성되었습니다.", "data": data}


# Project 목록 조회(R-A) API
@post_router.get("", response_model=ResponseSchema[list[PostSummaryResponse]])
async def get_posts(
    skip: int = 0,
    limit: int = 20,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.list_posts(db, skip, limit)
    # 2. Response(Router -> FrontEnd)
    return {"message": "프로젝트 목록 조회에 성공했습니다.", "data": data}


# Project 상세 조회(R-D) API
@post_router.get("/{post_id}", response_model=ResponseSchema[PostResponse])
async def get_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.get_post(db, post_id)
    # 2. Response(Router -> FrontEnd)
    return {"message": "프로젝트 상세 조회에 성공했습니다.", "data": data}


# Project 수정(U) API
@post_router.put(
    "/{post_id}",
    response_model=ResponseSchema[PostResponse],
    dependencies=[Depends(_require_staff_or_admin)],
)
async def update_post(
    post_id: str,
    payload: PostCreateRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.update_post(db, post_id, payload)
    # 2. Response(Router -> FrontEnd)
    return {"message": "프로젝트가 수정되었습니다.", "data": data}


# Project 삭제(D) API
@post_router.delete(
    "/{post_id}",
    response_model=ResponseSchema[None],
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(_require_staff_or_admin)],
)
async def delete_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    await service.delete_post(db, post_id)
    # 2. Response(Router -> FrontEnd)
    return {"message": "프로젝트가 삭제되었습니다.", "data": None}
