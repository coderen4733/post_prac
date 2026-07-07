import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../api/authApi";
import { saveTokens } from "../auth/tokenStorage";
import MessageDialog from "../components/MessageDialog";

/**
 * 관리자(admin/staff) 로그인 화면입니다.
 * 로그인에 성공하면 서버가 보내준 message를 안내창으로 보여주고,
 * "확인"을 누르면 토큰을 저장한 뒤 PROJECT(게시글 목록) 화면으로 이동합니다.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { message, data }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const response = await signIn({ email, password });
      setResult(response);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = () => {
    saveTokens(result.data);
    navigate("/");
  };

  return (
    <div className="page auth-page">
      <h1>로그인</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="title-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="title-input"
        />

        <div className="post-form-actions">
          <button
            type="submit"
            className="post-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
          <Link to="/signup" className="post-form-secondary">
            회원가입
          </Link>
        </div>
      </form>

      {result && (
        <MessageDialog message={result.message} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
