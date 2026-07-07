/**
 * NEWS/ABOUT/CONTACT처럼 아직 내용을 만들지 않은 화면에 쓰는 임시 페이지입니다.
 * 지금 어느 페이지에 들어와 있는지 알 수 있도록 화면 중앙에 제목만 보여줍니다.
 */
export default function PlaceholderPage({ title }) {
  return (
    <div className="page placeholder-page">
      <h1>{title}</h1>
    </div>
  );
}
