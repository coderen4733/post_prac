import { Route, Routes } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
import PostListPage from "./pages/PostListPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditPage from "./pages/PostEditPage";
import "./App.css";

/**
 * 화면 경로(url)와 페이지 컴포넌트를 연결합니다.
 * "/"                    -> 게시글 목록
 * "/write"                -> 게시글 작성
 * "/posts/:postId"        -> 게시글 상세
 * "/posts/:postId/edit"   -> 게시글 수정
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
        <Route path="/write" element={<PostWritePage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/posts/:postId/edit" element={<PostEditPage />} />
      </Routes>
    </>
  );
}
