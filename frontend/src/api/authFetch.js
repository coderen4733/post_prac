import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../auth/tokenStorage";
import { reToken } from "./authApi";

// 백엔드(FastAPI) 서버 주소. frontend/.env의 VITE_API_BASE_URL 값을 읽어옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * fetch와 사용법은 같지만, 로그인 토큰(Authorization 헤더)을 자동으로 붙여줍니다.
 * access_token이 만료되어 401이 오면, refresh_token으로 한 번 재발급을 시도한 뒤
 * 같은 요청을 다시 보냅니다. 그마저 실패하면 토큰을 지우고 에러를 던집니다.
 * (admin/staff만 쓸 수 있는 게시글 생성/수정/삭제/이미지업로드 API에서 사용)
 */
export async function authFetch(path, options = {}) {
  const firstResponse = await fetchWithToken(path, options);

  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const { data } = await reToken(refreshToken);
    saveTokens(data);
  } catch {
    clearTokens();
    throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
  }

  return fetchWithToken(path, options);
}

function fetchWithToken(path, options) {
  const accessToken = getAccessToken();

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}
