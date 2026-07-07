import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendContactEmail } from "../api/contactApi";
import MessageDialog from "../components/MessageDialog";

/**
 * 문의하기(이메일 작성) 화면입니다.
 * 고객이 성함/이메일/문의내용을 입력해 제출하면 백엔드(POST /contact)가
 * 대표 이메일로 메일을 발송합니다.
 *
 * 발송 성공/실패 여부는 서버가 보내준 message를 안내창(MessageDialog)으로
 * 보여주고, "확인"을 누르면 성공했을 때만 CONTACT 화면으로 돌아갑니다.
 * (실패했을 때는 다시 시도할 수 있도록 이 화면에 남아있습니다)
 */
export default function ContactWritePage() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const { message } = await sendContactEmail({
        customerName,
        customerEmail,
        emailContent,
      });
      setIsSuccess(true);
      setResultMessage(message);
    } catch (error) {
      setIsSuccess(false);
      setResultMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogConfirm = () => {
    setResultMessage(null);
    if (isSuccess) {
      navigate("/contact");
    }
  };

  return (
    <div className="page">
      <h1>문의하기</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="성함을 입력하세요"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          className="title-input"
        />
        <input
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          className="title-input"
        />
        <textarea
          placeholder="문의 내용을 입력하세요"
          value={emailContent}
          onChange={(event) => setEmailContent(event.target.value)}
          className="title-input content-textarea"
        />

        <div className="post-form-actions">
          <button
            type="submit"
            className="post-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "발송 중..." : "작성완료"}
          </button>
          <button
            type="button"
            className="post-form-cancel"
            onClick={() => navigate("/contact")}
          >
            취소
          </button>
        </div>
      </form>

      {resultMessage && (
        <MessageDialog
          message={resultMessage}
          onConfirm={handleDialogConfirm}
        />
      )}
    </div>
  );
}
