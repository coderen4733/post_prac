/**
 * 게시글 삭제 확인창과 같은 모양이지만, 버튼이 "확인" 하나뿐인 안내창입니다.
 * 회원가입/로그인 성공 시 서버가 보내주는 message를 보여줄 때 씁니다.
 */
export default function MessageDialog({ message, onConfirm }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-ok" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
