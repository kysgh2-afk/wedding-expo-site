"use client";

import Image from "next/image";
import Link from "next/link";
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
};

function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

const EXPO_IMAGE_SIZE = 320;

function trackClick(expoId: string) {
  void fetch(`/api/expos/${expoId}/click`, { method: "POST", keepalive: true });
}

export function ExpoCard({ expo }: { expo: ExpoCardData }) {
  const dateText = formatKoreanDateRange(expo.startDate, expo.endDate);
  const statusLabel = getStatusLabel(expo.status);
  const isOpen = expo.status === "open";

  const content = (
    <article className="group mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className="relative mx-auto overflow-hidden bg-rose-50"
        style={{ width: EXPO_IMAGE_SIZE, height: EXPO_IMAGE_SIZE, maxWidth: "100%" }}
      >
        {expo.imageUrl ? (
          <Image
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
