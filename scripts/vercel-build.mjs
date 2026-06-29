import { execSync } from "node:child_process";

function run(command, env = process.env) {
  console.log(`\n> ${command}\n`);
  execSync(command, { stdio: "inherit", env });
}

if (!process.env.DATABASE_URL) {
  console.error("\n❌ DATABASE_URL 환경 변수가 없습니다.\n");
  console.error("Vercel → Settings → Environment Variables 에서 추가하세요.");
  console.error("Neon(https://neon.tech) PostgreSQL 연결 문자열이 필요합니다.");
  console.error('예: postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require\n');
  process.exit(1);
}

if (!process.env.DATABASE_URL.startsWith("postgresql://") && !process.env.DATABASE_URL.startsWith("postgres://")) {
  console.error("\n❌ DATABASE_URL은 PostgreSQL 연결 문자열이어야 합니다.\n");
  console.error('현재 값이 postgresql:// 또는 postgres:// 로 시작하지 않습니다.');
  console.error("Vercel 환경 변수의 DATABASE_URL을 Neon 연결 문자열로 설정하세요.\n");
  process.exit(1);
}

run("prisma generate");

const migrateEnv = { ...process.env };
if (process.env.DIRECT_URL) {
  console.log("\nℹ️  마이그레이션에 DIRECT_URL을 사용합니다. (Neon 권장)\n");
  migrateEnv.DATABASE_URL = process.env.DIRECT_URL;
}

try {
  run("prisma migrate deploy", migrateEnv);
} catch {
  console.error("\n❌ prisma migrate deploy 실패");
  console.error("Neon을 쓰는 경우 Vercel에 DIRECT_URL(직접 연결)도 추가해 보세요.");
  console.error("Neon 대시보드 → Connection details → Direct connection\n");
  process.exit(1);
}

run("next build");
