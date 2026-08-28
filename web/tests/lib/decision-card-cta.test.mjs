import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const src = readFileSync(join(root, "src/components/home/decision-card.tsx"), "utf8");
const strings = readFileSync(join(root, "src/lib/i18n/strings.ts"), "utf8");

test("Today primary action opens the report, not Mark applied", () => {
  const primary = src.indexOf('href={`/pipeline/${app.n}`}');
  const mark = src.indexOf('setStatus("Applied")');
  assert.notEqual(primary, -1);
  assert.notEqual(mark, -1);
  assert.ok(primary < mark, "report link must come before the Applied writer");
  // The primary CTA label lives in the i18n dictionary now; the en entry must
  // still say "Review".
  assert.match(strings, /"decision\.review": "Review"/);
});
