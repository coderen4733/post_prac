import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { fetchPost, updatePost } from "../api/postApi";

/**
 * 게시글 수정 화면입니다.
 * 기존 글을 불러와 폼에 미리 채워두고, 저장하면 상세 화면으로 돌아갑니다.
 */
export default function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchPost(postId)
      .then(setPost)
      .catch((error) => alert(error.message))
      .finally(() => setIsLoading(false));
  }, [postId]);

  const handleSubmit = async ({ title, content }) => {
    await updatePost(postId, { title, content });
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="page">
      <h1>PROJECT 수정</h1>

      {isLoading && <p>불러오는 중...</p>}

      {post && (
        <PostForm
          key={post.id}
          initialTitle={post.title}
          initialContent={post.content}
          submitLabel="완료"
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
      )}
    </div>
  );
}
