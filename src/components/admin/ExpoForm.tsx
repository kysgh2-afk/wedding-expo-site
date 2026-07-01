"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  REGION_GROUPS,
  STATUS_OPTIONS,
  getRegionLabel,
  getSubregionOptions,
} from "@/lib/constants";
import { formatInputDate } from "@/lib/date";
import { formatTagsForInput } from "@/lib/tags";
import { uploadImageFile } from "@/lib/upload-image";

type ExpoFormData = {
  id?: string;
  title: string;
  location: string;
  regionGroup: string;
  regionSub: string;
  regionLabel: string;
  startDate: string;
  endDate: string;
  status: string;
  imageUrl: string;
  linkUrl: string;
  tags: string;
  sortOrder: number;
  isPublished: boolean;
};

type ExpoFormProps = {
  initialData?: ExpoFormData;
  mode: "create" | "edit";
};

const emptyForm: ExpoFormData = {
  title: "",
  location: "",
  regionGroup: "seoul",
  regionSub: "",
  regionLabel: "서울",
  startDate: formatInputDate(new Date()),
  endDate: formatInputDate(new Date()),
  status: "open",
  imageUrl: "",
  linkUrl: "",
  tags: "",
  sortOrder: 0,
  isPublished: true,
};

function defaultSubForGroup(regionGroup: string) {
  if (regionGroup === "metropolitan") return "busan";
  if (regionGroup === "local") return "chungcheong";
  return "";
}

export function ExpoForm({ initialData, mode }: ExpoFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ExpoFormData>(initialData ?? emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subregionOptions = getSubregionOptions(form.regionGroup);
  const needsSubregion = form.regionGroup === "metropolitan" || form.regionGroup === "local";

  useEffect(() => {
    const label = getRegionLabel(form.regionGroup, form.regionSub);
    setForm((current) =>
      current.regionLabel === label ? current : { ...current, regionLabel: label },
    );
  }, [form.regionGroup, form.regionSub]);

  function updateField<K extends keyof ExpoFormData>(key: K, value: ExpoFormData[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === "regionGroup") {
        const group = value as string;
        next.regionSub = defaultSubForGroup(group);
        next.regionLabel = getRegionLabel(group, next.regionSub);
      }

      if (key === "regionSub") {
        next.regionLabel = getRegionLabel(next.regionGroup, value as string);
      }

      return next;
    });
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");

    const result = await uploadImageFile(file);
    setUploading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    updateField("imageUrl", result.url);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      regionSub: needsSubregion ? form.regionSub : "",
      regionLabel: getRegionLabel(form.regionGroup, needsSubregion ? form.regionSub : ""),
    };

    const url = mode === "create" ? "/api/expos" : `/api/expos/${form.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "저장에 실패했습니다.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "create" ? "새 박람회 등록" : "박람회 수정"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          지역(서울·경기·광역시·지방), 일정, 이미지, 링크를 입력하세요.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">박람회 제목</span>
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="예: SETEC 웨딩박람회"
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">장소</span>
          <input
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="예: 서울 강남구 남부순환로 3104 SETEC 2층"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">지역 구분</span>
          <select
            value={form.regionGroup}
            onChange={(event) => updateField("regionGroup", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
          >
            {REGION_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </label>

        {needsSubregion ? (
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              {form.regionGroup === "metropolitan" ? "광역시 선택" : "지방 세부 지역"}
            </span>
            <select
              value={form.regionSub}
              onChange={(event) => updateField("regionSub", event.target.value)}
              className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
              required
            >
              {subregionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="flex items-end">
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              노출 지역: <strong>{form.regionLabel}</strong>
            </p>
          </div>
        )}

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">시작일</span>
          <input
            type="date"
            value={form.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">종료일</span>
          <input
            type="date"
            value={form.endDate}
            onChange={(event) => updateField("endDate", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">상태</span>
          <select
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">정렬 순서</span>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(event) => updateField("sortOrder", Number(event.target.value))}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">특징 태그</span>
          <input
            value={form.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="#대형 #무료초대권 #웨딩홀위주"
          />
          <p className="text-xs text-slate-500">
            #으로 구분해 최대 8개까지 입력할 수 있습니다. 예: #사전신청필수 #주말행사
          </p>
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">신청/상세 링크</span>
          <input
            type="url"
            value={form.linkUrl}
            onChange={(event) => updateField("linkUrl", event.target.value)}
            className="w-full rounded-xl border border-rose-200 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-200"
            placeholder="https://..."
          />
        </label>

        <div className="space-y-3 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">박람회 이미지</span>
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
            placeholder="/uploads/example.jpg 또는 외부 이미지 URL"
          />
        </div>

        <label className="flex items-center gap-3 md:col-span-2">
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
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-slate-200 px-5 py-3 text-slate-600 hover:bg-slate-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}
