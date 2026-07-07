import { Route, Routes } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
import RequireAuth from "./components/RequireAuth";
import PostListPage from "./pages/PostListPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ContactPage from "./pages/ContactPage";
import "./App.css";

/**
 * 화면 경로(url)와 페이지 컴포넌트를 연결합니다.
 * "/"                    -> 게시글 목록
 * "/login"                -> 로그인
 * "/signup"                -> 회원가입
 * "/news", "/about"       -> 아직 내용 없는 임시 페이지
 * "/contact"               -> 연락처 + 카카오맵
 * "/write"                -> 게시글 작성 (로그인 필요)
 * "/posts/:postId"        -> 게시글 상세
 * "/posts/:postId/edit"   -> 게시글 수정 (로그인 필요)
 *
 * SiteHeader(로고+메뉴)는 모든 화면에서 공통으로 보여야 하므로
 * Routes 바깥, 화면 맨 위에 한 번만 둡니다.
 */
export default function App() {
  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/news" element={<PlaceholderPage title="NEWS" />} />
        <Route path="/about" element={<PlaceholderPage title="ABOUT" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/write"
          element={
            <RequireAuth>
              <PostWritePage />
            </RequireAuth>
          }
        />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route
          path="/posts/:postId/edit"
          element={
            <RequireAuth>
              <PostEditPage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}
