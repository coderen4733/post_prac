// 백엔드(FastAPI) 서버 주소. frontend/.env의 VITE_API_BASE_URL 값을 읽어옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// contact API도 { message, data } 형태로 응답이 감싸져 옵니다.
// 실패했을 때는 서버가 보내주는 실제 에러 사유(detail)를 우선 사용하고,
// 그마저 없으면 fallbackMessage를 사용합니다.
async function unwrap(response, fallbackMessage) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || fallbackMessage);
  }
  return response.json();
}

/**
 * 홈페이지 문의하기 메일을 발송합니다. 로그인 없이 누구나 호출 가능합니다.
 * (POST /contact)
 */
export async function sendContactEmail({
  customerName,
  customerEmail,
  emailContent,
}) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_name: customerName,
      customer_email: customerEmail,
      email_content: emailContent,
    }),
  });

  return unwrap(response, "메일 발송에 실패했습니다.");
}
