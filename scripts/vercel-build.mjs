import { execSync } from "node:child_process";

function run(command, env = process.env) {
  console.log(`\n> ${command}\n`);
  execSync(command, { stdio: "inherit", env });
}

function runMigrate() {
  const attempts = [];

  if (process.env.DIRECT_URL?.trim()) {
    attempts.push({ label: "DIRECT_URL", url: process.env.DIRECT_URL.trim() });
  }

  if (process.env.DATABASE_URL?.trim()) {
    attempts.push({ label: "DATABASE_URL", url: process.env.DATABASE_URL.trim() });
  }

  let lastError = null;

  for (const attempt of attempts) {
    try {
      console.log(`\nℹ️  prisma migrate deploy 시도: ${attempt.label}\n`);
      run("prisma migrate deploy", {
        ...process.env,
        DATABASE_URL: attempt.url,
      });
      return;
    } catch (error) {
      lastError = error;
      console.error(`\n⚠️  ${attempt.label} 로 마이그레이션 실패\n`);
    }
  }

  console.error("\n❌ prisma migrate deploy 실패");
  console.error("확인 사항:");
  console.error("1. Vercel → Settings → Environment Variables → DATABASE_URL");
  console.error("2. Neon 사용 시 DIRECT_URL(직접 연결) 추가");
  console.error("3. Neon 대시보드 → Connection details → Direct connection\n");
  if (lastError) throw lastError;
  process.exit(1);
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error("\n❌ DATABASE_URL 환경 변수가 없습니다.\n");
  console.error("Vercel → Settings → Environment Variables 에서 추가하세요.");
  console.error("Neon(https://neon.tech) PostgreSQL 연결 문자열이 필요합니다.");
  console.error('예: postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require\n');
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL.trim();

if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
  console.error("\n❌ DATABASE_URL은 PostgreSQL 연결 문자열이어야 합니다.\n");
  console.error('현재 값이 postgresql:// 또는 postgres:// 로 시작하지 않습니다.');
  console.error("Vercel 환경 변수의 DATABASE_URL을 Neon 연결 문자열로 설정하세요.\n");
  process.exit(1);
}

run("prisma generate");

try {
  runMigrate();
} catch {
  process.exit(1);
}

run("next build");
