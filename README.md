# 웨딩박람회 일정 사이트

[wedding-expo.kr](https://wedding-expo.kr/) 스타일의 웨딩박람회 일정 모음 사이트입니다.  
관리자 페이지에서 **이미지, 일정, 링크**를 쉽게 등록·수정할 수 있어 매주 업데이트에 적합합니다.

## 주요 기능

- 전국 웨딩박람회 카드형 일정 목록 (서울·경기 / 지방 필터)
- 박람회별 이미지, 장소, 기간, 상태(모집중/마감/예정), 신청 링크
- `/admin` 관리자 패널 (로그인 후 CRUD + 이미지 업로드)
- FAQ·방문 꿀팁 섹션
- Cloudways(Node.js + MySQL) 배포 지원

## 로컬 실행

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin/login
- 기본 비밀번호: `.env`의 `ADMIN_PASSWORD` (기본값 `admin1234`)

## 관리자 사용법

1. `/admin/login` 에서 로그인
2. **새 박람회** 버튼으로 일정 추가
3. 이미지 업로드 또는 URL 입력
4. 신청/상세 페이지 링크 입력
5. 저장 후 메인 페이지에서 확인

매주 업데이트 시 기존 박람회는 **수정**하거나 지난 일정은 **숨김** 처리하세요.

## Cloudways 배포 가이드

### 1. 서버 준비

1. Cloudways에서 **Node.js 애플리케이션** 생성
2. MySQL 데이터베이스 생성 후 접속 정보 확인

### 2. 환경 변수 설정

Cloudways Application Settings → Environment Variables:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
ADMIN_PASSWORD="강력한-비밀번호"
ADMIN_SECRET="랜덤-시크릿-키"
NODE_ENV="production"
```

> 프로덕션에서는 `prisma/schema.prisma`의 `provider`를 `mysql`로 변경하세요.

### 3. MySQL로 전환 (프로덕션)

`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"
}
```

`.env`의 `DATABASE_URL`을 Cloudways MySQL 연결 문자열로 설정한 뒤:

```bash
npx prisma migrate deploy
npm run db:seed   # 선택: 샘플 데이터
```

### 4. 배포

Git 저장소 연결 후 Cloudways에서 배포하거나, SSH로 접속해:

```bash
npm install
npm run build
npm start
```

Cloudways Node.js 앱의 **Start Script**를 `npm start`로 설정하고, **Build Script**를 `npm run build`로 설정하세요.

### 5. 이미지 업로드

업로드된 이미지는 `public/uploads/`에 저장됩니다.  
서버 재배포 시 이미지가 유지되도록 해당 폴더를 영구 스토리지에 두거나, Cloudways 볼륨/백업을 설정하세요.

## 기술 스택

- Next.js 16 (App Router)
- Prisma + SQLite(MySQL 프로덕션)
- Tailwind CSS
- TypeScript

## 프로젝트 구조

```
src/
  app/              # 페이지 및 API
  components/       # UI 컴포넌트
  lib/              # DB, 인증, 유틸
prisma/             # DB 스키마 및 시드
public/uploads/     # 업로드 이미지
```
