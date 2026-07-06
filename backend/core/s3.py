import uuid
from urllib.parse import urlparse

import boto3  # AWS S3 등 AWS 서비스를 사용하기 위한 공식 라이브러리
from fastapi import UploadFile
from fastapi.concurrency import (
    run_in_threadpool,  # 동기 함수를 비동기 코드 안에서 안전하게 실행
)

from core.config import (
    AWS_ACCESS_KEY_ID,
    AWS_REGION,
    AWS_S3_BUCKET_NAME,
    AWS_SECRET_ACCESS_KEY,
)

# 기본세팅 - S3 클라이언트는 요청마다 새로 만들지 않고, 이 코드로 재사용
_s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)
# 기본세팅 - 이미지가 저장될 S3 버킷 폴더명
_UPLOAD_FOLDER = "postprac"


# S3에 저장될 파일 경로(key; uuid로 파일명 중복 방지) 생성
def _build_object_key(filename: str) -> str:
    # 1. 확장자가 있는 경우: '폴더명/uuid.확장자'로 반환
    if "." in filename:
        extension = filename.rsplit(".", 1)[-1]  # 확장자
        return f"{_UPLOAD_FOLDER}/{uuid.uuid4().hex}.{extension}"
    # 2. 확장자가 없는 경우: '폴더명/uuid'로 반환
    return f"{_UPLOAD_FOLDER}/{uuid.uuid4().hex}"


# url에서 버킷 안 경로(object key)만 뽑아냄
# 예시> "https://버킷.s3.리전..../postprac/a.png" => "postprac/a.png"
def _extract_object_key(url: str) -> str:
    return urlparse(url).path.lstrip("/")


# S3에 Image 저장 명령 (Project 생성 시)
async def upload_image_to_s3(file: UploadFile) -> str:
    # 1. 내용물 용량 확인
    file_bytes = await file.read()
    # 2. S3에 저장될 파일명(object key) 생성
    object_key = _build_object_key(file.filename or "image")
    # 3. 내용물의 타입
    content_type = file.content_type or "application/octet-stream"
    # 4. S3에 이미지 저장
    return await run_in_threadpool(
        _put_object, file_bytes, object_key, content_type
    )


# S3에 Image 실제 저장 함수(여러 개 한 번에 저장 - 동기(sync) 함수)
def _put_object(file_bytes: bytes, object_key: str, content_type: str) -> str:
    # 1. S3 저장 (boto3는 async 지원 X => 함수 콜 시 run_in_threadpool() 사용)
    _s3_client.put_object(
        Bucket=AWS_S3_BUCKET_NAME,
        Key=object_key,
        Body=file_bytes,
        ContentType=content_type,
    )
    # 2. 실제 접근 가능한 이미지 url 주소를 반환
    return (
        f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/"
        f"{object_key}"
    )


# S3에서 Image 삭제 명령 (Project 수정/삭제 시)
async def delete_images_from_s3(urls: list[str]) -> None:
    # 1. 본문에 이미지가 없는 경우는 Pass
    if not urls:
        return
    # 2. 버킷 안 경로(object key) 추출
    object_keys = [_extract_object_key(url) for url in urls]
    # 3. 해당 경로의 oject(image) 삭제
    await run_in_threadpool(_delete_objects, object_keys)


# S3에서 Image 실제 삭제 함수(여러 개 한 번에 삭제 - 동기(sync) 함수)
def _delete_objects(object_keys: list[str]) -> None:
    _s3_client.delete_objects(
        Bucket=AWS_S3_BUCKET_NAME,
        Delete={"Objects": [{"Key": key} for key in object_keys]},
    )
