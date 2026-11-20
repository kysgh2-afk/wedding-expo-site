import test from "node:test";
import assert from "node:assert/strict";
import { clickEventPath, getExpoClickCounts, rankExposByClicks, recordExpoClick } from "../src/lib/clicks";
import { sortExpos } from "../src/lib/sort-expos";

const expoId = "source-0123456789abcdef0123";
const visitor = "11111111-1111-4111-8111-111111111111";
test("one immutable event key per browser, expo and Korean calendar day", () => {
  const first = clickEventPath(expoId, visitor, new Date("2026-11-21T00:01:00+09:00"));
  assert.equal(first, clickEventPath(expoId, visitor, new Date("2026-11-21T23:59:00+09:00")));
  assert.notEqual(first, clickEventPath(expoId, visitor, new Date("2026-11-22T00:00:00+09:00")));
  assert.notEqual(first, clickEventPath("source-aaaaaaaaaaaaaaaaaaaa", visitor, new Date("2026-11-21T00:01:00+09:00")));
  assert(!first.includes(visitor));
  assert.throws(() => clickEventPath("../bad", visitor));
});
test("ranking ignores weekly-weekend priority and never fabricates zero-click rankings", () => {
  const date = new Date("2026-11-22");
  const rows = [
    { id: "regular", clickCount: 3, isWeeklyWeekend: false, startDate: date, endDate: date },
    { id: "weekly", clickCount: 8, isWeeklyWeekend: true, startDate: date, endDate: date },
    { id: "zero", clickCount: 0, isWeeklyWeekend: false, startDate: date, endDate: date },
  ];
  assert.deepEqual(rankExposByClicks(rows, 10).map(x => x.id), ["weekly", "regular"]);
  assert.equal(sortExpos(rows, "popular").at(-1)?.id, "weekly");
  assert.equal(sortExpos(rows, "date").at(-1)?.id, "weekly");
  assert.equal(rows[0].id, "regular");
});
test("ranking ties use date and stable id, not manual priority", () => {
  const date = new Date("2026-11-22");
  assert.deepEqual(rankExposByClicks([
    { id: "b", clickCount: 2, startDate: date },
    { id: "a", clickCount: 2, startDate: date },
    { id: "early", clickCount: 2, startDate: new Date("2026-11-21") },
  ], 2).map(x => x.id), ["early", "a"]);
});
test("missing storage is an explicit failure, not an empty success", async () => {
  const names = ["BLOB_READ_WRITE_TOKEN", "BLOB_STORE_ID", "EXPO_CLICKS_STORE_ID", "VERCEL_OIDC_TOKEN"];
  const before = names.map(name => process.env[name]);
  try {
    names.forEach(name => delete process.env[name]);
    await assert.rejects(getExpoClickCounts(), /not configured/);
    await assert.rejects(recordExpoClick(expoId, visitor), /not configured/);
  } finally {
    names.forEach((name, index) => { if (before[index] === undefined) delete process.env[name]; else process.env[name] = before[index]; });
  }
});
