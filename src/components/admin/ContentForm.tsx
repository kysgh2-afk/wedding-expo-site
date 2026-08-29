"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ExpoImage } from "@/components/ExpoImage";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { uploadImageFile } from "@/lib/upload-image";

export type ContentFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string;
  category: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  isPublished: boolean;
  publishedAt: string;
};

const emptyForm: ContentFormData = {
  title: "",
  slug: "",
  excerpt: "",
  contentHtml: "<p><br></p>",
  coverImageUrl: "",
  category: "웨딩 가이드",
  author: "웨딩라스트 편집팀",
  seoTitle: "",
  seoDescription: "",
  keywords: "",
  isPublished: true,
  publishedAt: new Date().toISOString().slice(0, 10),
};

export function ContentForm({ mode, initialData }: { mode: "create" | "edit"; initialData?: ContentFormData }) {
  const router = useRouter();
  const [form, setForm] = useState(initialData ?? emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof ContentFormData>(key: K, value: ContentFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadCover(file: File) {
    setUploading(true);
    setError("");
    const result = await uploadImageFile(file);
    setUploading(false);
    if (!result.ok) return setError(result.error);
    update("coverImageUrl", result.url);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const url = mode === "create" ? "/api/content" : `/api/content/${form.id}`;
    const response = await fetch(url, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    const result = await response.json();
    if (!response.ok) return setError(result.error || "저장에 실패했습니다.");
    router.push("/admin/content");
    router.refresh();
  }

  const inputClass = "w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{mode === "create" ? "새 콘텐츠 작성" : "콘텐츠 수정"}</h1>
          <p className="mt-1 text-sm text-slate-500">블로그처럼 본문을 꾸미고 이미지와 SEO 정보를 함께 설정하세요.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.push("/admin/content")} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">취소</button>
          <button type="submit" disabled={saving || uploading} className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? "저장 중..." : "저장하기"}</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
          <label className="block space-y-2"><span className="text-sm font-semibold text-slate-700">제목</span><input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} placeholder="예: 결혼 준비 체크리스트 총정리" required /></label>
          <label className="block space-y-2"><span className="text-sm font-semibold text-slate-700">요약</span><textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} className={`${inputClass} min-h-24`} placeholder="목록과 검색 결과에 표시될 글 소개" required /></label>
          <div className="space-y-2"><span className="text-sm font-semibold text-slate-700">본문</span><RichTextEditor value={form.contentHtml} onChange={(value) => update("contentHtml", value)} onError={setError} /></div>
        </div>

        <aside className="space-y-5">
          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
            <h2 className="font-bold text-slate-900">발행 설정</h2>
            <label className="block space-y-2"><span className="text-sm text-slate-700">카테고리</span><input value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass} /></label>
            <label className="block space-y-2"><span className="text-sm text-slate-700">작성자</span><input value={form.author} onChange={(e) => update("author", e.target.value)} className={inputClass} /></label>
            <label className="block space-y-2"><span className="text-sm text-slate-700">발행일</span><input type="date" value={form.publishedAt} onChange={(e) => update("publishedAt", e.target.value)} className={inputClass} /></label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} className="h-4 w-4" /><span className="text-sm font-medium text-slate-700">사이트에 공개</span></label>
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
            <h2 className="font-bold text-slate-900">대표 이미지</h2>
            <label className="inline-block cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">{uploading ? "업로드 중..." : "이미지 업로드"}<input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadCover(file); }} /></label>
            {form.coverImageUrl ? <div className="relative aspect-[16/9] overflow-hidden rounded-xl"><ExpoImage src={form.coverImageUrl} alt="대표 이미지 미리보기" fill className="object-cover" /></div> : null}
            <input value={form.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} className={inputClass} placeholder="이미지 URL 직접 입력" />
          </section>

          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
            <h2 className="font-bold text-slate-900">검색 노출(SEO)</h2>
            <label className="block space-y-2"><span className="text-sm text-slate-700">글 주소</span><input value={form.slug} onChange={(e) => update("slug", e.target.value)} className={inputClass} placeholder="비우면 제목으로 자동 생성" /><span className="text-xs text-slate-400">/content/글-주소</span></label>
            <label className="block space-y-2"><span className="text-sm text-slate-700">검색 제목</span><input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} className={inputClass} placeholder="비우면 글 제목 사용" /></label>
            <label className="block space-y-2"><span className="text-sm text-slate-700">검색 설명</span><textarea value={form.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} className={`${inputClass} min-h-24`} placeholder="비우면 요약 사용" /></label>
            <label className="block space-y-2"><span className="text-sm text-slate-700">키워드</span><input value={form.keywords} onChange={(e) => update("keywords", e.target.value)} className={inputClass} placeholder="결혼 준비, 웨딩홀, 예산" /></label>
          </section>
        </aside>
      </div>
      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
    </form>
  );
}
