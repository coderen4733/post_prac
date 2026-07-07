import { useEffect, useRef, useState } from "react";
import { loadKakaoMapsSdk } from "../utils/loadKakaoMapsSdk";

// dahn.architects 실제 사무실 좌표
const OFFICE_POSITION = { lat: 37.567459634237, lng: 126.910934800779 };

// 카카오맵 기본 마커 대신 쓸 커스텀 마커 이미지입니다.
// 원형 배지 모양(뾰족한 핀 끝이 없음)이라, 이미지 중심을 좌표 기준점으로 잡습니다.
const MARKER_IMAGE_SRC =
  "https://coderen-s3.s3.ap-northeast-2.amazonaws.com/postprac/logo-address.png";
const MARKER_IMAGE_SIZE = 44;

/**
 * 카카오맵으로 사무실 위치를 보여주는 컴포넌트
 * SDK 로딩에 실패하면(키 미설정, 등록되지 않은 도메인 등) 안내 문구만 보여줌
 * 지도 타입(일반/스카이뷰) 전환 컨트롤과 확대/축소 컨트롤을 함께 표시함
 */
export default function KakaoMap() {
  const mapContainerRef = useRef(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    loadKakaoMapsSdk()
      .then((kakao) => {
        if (isCancelled || !mapContainerRef.current) {
          return;
        }
        // 1. 지도 중심 좌표로 지도 생성
        const center = new kakao.maps.LatLng(
          OFFICE_POSITION.lat,
          OFFICE_POSITION.lng,
        );
        const map = new kakao.maps.Map(mapContainerRef.current, {
          center,
          level: 3,
        });
        // 2. 사무실 위치에 커스텀 이미지 마커 표시
        const markerImage = new kakao.maps.MarkerImage(
          MARKER_IMAGE_SRC,
          new kakao.maps.Size(MARKER_IMAGE_SIZE, MARKER_IMAGE_SIZE),
          {
            offset: new kakao.maps.Point(
              MARKER_IMAGE_SIZE / 2,
              MARKER_IMAGE_SIZE / 2,
            ),
          },
        );
        new kakao.maps.Marker({ position: center, map, image: markerImage });

        // 3. 지도 타입(일반지도/스카이뷰) 전환 컨트롤을 오른쪽 위에 추가
        const mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 4. 확대/축소 컨트롤을 오른쪽에 추가
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
      })
      .catch((error) => {
        if (!isCancelled) {
          setLoadError(error.message);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="kakao-map">
      {loadError ? (
        <p className="kakao-map-error">{loadError}</p>
      ) : (
        <div ref={mapContainerRef} className="kakao-map-canvas" />
      )}
    </div>
  );
}
