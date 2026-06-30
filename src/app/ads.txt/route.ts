export function GET() {
  const raw = process.env.GOOGLE_ADSENSE_PUBLISHER_ID?.trim();
  const publisherId = raw?.startsWith("pub-") ? raw : raw ? `pub-${raw}` : null;

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# Set GOOGLE_ADSENSE_PUBLISHER_ID after AdSense approval\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
