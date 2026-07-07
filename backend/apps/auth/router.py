from fastapi import APIRouter, Depends, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from apps.auth import service
from apps.auth.models.schemas import (
    ReTokenRequest,
    ReTokenResponse,
    SignInRequest,
    SignInResponse,
    SignOutRequest,
    SignOutResponse,
    SignUpRequest,
    SignUpResponse,
)
from common.response import ResponseSchema
from core.database import get_database

auth_router = APIRouter()


# 회원가입(sign-up) API
@auth_router.post(
    "/sign-up",
    response_model=ResponseSchema[SignUpResponse],
    status_code=status.HTTP_201_CREATED,
)
async def sign_up(
    dto: SignUpRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.sign_up(db, dto)
    # 2. Response(Router -> FrontEnd)
    return {"message": "회원가입이 완료되었습니다.", "data": data}


# 로그인(sign-in) API
@auth_router.post(
    "/sign-in",
    response_model=ResponseSchema[SignInResponse],
    status_code=status.HTTP_200_OK,
)
async def sign_in(
    dto: SignInRequest,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.sign_in(db, dto, ip_address=request.client.host)
    # 2. Response(Router -> FrontEnd)
    return {"message": "로그인에 성공하였습니다.", "data": data}


# 토큰재발급(re-token) API
@auth_router.post(
    "/re-token",
    response_model=ResponseSchema[ReTokenResponse],
    status_code=status.HTTP_200_OK,
)
async def re_token(
    dto: ReTokenRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.re_token(db, dto)
    # 2. Response(Router -> FrontEnd)
    return {"message": "Access Token 재발급에 성공했습니다.", "data": data}


# 로그아웃(sign-out) API
@auth_router.post(
    "/sign-out",
    response_model=ResponseSchema[SignOutResponse],
    status_code=status.HTTP_200_OK,
)
async def sign_out(
    dto: SignOutRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    # 1. Data(Router <- Service)
    data = await service.sign_out(db, dto)
    # 2. Response(Router -> FrontEnd)
    return {"message": "로그아웃에 성공하였습니다.", "data": data}
