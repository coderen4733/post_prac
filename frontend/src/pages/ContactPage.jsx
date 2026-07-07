import { useState } from "react";
import { Link } from "react-router-dom";
import KakaoMap from "../components/KakaoMap";

// 주소/인스타그램/이메일 항목 앞에 붙는 아이콘입니다.
// (컬러 로고 이미지는 잠시 주석 처리하고, 아래 흑백 SVG 아이콘을 사용합니다)
// const LOCATION_ICON_SRC =
//   "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/logo-address.png";
// const INSTAGRAM_ICON_SRC =
//   "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/logo-insta.png";
// const EMAIL_ICON_SRC =
//   "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/logo-email.png";

// 흑백(line-icon) 버전의 주소/인스타그램/이메일 아이콘입니다.
// fill/stroke를 currentColor로 지정해서, 글자색(평소 #333 -> hover 시 빨간색)을
// 그대로 따라가도록 만들었습니다.
function LocationIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function EmailIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

/**
 * CONTACT 화면입니다. 왼쪽엔 로고 이미지 + 연락처 정보, 오른쪽엔
 * 카카오맵으로 사무실 위치를 보여줍니다.
 *
 * 주소를 클릭하면 지도를 원래 위치/축척으로 되돌립니다. 지도를 드래그/확대해서
 * 위치를 잃어버렸을 때 다시 찾아올 수 있도록, KakaoMap의 key를 바꿔서
 * 지도를 처음 상태로 다시 만듭니다(리마운트).
 *
 * 각 항목은 아이콘과 문구를 같은 링크/버튼 안에 두어서, 아이콘을 눌러도
 * 문구를 누른 것과 똑같이 동작합니다.
 *
 * 이메일을 클릭하면 mailto: 링크 대신, 문의 내용을 입력해서 바로 메일을
 * 보낼 수 있는 문의하기 화면(/contact/write)으로 이동합니다.
 */
export default function ContactPage() {
  const [mapKey, setMapKey] = useState(0);

  return (
    <div className="page contact-page">
      <h1>CONTACT</h1>

      <div className="contact-layout">
        <div className="contact-info">
          <img
            src="https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/contact-dahn3.png"
            alt="dahn.architects"
            className="contact-logo-image"
          />

          <ul className="contact-detail-list">
            <li>
              <button
                type="button"
                className="contact-link"
                onClick={() => setMapKey((prev) => prev + 1)}
              >
                <LocationIcon className="contact-icon" />
                <span>서울특별시 마포구 모래내로 7길 38 서원빌딩 2층</span>
              </button>
            </li>
            <li>
              <a
                className="contact-link"
                href="https://www.instagram.com/dahn.architects/"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon className="contact-icon" />
                <span>@dahn.architects</span>
              </a>
            </li>
            <li>
              <Link className="contact-link" to="/contact/write">
                <EmailIcon className="contact-icon" />
                <span>dhj@dahn-architects.com</span>
              </Link>
            </li>
          </ul>
        </div>
        <KakaoMap key={mapKey} />
      </div>
    </div>
  );
}
