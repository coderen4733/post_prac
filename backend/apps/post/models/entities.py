from datetime import datetime, timezone

from pydantic import BaseModel, Field


class PostEntity(BaseModel):
    """
    MongoDB의 'posts' 컬렉션에 실제로 저장되는 문서(document) 구조입니다.
    API 요청/응답 형태(schemas.py)와 달리, DB에 어떤 모양으로
    데이터가 들어가는지를 나타냅니다.
    """

    title: str  # 게시글 제목
    content: str  # Quill 에디터로 작성된 본문 (HTML 형태)
    # 본문(content) 안에 삽입된 이미지들의 S3 url 목록.
    # Quill 에디터에 이미지가 추가될 때마다 core/s3.py를 통해 S3에 먼저
    # 업로드되고, 그 url이 본문 HTML(<img src="...">) 안에 남습니다.
    # 게시글을 저장할 때 본문에서 그 url들만 뽑아서 여기에 함께 저장해둡니다.
    images: list[str] = Field(default_factory=list)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
