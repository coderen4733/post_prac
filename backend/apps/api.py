from fastapi import APIRouter

from apps.auth.router import auth_router

# apps/user/router.py는 아직 구현 전(빈 파일)이라 user_router가 없음
# from apps.user.router import user_router
from apps.post.router import post_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
# api_router.include_router(user_router, prefix="/users", tags=["User"])
api_router.include_router(post_router, prefix="/posts", tags=["Post"])
