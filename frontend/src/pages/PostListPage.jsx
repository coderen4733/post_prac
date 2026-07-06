import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../api/postApi";

/**
 * 게시글 목록 화면입니다.
 * 백엔드(GET /posts)에서 최신순으로 정렬된 목록을 받아와,
 * 왼쪽 썸네일 + 오른쪽 날짜/제목 형태의 리스트로 보여줍니다.
 */
export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((error) => alert(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="projects-page">
      {isLoading && <p className="projects-status">불러오는 중...</p>}
      {!isLoading && posts.length === 0 && (
        <p className="projects-status">아직 작성된 글이 없습니다.</p>
      )}

      <ul className="projects-list">
        {posts.map((post) => (
          <li key={post.id} className="project-row">
            <Link to={`/posts/${post.id}`} className="project-row-link">
              <div className="project-thumb">
                {post.thumbnail && <img src={post.thumbnail} alt="" />}
              </div>
              <div className="project-info">
                <time className="project-date">
                  {formatDate(post.created_at)}
                </time>
                <h2 className="project-title">{post.title}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "2026-07-02T..." 같은 날짜를 "Jul 2, 2026"처럼 표시합니다.
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
