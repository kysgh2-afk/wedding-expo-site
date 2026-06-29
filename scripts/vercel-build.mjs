import { execSync } from "node:child_process";

function firstEnv(...names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return { name, value };
  }
  return null;
}

function isPostgresUrl(url) {
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

function resolveDatabaseConfig() {
  const database = firstEnv(
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "NEON_DATABASE_URL",
  );

  const direct = firstEnv(
    "DIRECT_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_DIRECT_URL",
    "NEON_DIRECT_URL",
  );

  return { database, direct };
}

function run(command, env = process.env) {
  console.log(`\n> ${command}\n`);
  execSync(command, { stdio: "inherit", env });
}

function runMigrate(databaseUrl, directUrl) {
  const attempts = [];

  if (directUrl?.value) {
    attempts.push({ label: directUrl.name, url: directUrl.value });
  }

  if (databaseUrl?.value) {
    attempts.push({ label: databaseUrl.name, url: databaseUrl.value });
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

const { database, direct } = resolveDatabaseConfig();

if (!database) {
  console.error("\n❌ PostgreSQL 연결 환경 변수가 없습니다.\n");
  console.error("Vercel → 프로젝트 → Settings → Environment Variables 에서 아래 중 하나를 추가하세요:\n");
  console.error("  이름: DATABASE_URL");
  console.error("  값: postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require\n");
  console.error("Neon DB 만드는 방법:");
  console.error("  1. https://neon.tech 가입");
  console.error("  2. New Project 생성");
  console.error("  3. Connection string 복사");
  console.error("  4. Vercel에 DATABASE_URL 로 붙여넣기");
  console.error("  5. Environment: Production, Preview, Development 모두 체크");
  console.error("  6. 저장 후 Deployments → Redeploy\n");
  console.error("권장 추가 변수:");
  console.error("  DIRECT_URL = Neon Direct connection (마이그레이션 안정화)");
  console.error("  ADMIN_PASSWORD = 관리자 비밀번호");
  console.error("  ADMIN_SECRET = 랜덤 긴 문자열");
  console.error("  NEXT_PUBLIC_SITE_URL = https://본인도메인.vercel.app\n");
  process.exit(1);
}

if (!isPostgresUrl(database.value)) {
  console.error(`\n❌ ${database.name} 값이 PostgreSQL 연결 문자열이 아닙니다.\n`);
  console.error('postgresql:// 또는 postgres:// 로 시작해야 합니다.');
  console.error("Neon Connection string을 그대로 복사해 넣었는지 확인하세요.\n");
  process.exit(1);
}

const buildEnv = {
  ...process.env,
  DATABASE_URL: database.value,
};

if (direct?.value) {
  buildEnv.DIRECT_URL = direct.value;
}

console.log(`\nℹ️  DB 연결 변수 사용: ${database.name}\n`);
if (direct) {
  console.log(`ℹ️  마이그레이션 직접 연결: ${direct.name}\n`);
}

run("prisma generate", buildEnv);

try {
  runMigrate(database, direct);
} catch {
  process.exit(1);
}

run("next build", buildEnv);
