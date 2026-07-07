// 정다혜 대표 프로필 사진입니다. (원본은 인스타그램이 아닌 S3에 영구 보관)
const PROFILE_IMAGE_SRC =
  "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/about-profile-jdh.jpg";

// "건축사사무소 단" 소개 위에 들어가는 사진입니다.
const INTRO_IMAGE_SRC =
  "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/about-dahn.png";

/**
 * ABOUT 화면입니다. md/about.md에 정리된 내용을 그대로 옮겨 보여줍니다.
 * 왼쪽엔 "건축사사무소 단"이라는 이름에 담긴 의미, 오른쪽엔 대표 프로필
 * (사진 + 경력/수상/자격)을 좌우로 나란히 보여줍니다.
 */
export default function AboutPage() {
  return (
    <div className="page about-page">
      <h1>ABOUT</h1>

      <div className="about-layout">
        <section className="about-intro">
          <img
            src={INTRO_IMAGE_SRC}
            alt="건축사사무소 단"
            className="about-intro-image"
          />
          <h2>건축사사무소 단</h2>
          <p className="about-intro-subtitle">dahn.architects</p>
          <p>
            의미가 하나로 고정되지 않는 이름이길 바랐습니다. 듣는 순간 어떤
            하나의 정의로 바로 인식되기보다, 여러 층위의 해석이 열려 있는
            이름이었으면 했습니다. 건축 역시 하나의 메시지를 강요하기보다,
            시간이 지나며 각자의 감각으로 읽히는 공간이 되어야 한다고
            생각합니다.
          </p>
          <p>
            또 하나는 순수 한글 이름이라는 점입니다. 불필요한 수식 없이
            발음 자체가 간결하고 단단한 단어, 그리고 이 땅의 환경과 맥락
            위에서 작업하는 건축사무소로서 언어에서도 출발점을 분명히 하고
            싶었습니다.
          </p>
          <p>
            마지막으로, 건축을 바라보는 관점과 가장 맞닿아 있는
            단어입니다. 건축은 결국 땅이라는 부지 위에 건물을 세우고, 그
            안에 삶이 담기게 만드는 일이라고 생각합니다. 땅과 건물, 공간과
            삶을 연결하는 그 지점이 바로 '단'이라고 보았습니다.
          </p>
          <p>
            '단'에는 모든 것은 가장 작은 시작점에서 비롯된다는 의미도
            있습니다. 재료의 끝, 빛의 시작, 공간이 처음 인식되는 순간처럼,
            형태 이전에 존재하는 건축의 근원적인 지점을 생각하는
            태도입니다. 무엇을 더하기보다, 본질에 가장 가까운
            지점에서부터 정확하게 시작하는 것. 그것이 건축사사무소 단이
            지향하는 건축입니다.
          </p>
        </section>

        <section className="about-profile">
          <div className="about-profile-header">
            <img
              src={PROFILE_IMAGE_SRC}
              alt="정다혜 대표"
              className="about-profile-photo"
            />
            <div>
              <h2>정다혜</h2>
              <p className="about-profile-role">대표, 건축사</p>
            </div>
          </div>

          <div className="about-profile-details">
            <div className="about-profile-block">
              <h3>PROFESSIONAL EXPERIENCE</h3>
              <ul>
                <li>2021-2026 삼성물산</li>
                <li>2013-2020 SK에코플랜트</li>
                <li>2003-2012 네이버건설</li>
                <li>1999-2002 공간E&amp;C</li>
              </ul>
            </div>

            <div className="about-profile-block">
              <h3>AWARDS</h3>
              <ul>
                <li>2019 프리츠커 건축상(미국 하얏트 재단)</li>
                <li>2011 RIBA로열골드메달(RIBA 영국왕립건축가협회)</li>
                <li>2002 한국건축문화대상(국토교통부)</li>
              </ul>
            </div>

            <div className="about-profile-block">
              <h3>CERTIFICATES</h3>
              <ul>
                <li>건축사(Certified Architect)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
