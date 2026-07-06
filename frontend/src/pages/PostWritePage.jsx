import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { createPost } from "../api/postApi";

/**
 * 게시글 작성 화면입니다.
 * 등록에 성공하면 방금 작성한 글의 상세 화면으로 이동합니다.
 */
export default function PostWritePage() {
  const navigate = useNavigate();

  const handleSubmit = async ({ title, content }) => {
    const post = await createPost({ title, content });
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="page">
      <h1>PROJECT 등록</h1>

      <PostForm
        submitLabel="등록"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
