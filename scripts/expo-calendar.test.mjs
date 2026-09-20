import test from 'node:test';
import assert from 'node:assert/strict';
import { isExpoCurrent } from '../src/lib/expo-calendar.mjs';
test('legacy midnight date remains visible all of ending day in Korea',()=>{
  const end='2026-09-19T15:00:00.000Z';
  for(const now of ['2026-09-20T00:00:00+09:00','2026-09-20T12:00:00+09:00','2026-09-20T23:59:59.999+09:00']) assert.equal(isExpoCurrent(end,now),true);
  assert.equal(isExpoCurrent(end,'2026-09-21T00:00:00+09:00'),false);
});
test('new end of day, invalid dates, and year boundary',()=>{
  assert.equal(isExpoCurrent('2026-09-20T23:59:59+09:00','2026-09-20T15:00:00+09:00'),true);
  assert.equal(isExpoCurrent('bad'),false);
  assert.equal(isExpoCurrent('2026-12-31T00:00:00+09:00','2027-01-01T00:00:00+09:00'),false);
});
