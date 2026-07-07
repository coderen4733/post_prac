// 백엔드(FastAPI) 서버 주소. frontend/.env의 VITE_API_BASE_URL 값을 읽어옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// auth API는 전부 { message, data } 형태로 응답이 감싸져 옵니다.
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
 * 이름/이메일/비밀번호로 회원가입합니다.
 * (POST /auth/sign-up)
 */
export async function signUp({ name, email, password, passwordConfirm }) {
  const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirm: passwordConfirm,
    }),
  });

  return unwrap(response, "회원가입에 실패했습니다.");
}

/**
 * 이메일/비밀번호로 로그인해서 access_token/refresh_token을 받아옵니다.
 * (POST /auth/sign-in)
 */
export async function signIn({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return unwrap(response, "이메일 또는 비밀번호가 올바르지 않습니다.");
}

/**
 * 로그아웃합니다. 서버에 저장된 refresh_token을 지워서 재사용을 막습니다.
 * (POST /auth/sign-out)
 */
export async function signOut(refreshToken) {
  await fetch(`${API_BASE_URL}/auth/sign-out`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

/**
 * refresh_token으로 새 access_token을 재발급받습니다.
 * (POST /auth/re-token)
 */
export async function reToken(refreshToken) {
  const response = await fetch(`${API_BASE_URL}/auth/re-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  return unwrap(response, "세션 갱신에 실패했습니다.");
}
