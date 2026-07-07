from fastapi import APIRouter, status

from apps.contact import service
from apps.contact.models.schemas import ContactCreateRequest, ContactResponse
from common.response import ResponseSchema

contact_router = APIRouter()


# 문의하기(Contact) API
# 로그인하지 않은 홈페이지 방문객(고객)도 사용할 수 있어야 하므로
# 인증(로그인) 없이 누구나 호출 가능
@contact_router.post(
    "",
    response_model=ResponseSchema[ContactResponse],
    status_code=status.HTTP_200_OK,
)
async def create_contact(payload: ContactCreateRequest):
    # 1. Data(Router <- Service)
    data = await service.send_contact_email(payload)
    # 2. Response(Router -> FrontEnd)
    return {"message": "문의가 정상적으로 접수되었습니다.", "data": data}
