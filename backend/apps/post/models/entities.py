from datetime import datetime, timezone

from pydantic import BaseModel, Field


# MongoDB의 'posts' 컬렉션에 실제로 저장되는 문서(document) 구조
# DB에 어떤 모양으로 데이터가 들어가는지 지정
class PostEntity(BaseModel):
    # 1. 게시글 제목/내용
    # 1-1. 제목
    title: str
    # 1-2. 내용
    content: str  # Quill 에디터로 작성된 본문 (HTML 형태)

    # 2. 게시글에 첨부된 이미지 관련
    # 2-1. 본문(content) 안에 삽입된 이미지들의 S3 url 목록
    images: list[str] = Field(default_factory=list)

    # 3. 시간 메타데이터
    # 3-1. 생성일
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    # 3-2. 수정일
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
