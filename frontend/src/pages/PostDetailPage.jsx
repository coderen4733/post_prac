import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePost, fetchPost } from "../api/postApi";
import { getRole } from "../auth/tokenStorage";

/**
 * 게시글 상세 화면입니다.
 * url의 postId로 백엔드(GET /posts/{postId})를 호출해 본문 전체를 보여줍니다.
 * "수정"/"삭제" 버튼은 로그인한 사용자의 role이 staff/admin일 때만 보입니다.
 */
export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const role = getRole();
  const canManage = role === "staff" || role === "admin";

  useEffect(() => {
    setIsLoading(true);
    fetchPost(postId)
      .then(setPost)
      .catch((error) => alert(error.message))
      .finally(() => setIsLoading(false));
  }, [postId]);

  const handleDelete = async () => {
    setIsConfirmOpen(false);
    try {
      await deletePost(postId);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="page">
      {isLoading && <p>불러오는 중...</p>}
      {!isLoading && !post && <p>게시글을 찾을 수 없습니다.</p>}

      {post && (
        <article className="post-detail">
          <div className="post-detail-header">
            <div>
              <h1>{post.title}</h1>
              <p className="post-card-date">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
            {canManage && (
              <div className="post-detail-actions">
                <Link to={`/posts/${postId}/edit`}>
                  <button type="button" className="post-detail-edit">
                    수정
                  </button>
                </Link>
                <button
                  type="button"
                  className="post-detail-delete"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <div
            className="content-preview"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      )}

      {isConfirmOpen && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>정말로 삭제하시겠습니까?</p>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="confirm-yes"
                onClick={handleDelete}
              >
                네
              </button>
              <button
                type="button"
                className="confirm-no"
                onClick={() => setIsConfirmOpen(false)}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
