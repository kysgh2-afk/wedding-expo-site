"use client";

import Link from "next/link";
import { ExpoImage } from "@/components/ExpoImage";
import { formatKoreanDateRange } from "@/lib/date";
import { STATUS_OPTIONS } from "@/lib/constants";

export type ExpoCardData = {
  id: string;
  title: string;
  location: string;
  regionGroup: string;
  regionLabel: string;
  startDate: Date;
  endDate: Date;
  status: string;
  imageUrl: string | null;
  linkUrl: string | null;
  tags: string[];
};

function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

const EXPO_IMAGE_SIZE = 320;

function getRankBadgeClass(rank: number) {
  if (rank === 1) return "bg-amber-400 text-white shadow-md shadow-amber-200";
  if (rank === 2) return "bg-slate-400 text-white shadow-md shadow-slate-200";
  if (rank === 3) return "bg-orange-400 text-white shadow-md shadow-orange-200";
  return "bg-rose-500 text-white";
}

function trackClick(expoId: string) {
  void fetch(`/api/expos/${expoId}/click`, { method: "POST", keepalive: true });
}

export function ExpoCard({ expo, rank }: { expo: ExpoCardData; rank?: number }) {
  const dateText = formatKoreanDateRange(expo.startDate, expo.endDate);
  const statusLabel = getStatusLabel(expo.status);
  const isOpen = expo.status === "open";
  const isRanked = rank !== undefined;

  const imageSection = isRanked ? (
    <div className="relative aspect-square w-full overflow-hidden bg-rose-50">
      {expo.imageUrl ? (
        <ExpoImage
          src={expo.imageUrl}
          alt={expo.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 to-amber-50 text-sm text-rose-400">
          웨딩박람회
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-rose-600 shadow">
        {expo.regionLabel}
      </span>
      <span
        className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${getRankBadgeClass(rank)}`}
        aria-label={`${rank}위`}
      >
        {rank}
      </span>
    </div>
  ) : (
    <div
      className="relative mx-auto overflow-hidden bg-rose-50"
      style={{ width: EXPO_IMAGE_SIZE, height: EXPO_IMAGE_SIZE, maxWidth: "100%" }}
    >
      {expo.imageUrl ? (
        <ExpoImage
          src={expo.imageUrl}
          alt={expo.title}
          width={EXPO_IMAGE_SIZE}
          height={EXPO_IMAGE_SIZE}
          className="h-[320px] w-[320px] max-w-full object-cover transition duration-300 group-hover:scale-105"
          sizes={`${EXPO_IMAGE_SIZE}px`}
        />
      ) : (
        <div
          className="flex items-center justify-center bg-gradient-to-br from-rose-100 to-amber-50 text-sm text-rose-400"
          style={{ width: EXPO_IMAGE_SIZE, height: EXPO_IMAGE_SIZE, maxWidth: "100%" }}
        >
          웨딩박람회
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-rose-600 shadow">
        {expo.regionLabel}
      </span>
    </div>
  );

  const content = (
    <article
      className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        isRanked ? "" : "mx-auto max-w-[320px]"
      }`}
    >
      {imageSection}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-600">{dateText}</p>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              isOpen
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-rose-700">
          {expo.title}
        </h3>
        {expo.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {expo.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
        <p className="mt-auto text-sm leading-relaxed text-slate-500">
          {expo.location}
        </p>
      </div>
    </article>
  );

  if (expo.linkUrl) {
    return (
      <Link
        href={expo.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        onClick={() => trackClick(expo.id)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="block h-full w-full cursor-pointer text-left"
      onClick={() => trackClick(expo.id)}
    >
      {content}
    </button>
  );
}
