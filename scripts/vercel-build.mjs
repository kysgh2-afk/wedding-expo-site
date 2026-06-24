import { execSync } from "node:child_process";

function run(command) {
  console.log(`\n> ${command}\n`);
  execSync(command, { stdio: "inherit" });
}

if (!process.env.DATABASE_URL) {
  console.error("\n❌ DATABASE_URL 환경 변수가 없습니다.\n");
  console.error("Vercel → Settings → Environment Variables 에서 추가하세요.");
  console.error("Neon(https://neon.tech) PostgreSQL 연결 문자열이 필요합니다.");
  console.error('예: postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require\n');
  process.exit(1);
}

run("prisma generate");
run("prisma migrate deploy");
run("next build");
