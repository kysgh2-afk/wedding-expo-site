"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor, isEditorContentEmpty } from "@/components/admin/RichTextEditor";

type ArticleFormData = {
  id?: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  sortOrder: number;
  isPublished: boolean;
};

type ArticleFormProps = {
  initialData?: ArticleFormData;
  mode: "create" | "edit";
};

const emptyForm: ArticleFormData = {
  title: "",
  excerpt: "",
  body: "",
  imageUrl: "",
  sortOrder: 0,
  isPublished: true,
};

export function ArticleForm({ initialData, mode }: ArticleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormData>(initialData ?? emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setUploading(false);

    if (!response.ok) {
      setError(data.error || "이미지 업로드에 실패했습니다.");
      return;
    }

    updateField("imageUrl", data.url);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (isEditorContentEmpty(form.body)) {
      setError("본문 내용을 입력해 주세요.");
      return;
    }

    setSaving(true);
    setError("");

    const url = mode === "create" ? "/api/articles" : `/api/articles/${form.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "저장에 실패했습니다.");
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "create" ? "새 콘텐츠 작성" : "콘텐츠 수정"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          사진, 글자색, 배경색, 제목 스타일 등 블로그처럼 자유롭게 작성할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">제목</span>
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="예: 웨딩박람회 방문 전 체크리스트"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">요약 (카드에 표시)</span>
          <textarea
            value={form.excerpt}
            onChange={(event) => updateField("excerpt", event.target.value)}
            className="min-h-24 w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="목록 카드에 보여줄 짧은 소개글"
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">본문</span>
          <RichTextEditor
            value={form.body}
            onChange={(html) => updateField("body", html)}
          />
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">정렬 순서</span>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(event) => updateField("sortOrder", Number(event.target.value))}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
          />
        </label>

        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-700">대표 이미지 (목록 카드용)</span>
          <div className="flex flex-wrap items-center gap-4">
            <label className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
              {uploading ? "업로드 중..." : "이미지 업로드"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
              />
            </label>
            {form.imageUrl ? (
              <div className="relative h-24 w-36 overflow-hidden rounded-xl border border-rose-100">
                <Image src={form.imageUrl} alt="미리보기" fill className="object-cover" />
              </div>
            ) : null}
          </div>
          <input
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="이미지 URL"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => updateField("isPublished", event.target.checked)}
            className="h-4 w-4 rounded border-rose-300 text-rose-600"
          />
          <span className="text-sm font-medium text-slate-700">사이트에 노출</span>
        </label>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="rounded-xl border border-slate-200 px-5 py-3 text-slate-600 hover:bg-slate-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}
