from fastapi import APIRouter

# from apps.auth.router import auth_router
# from apps.user.router import user_router
from apps.post.router import post_router

api_router = APIRouter()
# api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
# api_router.include_router(user_router, prefix="/users", tags=["User"])
api_router.include_router(post_router, prefix="/posts", tags=["Post"])
