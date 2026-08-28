import { test } from "node:test";
import assert from "node:assert/strict";
import { matchesTitle, matchesLocation, isFresh } from "../../src/lib/core/job104-scan.mjs";

test("matchesTitle: positive substring, negative reject, empty positive passes", () => {
  assert.equal(matchesTitle("Java 後端工程師", ["Java", "Spring"], []), true);
  assert.equal(matchesTitle("後端工程師", ["java"], []), false);
  assert.equal(matchesTitle("Java 後端工程師", [], ["實習"]), true);
  assert.equal(matchesTitle("Java 實習生", [], ["實習"]), false);
  assert.equal(matchesTitle("Java 工讀", [], ["實習", "工讀"]), false);
  assert.equal(matchesTitle("Java 工程師", ["Java"], ["工讀"]), true);
  assert.equal(matchesTitle("", ["Java"], []), false);
});

test("matchesLocation: block_hard wins over always_allow; always_allow over block; block over allow", () => {
  const base = { allow: [], block: [], blockHard: [], alwaysAllow: [] };
  // always_allow 覆蓋 block（scan.mjs #2956 之前只有這一層）
  assert.equal(matchesLocation("台北市", { ...base, alwaysAllow: ["台北"], block: ["台北"] }), true);
  // block_hard 唯一不能被 always_allow 覆蓋的層
  assert.equal(matchesLocation("台中市", { ...base, blockHard: ["台中"], alwaysAllow: ["台中", "台灣"] }), false);
  // allow 通過、block 拒絕
  assert.equal(matchesLocation("台中市", { ...base, allow: ["台中"] }), true);
  assert.equal(matchesLocation("台中市", { ...base, allow: ["台中"], block: ["台中"] }), false);
  // 大小寫不敏感 + 子字串（含英文地區）
  assert.equal(matchesLocation("Remote", { ...base, allow: ["remote"] }), true);
  // 無任何位置規則 → 空地點通過
  assert.equal(matchesLocation("", base), true);
  // 有任何 allow 規則但沒命中 → 拒絕
  assert.equal(matchesLocation("", { ...base, allow: ["台北"] }), false);
  assert.equal(matchesLocation("新北市", { ...base, allow: ["台北"] }), false);
  assert.equal(matchesLocation("台北市", { ...base, allow: ["台北"] }), true);
});

test("isFresh: sinceDays 邊界（含/不含當天與今天）", () => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const tenDaysAgo = new Date(Date.now() - 10 * 86_400_000).toISOString().slice(0, 10);
  assert.equal(isFresh(today, 7), true);
  assert.equal(isFresh(yesterday, 7), true);
  assert.equal(isFresh(tenDaysAgo, 7), false);
  assert.equal(isFresh(tenDaysAgo, 30), true);
  // 無日期（unknown）→ 保留（與 scan-ats-full 行為一致）
  assert.equal(isFresh("", 7), true);
  // 非法日期 → 保留（防 parse 異常誤殺）
  assert.equal(isFresh("not-a-date", 7), true);
  // sinceDays ≤ 1 → 只留當天
  assert.equal(isFresh(yesterday, 1), false);
});
