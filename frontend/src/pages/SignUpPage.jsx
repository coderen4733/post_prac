import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";
import MessageDialog from "../components/MessageDialog";

/**
 * 회원가입 화면입니다.
 * 가입에 성공하면 서버가 보내준 message를 안내창으로 보여주고,
 * "확인"을 누르면 PROJECT(게시글 목록) 화면으로 이동합니다.
 * "취소" 버튼을 누르면 가입을 진행하지 않고 로그인 화면으로 돌아갑니다.
 */
export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const { message } = await signUp({
        name,
        email,
        password,
        passwordConfirm,
      });
      setResultMessage(message);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <h1>회원가입</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="title-input"
        />
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
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          className="title-input"
        />

        <div className="post-form-actions">
          <button
            type="submit"
            className="post-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
          <button
            type="button"
            className="post-form-cancel"
            onClick={() => navigate("/login")}
          >
            취소
          </button>
        </div>
      </form>

      {resultMessage && (
        <MessageDialog message={resultMessage} onConfirm={() => navigate("/")} />
      )}
    </div>
  );
}
