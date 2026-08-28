// Standalone discovery runner for 104人力銀行 (job104 provider), spawned by
// web/src/lib/core/scan.ts as a CHILD PROCESS (the core provider is outside
// web/ — spawning keeps the web bundle free of it) and streams NDJSON lines:
//
//   {"kind":"progress", ...}  {"kind":"offer", ...}  {"kind":"atsDone", ...}
//
// The filter semantics mirror scan.mjs's buildTitleFilter / buildLocationFilter
// and web/src/lib/core/portals.ts exactly:
//   title positive → substring match (empty = everything passes)
//   title negative → substring reject
//   location block_hard > always_allow > block > allow (case-insensitive
//     substring); block_hard is the one tier always_allow cannot override.
//
// Usage: node job104-scan.mjs '<filters JSON>'
//   POST http://localhost:3000/api/explore … → { positive, negative, allow,
//   block, blockHard, alwaysAllow, sinceDays, limit }

import { pathToFileURL } from "node:url";
import job104 from "../../../../providers/job104.mjs";

const WHOLE_BOARD_MAX_PAGES = 10; // 10 × 30 = newest 300 postings per sweep

export function matchesTitle(title, positive, negative) {
  const t = String(title || "").toLowerCase();
  if (!t) return false;
  if (positive.length && !positive.some((k) => k && t.includes(k.toLowerCase()))) return false;
  if (negative.some((k) => k && t.includes(k.toLowerCase()))) return false;
  return true;
}

/**
 * Location policy with the exact precedence scan.mjs uses (#2956):
 * block_hard wins over always_allow; always_allow wins over block; block wins
 * over allow; a case-insensitive substring check on each keyword. An empty
 * location only passes when no tier singles it out — i.e. when there are no
 * block/blockHard/allow/alwaysAllow terms at all. scan-ats-full behaves the
 * same way for postings with no location (it keeps them).
 */
export function matchesLocation(location, { allow, block, blockHard, alwaysAllow }) {
  const loc = String(location || "").toLowerCase();
  const hit = (list) => list.some((k) => k && loc.includes(k.toLowerCase()));
  if (blockHard.length && hit(blockHard)) return false;
  if (alwaysAllow.length && hit(alwaysAllow)) return true;
  if (block.length && hit(block)) return false;
  if (allow.length && hit(allow)) return true;
  return !block.length && !blockHard.length && !allow.length;
}

/** true when postedAt is within `sinceDays` of today (undefined → passes). */
export function isFresh(postedAtIso, sinceDays) {
  if (!postedAtIso) return true; // unknown date — the scanner keeps these too
  const d = new Date(postedAtIso + "T00:00:00Z").getTime();
  if (Number.isNaN(d)) return true;
  const days = Math.floor((Date.now() - d) / 86_400_000);
  return days >= 0 && days < Math.max(1, sinceDays || 1);
}

function firstMatch(title, positive) {
  const lower = String(title || "").toLowerCase();
  for (const k of positive) if (k && lower.includes(k.toLowerCase())) return k;
  return undefined;
}

function toIso(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

export async function runJob104Scan(filters, onEvent) {
  const maxPages = Number.isInteger(filters.limitPerAts)
    ? Math.min(WHOLE_BOARD_MAX_PAGES, Math.max(1, Math.ceil(filters.limitPerAts / 30) || 1))
    : WHOLE_BOARD_MAX_PAGES;

  const jobs = await job104.fetch({ max_pages: maxPages }, {});

  const seen = new Set();
  let matches = 0;
  for (const job of jobs) {
    const postedAt = job.postedAt ? toIso(job.postedAt) : "";
    if (!matchesTitle(job.title, filters.positive ?? [], filters.negative ?? [])) continue;
    if (!matchesLocation(job.location, {
      allow: filters.allow ?? [],
      block: filters.block ?? [],
      blockHard: filters.blockHard ?? [],
      alwaysAllow: filters.alwaysAllow ?? [],
    })) continue;
    if (!isFresh(postedAt, filters.sinceDays ?? 7)) continue;
    if (seen.has(job.url)) continue;
    seen.add(job.url);
    matches++;
    onEvent({ kind: "progress", ats: "job104", scanned: matches, total: 0, matches });
    onEvent({
      kind: "offer",
      offer: {
        url: job.url,
        company: job.company,
        title: job.title,
        location: job.location,
        postedAt,
        ats: "job104",
        source: "job104",
        matchedKeyword: firstMatch(job.title, filters.positive ?? []),
      },
    });
    if (filters.limitPerAts && matches >= filters.limitPerAts) break;
  }
  onEvent({ kind: "atsDone", ats: "job104", unreachable: 0 });
  return matches;
}

async function main() {
  let filters;
  try {
    filters = JSON.parse(process.argv[2] || "{}");
  } catch {
    process.stderr.write("job104-scan: invalid filters JSON\n");
    process.exit(1);
  }
  const out = process.stdout;
  const say = (obj) => out.write(JSON.stringify(obj) + "\n");
  try {
    await runJob104Scan(filters, say);
  } catch (err) {
    say({ kind: "atsDone", ats: "job104", unreachable: 1 });
    process.stderr.write(`job104-scan: ${(err && err.message) || err}\n`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => process.exit(1));
}
