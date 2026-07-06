import { useCallback, useState } from "react";
import PostEditor from "./PostEditor";

/**
 * 게시글 작성/수정 화면에서 공통으로 쓰는 폼입니다.
 * (제목 입력 + Quill 에디터 + 저장 버튼)
 *
 * 실제로 저장하는 방식(생성 API를 부를지, 수정 API를 부를지)은
 * 화면마다 다르기 때문에, 저장 로직은 onSubmit prop으로 받아서 실행합니다.
 */
export default function PostForm({
  initialTitle = "",
  initialContent = "",
  submitLabel,
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [quill, setQuill] = useState(null); // PostEditor가 만들어준 Quill 인스턴스
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditorReady = useCallback((quillInstance) => {
    setQuill(quillInstance);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = quill?.root.innerHTML ?? "";
    const isContentEmpty = quill?.getText().trim().length === 0;

    if (!title.trim() || isContentEmpty) {
      alert("제목과 본문을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, content });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="title-input"
      />

      <PostEditor onReady={handleEditorReady} initialContent={initialContent} />

      <div className="post-form-actions">
        <button
          type="submit"
          className="post-form-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "저장 중..." : submitLabel}
        </button>
        <button
          type="button"
          className="post-form-cancel"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
}
