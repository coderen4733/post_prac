# 프로젝트 가이드라인 (Project Guidelines)

## 1. 프로젝트 개요
- **기술 스택**: Python 3.13+, FastAPI, Poetry, MongoDB, AWS S3
- **프로젝트 목적**: 텍스트와 다중 이미지르르 자유롭게 혼합하여 배치할 수 있는 블로그형 게시판 서비스 구축
- **주요 특징**:
  - 미디어(사진)가 글 중간중간 삽입되는 Block-style, Rich Text 에디터 구조 지원
  - AWS S3를 활용한 대용량 이미지 업로드 및 관리
  - NoSQL(MongoDB)을 활용한 유연한 게시글 스키마 설계

## 2. 개발 및 빌드 명령어(Commands)
Claude가 코드를 수정하고 스스로 테스트하거나 검증할 때 사용할 명령어입니다.
- **의존성 설치**: `poetry install`
