import { useEffect, useRef } from "react";
import Quill from "quill";
import QuillResizeImage from "quill-resize-image";
import "quill/dist/quill.snow.css";
import { uploadPostImage } from "../api/postApi";

// 본문에 삽입된 이미지의 테두리를 드래그해서 크기를 조절할 수 있게
// 해주는 모듈입니다. Quill 자체에는 이미지 리사이즈 기능이 없어서
// 별도 모듈("resize")로 등록해줘야 합니다.
Quill.register("modules/resize", QuillResizeImage);

/**
 * Quill 기반 게시글 작성 에디터입니다.
 * 툴바의 이미지 버튼을 누르면, 파일을 선택하는 즉시 백엔드로 업로드해서
 * S3에 저장한 뒤 반환받은 url을 본문에 바로 삽입합니다.
 *
 * onReady로 Quill 인스턴스를 부모(App)에게 전달해서,
 * '게시글 등록' 시 본문 HTML(quill.root.innerHTML)을 꺼내 쓸 수 있게 합니다.
 *
 * initialContent를 넘기면(게시글 수정 화면) 에디터가 처음 만들어질 때
 * 그 내용을 미리 채워 넣습니다. 최초 마운트 시 한 번만 반영됩니다.
 */
export default function PostEditor({ onReady, initialContent = "" }) {
  const editorRef = useRef(null); // Quill이 그려질 div
  const quillRef = useRef(null); // 생성된 Quill 인스턴스 (중복 생성 방지용)

  useEffect(() => {
    // React StrictMode에서 useEffect가 두 번 실행되어도
    // Quill이 중복으로 만들어지지 않도록 막아줍니다.
    if (quillRef.current) {
      return;
    }

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "본문을 입력하세요. 이미지는 툴바 버튼으로 삽입합니다.",
      modules: {
        toolbar: {
          container: [
            ["bold", "italic", "underline"],
            [{ header: [1, 2, 3, false] }],
            ["image"],
          ],
          // 기본 이미지 핸들러 대신, S3 업로드 API를 호출하는
          // 우리만의 핸들러로 바꿔줍니다.
          handlers: {
            image: () => handleImageButtonClick(quill),
          },
        },
        resize: {}, // 이미지 리사이즈 모듈 활성화
      },
    });

    if (initialContent) {
      quill.clipboard.dangerouslyPasteHTML(initialContent);
    }

    quillRef.current = quill;
    onReady(quill);
    // initialContent는 최초 마운트 시에만 반영하는 값이라
    // 의도적으로 의존성 배열에 넣지 않았습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady]);

  return <div ref={editorRef} style={{ minHeight: "300px" }} />;
}

/**
 * 이미지 버튼 클릭 시:
 * 1) 숨겨진 파일 선택창을 띄우고
 * 2) 파일이 선택되면 S3로 업로드한 뒤
 * 3) 반환된 url을 커서 위치에 이미지로 삽입합니다.
 */
function handleImageButtonClick(quill) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      const imageUrl = await uploadPostImage(file);
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", imageUrl);
      quill.setSelection(range.index + 1);
    } catch (error) {
      alert(error.message);
    }
  };
}
