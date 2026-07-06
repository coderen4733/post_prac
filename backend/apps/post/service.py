import re
from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from apps.post import repository
from apps.post.models.entities import PostEntity
from apps.post.models.schemas import (
    PostCreateRequest,
    PostResponse,
    PostSummaryResponse,
)
from core.s3 import delete_images_from_s3, upload_image_to_s3


# Quill로 작성된 본문 HTML의 image url 추출
# 예시> <img src="https://.../a.png"> => "https://.../a.png"
def _extract_image_urls(content: str) -> list[str]:
    # 1. HTML에서 url 추출하는 정규식 함수 호출
    return _IMG_SRC_PATTERN.findall(content)


# Quill로 작성된 본문 HTML 안에서 <img src="..."> 부분의 url만 뽑아내는 정규식
_IMG_SRC_PATTERN = re.compile(r'<img[^>]+src="([^"]+)"')


# MongoDB에서 조회한 문서(dict)를 schema에 맞게끔 반환
def _to_post_response(post: dict) -> PostResponse:
    # 1. 반환(schema에 맞게)
    return PostResponse(
        id=str(post["_id"]),
        title=post["title"],
        content=post["content"],
        images=post["images"],
        created_at=post["created_at"],
        updated_at=post["updated_at"],
    )


# S3에 Quill에 삽입된 image 업로드 => url 반환
async def upload_image(file: UploadFile) -> str:
    # 1. core.s3의 image 업로드 함수 호출
    return await upload_image_to_s3(file)


# Project 생성(C) API
async def create_post(
    db: AsyncIOMotorDatabase, payload: PostCreateRequest
) -> PostResponse:
    # 1. 본문의 image url들을 추출
    image_urls = _extract_image_urls(payload.content)
    # 2. 저장할 본문 entity 지정
    post_entity = PostEntity(
        title=payload.title,
        content=payload.content,
        images=image_urls,
    )
    # 3. Project 생성
    post_id = await repository.create_post(db, post_entity)
    # 4. 해당 Project가 잘 생성되었는지 조회
    saved_post = await repository.find_post_by_id(db, post_id)
    # 5. 데이터 반환
    return _to_post_response(saved_post)


# Project 목록 조회(R-A) API
async def list_posts(
    db: AsyncIOMotorDatabase, skip: int, limit: int
) -> list[PostSummaryResponse]:
    # 1. Project 목록 조회
    posts = await repository.find_posts(db, skip, limit)
    # 2. Project의 id, 제목, 썸네일, 작성일만 반환
    return [
        PostSummaryResponse(
            id=str(post["_id"]),
            title=post["title"],
            thumbnail=post["images"][0] if post["images"] else None,
            created_at=post["created_at"],
        )
        for post in posts
    ]


# Project 상세 조회(R-D) API
async def get_post(db: AsyncIOMotorDatabase, post_id: str) -> PostResponse:
    # 1. 해당 Project가 존재하니?
    post = await repository.find_post_by_id(db, post_id)
    # 2. 존재하지 않으면 에러처리(404)
    if post is None:
        raise HTTPException(
            status_code=404, detail="Project를 찾을 수 없습니다."
        )
    # 3. 데이터 반환
    return _to_post_response(post)


# Project 수정(U) API
async def update_post(
    db: AsyncIOMotorDatabase, post_id: str, payload: PostCreateRequest
) -> PostResponse:
    # 1. Project가 존재하는지 확인
    existing_post = await repository.find_post_by_id(db, post_id)
    # 1-1. 존재하지 않으면 에러처리(404)
    if existing_post is None:
        raise HTTPException(
            status_code=404, detail="Project를 찾을 수 없습니다."
        )
    # 2. 새로운 image url 목록 정리
    new_image_urls = _extract_image_urls(payload.content)
    # 3. 수정된 Project 저장
    await repository.update_post(
        db,
        post_id,
        {
            "title": payload.title,
            "content": payload.content,
            "images": new_image_urls,
            "updated_at": datetime.now(timezone.utc),
        },
    )
    # 4. 수정으로 인해 제거된 image는 S3에서도 삭제
    # 4-1. 제거된 image url 목록 확보(기존 목록 - 새 목록 = 제거된 목록)
    removed_image_urls = set(existing_post["images"]) - set(new_image_urls)
    # 4-2. S3에서 해당 image 삭제
    await _delete_images_best_effort(list(removed_image_urls))
    # 5. 수정으로 인해 추가된 image를 S3에 업로드
    updated_post = await repository.find_post_by_id(db, post_id)
    # 6. 데이터 반환
    return _to_post_response(updated_post)


# Project 삭제(D) API
async def delete_post(db: AsyncIOMotorDatabase, post_id: str) -> None:
    # 1. 해당 Project가 존재하니?
    existing_post = await repository.find_post_by_id(db, post_id)
    # 1-1. 존재하지 않으면 에러처리(404)
    if existing_post is None:
        raise HTTPException(
            status_code=404, detail="Project를 찾을 수 없습니다."
        )
    # 2. DB에서 Project 삭제
    await repository.delete_post(db, post_id)
    # 3. S3에서 해당 Project Image들 삭제
    await _delete_images_best_effort(existing_post["images"])


# S3에서 image를 삭제
async def _delete_images_best_effort(urls: list[str]) -> None:
    # 0. try-except: image 삭제에 실패하더라도 프로젝트 수정/삭제는 진행되어야
    try:
        # 1. core.s3의 image 삭제 함수 호출
        await delete_images_from_s3(urls)
    except Exception as err:
        # 2. 삭제 실패 시 로그 출력
        print(f"S3 이미지 삭제에 실패했습니다: {err}")
