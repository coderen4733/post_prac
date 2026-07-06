// 백엔드(FastAPI) 서버 주소. frontend/.env의 VITE_API_BASE_URL 값을 읽어옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 이미지 파일을 백엔드로 보내 S3에 업로드하고, 저장된 이미지의 url을 받아옵니다.
 * (POST /posts/images)
 */
export async function uploadPostImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/posts/images`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const data = await response.json();
  return data.url;
}

/**
 * 제목과 본문(HTML)으로 게시글을 생성합니다.
 * (POST /posts)
 */
export async function createPost({ title, content }) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error("게시글 생성에 실패했습니다.");
  }

  return response.json();
}

/**
 * 게시글 목록을 최신순으로 가져옵니다.
 * (GET /posts)
 */
export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`);

  if (!response.ok) {
    throw new Error("게시글 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

/**
 * 게시글 하나를 상세 조회합니다.
 * (GET /posts/{postId})
 */
export async function fetchPost(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

  if (!response.ok) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  return response.json();
}

/**
 * 게시글의 제목/본문을 수정합니다.
 * (PUT /posts/{postId})
 */
export async function updatePost(postId, { title, content }) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error("게시글 수정에 실패했습니다.");
  }

  return response.json();
}

/**
 * 게시글을 삭제합니다.
 * (DELETE /posts/{postId})
 */
export async function deletePost(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("게시글 삭제에 실패했습니다.");
  }
}
