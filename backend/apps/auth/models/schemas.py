from datetime import datetime

from pydantic import BaseModel, Field


# 회원가입(sign-up) API - 요청(Req)
class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=8, example="정다혜")
    email: str = Field(..., min_length=1, example="dhj@dahn-architects.com")
    password: str = Field(..., min_length=1, max_length=20, example="dhj0525!")
    password_confirm: str = Field(
        ..., min_length=1, max_length=20, example="dhj0525!"
    )


# 회원가입(sign-up) API - 응답(Res)
class SignUpResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: datetime


# 로그인(sign-in) API - 요청(Req)
class SignInRequest(BaseModel):
    email: str = Field(..., min_length=1, example="dhj@dahn-architects.com")
    password: str = Field(..., min_length=1, example="dhj0525!")


# 로그인(sign-in) API - 응답(Res)
class SignInResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str


# 토큰재발급(re-token) API - 요청(Req)
class ReTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh Token")


# 토큰재발급(re-token) API - 응답(Res)
class ReTokenResponse(BaseModel):
    access_token: str = Field(..., description="Access Token")
    token_type: str = "bearer"


# 로그아웃(sign-out) API - 요청(Req)
class SignOutRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh Token")


# 로그아웃(sign-out) API - 응답(Res)
class SignOutResponse(BaseModel):
    success: bool = True
