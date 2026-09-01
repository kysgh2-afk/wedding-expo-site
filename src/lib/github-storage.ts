const DEFAULT_REPOSITORY = "kysgh2-afk/wedding-expo-site";
const DEFAULT_BRANCH = "main";

type GitHubContentResponse = {
  content?: string;
  encoding?: string;
  sha?: string;
  message?: string;
};

export type GitHubFile = {
  bytes: Buffer;
  sha: string;
};

function getRepository() {
  const configured = process.env.GITHUB_CONTENT_REPOSITORY?.trim();
  const inferred =
    process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
      ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
      : "";
  const repository = configured || inferred || DEFAULT_REPOSITORY;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error("GitHub 저장소 주소가 올바르지 않습니다.");
  }
  return repository;
}

function getBranch() {
  return process.env.GITHUB_CONTENT_BRANCH?.trim() || DEFAULT_BRANCH;
}

function getToken() {
  return process.env.GITHUB_CONTENT_TOKEN?.trim() || null;
}

export function hasGitHubWriteCredentials() {
  return Boolean(getToken());
}

function githubFileUrl(pathname: string) {
  const repository = getRepository();
  const encodedPath = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://api.github.com/repos/${repository}/contents/${encodedPath}`;
}

async function parseError(response: Response) {
  let message = `GitHub 요청 실패 (${response.status})`;
  try {
    const payload = (await response.json()) as GitHubContentResponse;
    if (payload.message) message = payload.message;
  } catch {
    // Keep the status-based message when GitHub did not return JSON.
  }
  return message;
}

export async function readGitHubFile(pathname: string): Promise<GitHubFile | null> {
  const token = getToken();
  const url = new URL(githubFileUrl(pathname));
  url.searchParams.set("ref", getBranch());
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "WeddingLast-Content-Admin",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await parseError(response));

  const payload = (await response.json()) as GitHubContentResponse;
  if (!payload.sha || payload.encoding !== "base64" || typeof payload.content !== "string") {
    throw new Error("GitHub에서 저장 파일을 읽지 못했습니다.");
  }

  return {
    bytes: Buffer.from(payload.content.replace(/\s/g, ""), "base64"),
    sha: payload.sha,
  };
}

export async function writeGitHubFile(
  pathname: string,
  bytes: Buffer,
  message: string,
  sha?: string,
) {
  const token = getToken();
  if (!token) throw new Error("GitHub 콘텐츠 저장소가 연결되지 않았습니다.");

  const response = await fetch(githubFileUrl(pathname), {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "WeddingLast-Content-Admin",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message,
      content: bytes.toString("base64"),
      branch: getBranch(),
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) throw new Error(await parseError(response));
}
