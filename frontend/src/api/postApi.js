import { authFetch } from "./authFetch";

// 백엔드(FastAPI) 서버 주소. frontend/.env의 VITE_API_BASE_URL 값을 읽어옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// post API도 auth API와 마찬가지로 전부 { message, data } 형태로 응답이 감싸져 옵니다.
// 실패했을 때는 서버가 보내주는 실제 에러 사유(detail)를 우선 사용하고,
// 그마저 없으면 fallbackMessage를 사용합니다.
async function unwrap(response, fallbackMessage) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || fallbackMessage);
  }
  return response.json();
}

/**
 * 이미지 파일을 백엔드로 보내 S3에 업로드하고, 저장된 이미지의 url을 받아옵니다.
 * (POST /posts/images, admin/staff 전용이라 authFetch로 로그인 토큰을 붙입니다)
 */
export async function uploadPostImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await authFetch("/posts/images", {
    method: "POST",
    body: formData,
  });

  const { data } = await unwrap(response, "이미지 업로드에 실패했습니다.");
  return data.url;
}

/**
 * 제목과 본문(HTML)으로 게시글을 생성합니다.
 * (POST /posts, admin/staff 전용이라 authFetch로 로그인 토큰을 붙입니다)
 */
export async function createPost({ title, content }) {
  const response = await authFetch("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  return unwrap(response, "게시글 생성에 실패했습니다.");
}

/**
 * 게시글 목록을 최신순으로 가져옵니다.
 * (GET /posts)
 */
export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`);

  return unwrap(response, "게시글 목록을 불러오지 못했습니다.");
}

/**
 * 게시글 하나를 상세 조회합니다.
 * (GET /posts/{postId})
 */
export async function fetchPost(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

  return unwrap(response, "게시글을 찾을 수 없습니다.");
}

/**
 * 게시글의 제목/본문을 수정합니다.
 * (PUT /posts/{postId}, admin/staff 전용이라 authFetch로 로그인 토큰을 붙입니다)
 */
export async function updatePost(postId, { title, content }) {
  const response = await authFetch(`/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  return unwrap(response, "게시글 수정에 실패했습니다.");
}

/**
 * 게시글을 삭제합니다.
 * (DELETE /posts/{postId}, admin/staff 전용이라 authFetch로 로그인 토큰을 붙입니다)
 */
export async function deletePost(postId) {
  const response = await authFetch(`/posts/${postId}`, {
    method: "DELETE",
  });

  await unwrap(response, "게시글 삭제에 실패했습니다.");
}
