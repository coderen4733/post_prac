// 카카오맵은 npm 패키지가 아니라 <script> 태그로 SDK를 불러와서 씁니다.
// 이 파일은 그 SDK를 딱 한 번만 불러오고, 이미 불러온 뒤에는 같은 결과를
// 재사용하도록 도와주는 함수입니다.
let sdkLoadPromise = null;

export function loadKakaoMapsSdk() {
  // 1. 이미 불러온 적이 있다면 바로 재사용
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }
  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  const appKey = import.meta.env.VITE_KAKAO_JS_KEY;

  sdkLoadPromise = new Promise((resolve, reject) => {
    if (!appKey) {
      reject(new Error("VITE_KAKAO_JS_KEY가 설정되어 있지 않습니다."));
      return;
    }

    // 2. SDK 스크립트를 <head>에 추가
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.onload = () => {
      // autoload=false로 받았기 때문에, 실제 지도 기능은
      // kakao.maps.load()의 콜백이 실행된 뒤부터 사용할 수 있습니다.
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () => {
      sdkLoadPromise = null;
      reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
    };
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}
