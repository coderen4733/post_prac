from fastapi import HTTPException, status

from apps.contact.models.schemas import ContactCreateRequest, ContactResponse
from core.email import send_email


# 문의하기(Contact) API
async def send_contact_email(
    payload: ContactCreateRequest,
) -> ContactResponse:
    # 1. 메일 제목 구성
    subject = (
        f"[홈페이지 문의] {payload.customer_name}님으로부터 "
        "새로운 문의 도착!"
    )
    # 2. 메일 본문 구성 (상단: 고객성함/고객이메일주소, 하단: 문의내용)
    body = (
        f"고객성함: {payload.customer_name}\n"
        f"고객이메일주소: {payload.customer_email}\n"
        "\n"
        "----------------------------------------\n"
        "\n"
        f"{payload.email_content}"
    )
    # 3. 메일 발송
    try:
        # 3-1. Reply-To를 고객 이메일로 지정해서, 답장 시 고객에게 바로 전달
        await send_email(subject, body, reply_to=payload.customer_email)
    # 3-2. 발송 실패 시(Gmail 서버 문제 등) 에러처리(502)
    except Exception as err:
        print(f"문의 메일 발송에 실패했습니다: {err}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",
        )
    # 4. 데이터 반환
    return ContactResponse(success=True)
