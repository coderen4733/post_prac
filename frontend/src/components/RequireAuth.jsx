import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../auth/tokenStorage";

/**
 * 로그인해야만 볼 수 있는 화면(게시글 작성/수정)을 감싸는 컴포넌트입니다.
 * 로그인 토큰이 없으면 로그인 화면으로 보냅니다.
 * (실제 권한 검사는 백엔드가 하고, 이건 화면 진입을 미리 막아주는 용도입니다)
 */
export default function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
