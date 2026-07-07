import { useState } from "react";
import KakaoMap from "../components/KakaoMap";

// 주소/인스타그램/이메일 항목 앞에 붙는 아이콘입니다.
const LOCATION_ICON_SRC =
  "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/logo-address.png";
const INSTAGRAM_ICON_SRC =
  "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/logo-insta.png";
const EMAIL_ICON_SRC =
  "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/logo-email.png";

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
 */
export default function ContactPage() {
  const [mapKey, setMapKey] = useState(0);

  return (
    <div className="page contact-page">
      <h1>CONTACT</h1>

      <div className="contact-layout">
        <div className="contact-info">
          <img
            src="https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/contact-dahn.png"
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
                <img
                  src={LOCATION_ICON_SRC}
                  alt=""
                  className="contact-icon"
                  width="18"
                  height="18"
                />
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
                <img
                  src={INSTAGRAM_ICON_SRC}
                  alt=""
                  className="contact-icon"
                  width="18"
                  height="18"
                />
                <span>@dahn.architects</span>
              </a>
            </li>
            <li>
              <a className="contact-link" href="mailto:dhj@dahn-architects.com">
                <img
                  src={EMAIL_ICON_SRC}
                  alt=""
                  className="contact-icon"
                  width="18"
                  height="18"
                />
                <span>dhj@dahn-architects.com</span>
              </a>
            </li>
          </ul>
        </div>
        <KakaoMap key={mapKey} />
      </div>
    </div>
  );
}
