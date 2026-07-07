from pydantic import BaseModel, Field


# 문의하기(Contact) API - 요청(Req)
class ContactCreateRequest(BaseModel):
    customer_name: str = Field(
        ..., min_length=1, max_length=50, example="정다혜"
    )
    customer_email: str = Field(
        ..., min_length=1, example="customer@example.com"
    )
    email_content: str = Field(..., min_length=1, example="문의드립니다.")


# 문의하기(Contact) API - 응답(Res)
class ContactResponse(BaseModel):
    success: bool = True
