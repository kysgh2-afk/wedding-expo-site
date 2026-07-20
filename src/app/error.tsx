"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <div className="max-w-md space-y-4 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-rose-100">
        <h1 className="text-xl font-bold text-slate-900">페이지를 불러오지 못했습니다</h1>
        <p className="text-sm leading-relaxed text-slate-600">
          서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-left text-xs text-rose-700">
            {error.message}
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
