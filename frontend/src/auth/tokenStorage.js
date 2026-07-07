// 로그인 토큰을 브라우저 localStorage에 저장/조회하는 유틸입니다.
const ACCESS_TOKEN_KEY = "dahn_access_token";
const REFRESH_TOKEN_KEY = "dahn_refresh_token";
const ROLE_KEY = "dahn_role";

/**
 * 로그인/토큰 재발급에 성공했을 때 토큰을 저장합니다.
 * refresh_token/role은 재발급 응답엔 없을 수 있어서, 넘어온 경우에만 갱신합니다.
 */
export function saveTokens({ access_token, refresh_token, role }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  if (refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  }
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isLoggedIn() {
  return Boolean(getAccessToken());
}
