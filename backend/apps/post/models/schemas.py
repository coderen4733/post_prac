from datetime import datetime

from pydantic import BaseModel, Field


# Project 생성(C) API - 요청(Req)
class PostCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)


# Project 생성(C) API - 응답(Res)
class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    images: list[str]
    created_at: datetime
    updated_at: datetime


# Project 목록 조회(R-A) API - 응답(Res)
class PostSummaryResponse(BaseModel):
    id: str
    title: str
    thumbnail: str | None = None  # 본문에 있는 첫 번째 이미지 (없으면 None)
    created_at: datetime


# Image 업로드 API - 응답(Res)
# Quill 에디터는 이 url을 받아서 본문에 <img> 태그로 삽입
class ImageUploadResponse(BaseModel):
    url: str
