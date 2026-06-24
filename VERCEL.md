# Vercel 배포 가이드

## 현재 Git 상태

- 로컬 Git 초기화됨 (`git init`)
- **아직 커밋 없음, GitHub 연결 없음** → Vercel 배포 전에 GitHub에 올려야 합니다.

---

## 1단계: GitHub에 코드 올리기

### 1) GitHub에서 새 저장소 생성

1. https://github.com/new 접속
2. Repository name: `wedding-expo-site`
3. **Public** 또는 Private 선택
4. **Add a README** 체크 해제 (이미 있음)
5. Create repository

### 2) 로컬에서 커밋 & 푸시

PowerShell에서:

```powershell
cd C:\Users\0000\Projects\wedding-expo-site

git add .
git commit -m "Initial commit: wedding expo schedule site"

git branch -M main
git remote add origin https://github.com/본인아이디/wedding-expo-site.git
git push -u origin main
```

> GitHub 아이디와 저장소 URL은 본인 것으로 바꾸세요.

---

## 2단계: Neon DB 생성 (무료)

Vercel은 SQLite 파일 DB를 쓸 수 없어 **PostgreSQL**이 필요합니다.

1. https://neon.tech 가입
2. **New Project** 생성
3. **Connection string** 복사  
   예: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

---

## 3단계: Vercel 배포

1. https://vercel.com 가입 (GitHub 연동)
2. **Add New → Project**
3. `wedding-expo-site` 저장소 **Import**
4. **Environment Variables** 추가:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Neon 연결 문자열 |
| `ADMIN_PASSWORD` | 관리자 비밀번호 |
| `ADMIN_SECRET` | 랜덤 긴 문자열 |
| `NEXT_PUBLIC_SITE_URL` | `https://xxx.vercel.app` (배포 후 실제 URL) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Storage에서 발급 (아래 참고) |

5. **Deploy** 클릭

빌드 명령은 `package.json`에 이미 설정됨:
`prisma generate && prisma migrate deploy && next build`

---

## 4단계: Vercel Blob (이미지 업로드)

1. Vercel 프로젝트 → **Storage** 탭
2. **Create Database → Blob** 생성
3. 프로젝트에 연결 → `BLOB_READ_WRITE_TOKEN` 자동 추가
4. **Redeploy**

관리자에서 이미지 업로드 시 Blob에 영구 저장됩니다.

---

## 5단계: 배포 후 확인

| 페이지 | URL |
|--------|-----|
| 메인 | `https://your-app.vercel.app/` |
| 관리자 | `https://your-app.vercel.app/admin/login` |
| 사이트맵 | `https://your-app.vercel.app/sitemap.xml` |

`NEXT_PUBLIC_SITE_URL`을 실제 Vercel URL로 맞춘 뒤 **한 번 더 Redeploy** 하세요 (SEO용).

---

## 로컬 개발 (선택)

Neon DB 연결 문자열을 로컬 `.env`에 넣으면 로컬에서도 동일 DB 사용 가능:

```powershell
copy .env.example .env
# .env 편집 후
npm run db:migrate
npm run dev
```

---

## 이후 업데이트

```powershell
git add .
git commit -m "업데이트 내용"
git push
```

Vercel이 자동으로 재배포합니다. 박람회 일정은 **관리자 페이지**에서 매주 수정하면 됩니다.
