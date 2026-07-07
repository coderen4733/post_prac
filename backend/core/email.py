import smtplib
from email.mime.text import MIMEText

from fastapi.concurrency import (
    run_in_threadpool,  # 동기 함수를 비동기 코드 안에서 안전하게 실행
)

from core.config import GOOGLE_APP_PW, MY_GOOGLE_EMAIL

# 기본세팅 - Gmail의 SMTP 서버 정보(SSL 포트)
_SMTP_HOST = "smtp.gmail.com"
_SMTP_PORT = 465


# 이메일 발송 명령 (홈페이지 문의하기 등에서 호출)
async def send_email(
    subject: str, body: str, reply_to: str | None = None
) -> None:
    # 1. 발송할 메일 내용(제목/본문) 구성
    message = MIMEText(body, _charset="utf-8")
    message["Subject"] = subject
    message["From"] = MY_GOOGLE_EMAIL
    message["To"] = MY_GOOGLE_EMAIL
    # 2. Reply-To를 지정해두면, 메일함에서 답장 버튼을 눌렀을 때
    #    고객 이메일 주소로 바로 답장할 수 있음
    if reply_to:
        message["Reply-To"] = reply_to
    # 3. smtplib은 동기(sync) 라이브러리이므로 run_in_threadpool()로 실행
    await run_in_threadpool(_send_message, message)


# Gmail SMTP 서버에 실제로 접속해서 메일을 보내는 함수(동기(sync) 함수)
def _send_message(message: MIMEText) -> None:
    # 1. SSL로 Gmail SMTP 서버에 접속
    with smtplib.SMTP_SSL(_SMTP_HOST, _SMTP_PORT) as server:
        # 2. Google 계정으로 로그인 (일반 비밀번호가 아닌 앱 비밀번호 사용)
        server.login(MY_GOOGLE_EMAIL, GOOGLE_APP_PW)
        # 3. 메일 발송
        server.send_message(message)
