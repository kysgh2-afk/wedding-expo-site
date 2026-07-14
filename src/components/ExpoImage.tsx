"use client";

import Image, { type ImageProps } from "next/image";

function isRemoteSrc(src: ImageProps["src"]) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

/**
 * External affiliate/banner hosts often block Next.js image optimization
 * fetches. Load those URLs unoptimized so the browser requests them directly.
 */
export function ExpoImage(props: ImageProps) {
  const unoptimized = props.unoptimized ?? isRemoteSrc(props.src);
  return <Image {...props} unoptimized={unoptimized} />;
}
