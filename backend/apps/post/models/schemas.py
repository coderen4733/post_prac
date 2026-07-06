from datetime import datetime

from pydantic import BaseModel, Field


class PostCreateRequest(BaseModel):
    """
    '게시글 생성' API(POST /posts)의 요청 body 형태입니다.
    content는 Quill 에디터가 만들어낸 HTML 문자열이 그대로 들어옵니다.
    (본문 안의 이미지는 이미 /posts/images API를 통해 S3에 업로드되어
    있고, content 안에는 그 이미지들의 url만 <img> 태그로 남아있습니다.)
    """

    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)


class PostResponse(BaseModel):
    """
    '게시글 생성' API의 응답 형태입니다.
    """

    id: str
    title: str
    content: str
    images: list[str]
    created_at: datetime
    updated_at: datetime


class PostSummaryResponse(BaseModel):
    """
    '게시글 목록' API(GET /posts)에서 아이템 하나를 나타내는 형태입니다.
    목록에서는 본문 전체 대신 카드에 필요한 정보만 내려줍니다.
    """

    id: str
    title: str
    thumbnail: str | None = None  # 본문에 있는 첫 번째 이미지 (없으면 None)
    created_at: datetime


class ImageUploadResponse(BaseModel):
    """
    '이미지 업로드' API(POST /posts/images)의 응답 형태입니다.
    Quill 에디터는 이 url을 받아서 본문에 바로 <img> 태그로 삽입합니다.
    """

    url: str
