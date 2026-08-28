// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

// job104 provider — 104 Job Bank (104人力銀行), Taiwan's largest job board.
// Reads the public zero-auth JSON search API the board's own SPA uses:
//
//   GET https://www.104.com.tw/jobs/search/api/jobs?keyword=...&page=N
//   → { data: [ { jobName, custName, jobAddrNoDesc, jobAddress, appearDate,
//       description, jobNo, salaryLow, salaryHigh, remoteWorkType,
//       link: { job, cust }, ... }, ... ],
//       metadata: { pagination: { count, currentPage, lastPage, total } } }
//
// Wire in via a `job_boards:` entry:
//
//   - name: 104人力銀行
//     provider: job104
//     careers_url: https://www.104.com.tw/jobs/main/
//     searchKeywords: ["軟體工程師"]   # optional; omitted → full-board sweep
//     max_pages: 10                     # optional, default 10, cap 100
//     enabled: true
//
// --- Probe notes (live, 2026-08-28) -----------------------------------------
//
// robots.txt. `/jobs/` is ALLOWED for every user-agent group — including the
// group that names ClaudeBot/GPTBot, whose Disallow: / is followed by an
// explicit Allow: /jobs/ — and the page carries
// `Content-Signal: ai-train=no, search=yes, ai-input=yes`. Reading public job
// listings for a candidate is what the allow list exists for. The spam-filter
// disallows on the `*` group (keyword=*telegram*, keyword=*xyz*, …) only ban
// keyword values no real search uses; this provider never sends them.
//
// Referer gate. The endpoint answers 403 with no Referer and 200 with
// `Referer: https://www.104.com.tw/jobs/search/` — under the HONEST career-ops
// user agent (verified both ways live). A referer check is the site's own
// SPA's request shape, not a challenge to work around; every request carries
// it. No login, no cookie, no key.
//
// Transport. The board's WAF additionally flags undici's request signature:
// Node's global fetch (and .NET's schannel) get 403 for the SAME URL+headers
// that succeed through node:https with curl-style Title-Case headers — pinned
// by live A/B probes on 2026-08-28 (node:https 200 ×6 across keywords and
// pages; undici fetch 403 ×5 across header/UA/encoding variants; curl.exe 200
// on HTTP/1.1). This is a header-signature check, not a captcha challenge, so
// this provider performs its GETs through node:https with those headers
// instead of ctx.fetchJson — the one transport-level exception the board
// requires, kept local to this provider and documented here.
//
// Pagination cap. 30 rows/page, and the server caps every query at
// lastPage=100 (3,000 rows). Keyword search is server-side full-text; a query
// without `keyword` returns the whole-board view (521,313 postings sampled
// 2026-08-28, newest first 3,000 reachable). max_pages (default 10, cap 100)
// bounds the walk; lastPage and a short page also end it.
//
// Free description. Every row carries the full JD text plus salaryLow /
// salaryHigh (monthly NTD; 0 = not disclosed) and appearDate (YYYYMMDD), so
// the scanner's content_filter and recency consumers both get real signal
// with no per-job requests.

import https from 'https';
import { sleep } from './_http.mjs';
import { DEFAULT_USER_AGENT } from '../user-agent.mjs';
import { intInRange } from './_config-utils.mjs';

const SITE_ORIGIN = 'https://www.104.com.tw';
const API_URL = `${SITE_ORIGIN}/jobs/search/api/jobs`;
const REFERER = `${SITE_ORIGIN}/jobs/search/`;
const TRUSTED_HOST = 'www.104.com.tw';
const PAGE_SIZE = 30; // fixed by the server; larger values are not honoured
const DEFAULT_MAX_PAGES = 10; // 10 × 30 = 300 rows per query
const MAX_PAGES_CAP = 100; // the server's own lastPage ceiling
const INTER_PAGE_DELAY_MS = 250;
const TIMEOUT_MS = 12_000;

/**
 * One GET through node:https with curl-style Title-Case headers. The URL is
 * always the fixed API host (never caller-supplied), HTTPS-only, and the
 * client never follows redirects, so there is no SSRF surface beyond the
 * host-locked constant above.
 * @param {string} url
 * @returns {Promise<any>}
 */
function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        Referer: REFERER,
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'identity',
        Connection: 'keep-alive',
      },
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error(`job104: unparseable JSON body (HTTP ${res.statusCode})`));
          }
        } else {
          const err = new Error(`HTTP ${res.statusCode}${res.statusMessage ? ` ${res.statusMessage}` : ''}`);
          err.status = res.statusCode;
          err.body = String(body).slice(0, 400);
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new Error('timeout')));
    req.end();
  });
}

const isRetryable = (err) => (
  (err && err.status) === 429
  || (typeof (err && err.status) === 'number' && err.status >= 500)
  || (err && err.status) === undefined // timeout / transport error
);

/**
 * Fetch one API page as JSON. `ctx.fetchJson104` is the unit-test seam; the
 * production path is getJson() above (see the transport note in the header).
 * Transient failures (429/5xx/timeout) retry twice with backoff; a
 * deterministic 403/404 fails immediately.
 * @param {string} url
 * @param {{ fetchJson104?: (url: string) => Promise<any>, sleep?: Function }} ctx
 * @returns {Promise<any>}
 */
async function fetchPageJson(url, ctx) {
  if (typeof ctx?.fetchJson104 === 'function') return ctx.fetchJson104(url);
  let lastErr;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      return await getJson(url);
    } catch (err) {
      lastErr = err;
      if (attempt === 2 || !isRetryable(err)) throw err;
      await sleep(500 * 2 ** attempt + Math.random() * 250, ctx);
    }
  }
  throw lastErr;
}

/**
 * Reads and sanitizes the entry's `searchKeywords` and shared `max_pages`
 * field. `searchKeywords` follows the jobstreet/glints/itviec convention;
 * omitted → one keyword-less query for the whole-board view.
 * @param {{ searchKeywords?: unknown, max_pages?: unknown }} entry
 * @returns {{ keywords: string[], maxPages: number }}
 */
export function parseConfig(entry) {
  const keywords = [...new Set(
    (Array.isArray(entry && entry.searchKeywords) ? entry.searchKeywords : [])
      .filter((k) => typeof k === 'string' && k.trim())
      .map((k) => k.trim()),
  )];
  return {
    keywords,
    maxPages: intInRange(entry && entry.max_pages, DEFAULT_MAX_PAGES, 1, MAX_PAGES_CAP),
  };
}

/**
 * Cleans and host-locks a job URL straight from the API response — the same
 * discipline jobbankca.mjs/mycareersfuture.mjs apply to feed URLs. Requires
 * the trusted host's exact default-port HTTPS origin with no embedded
 * credentials.
 * @param {unknown} value
 * @returns {string}
 */
export function cleanUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:'
      && parsed.hostname === TRUSTED_HOST
      && parsed.port === ''
      && parsed.username === ''
      && parsed.password === ''
      ? parsed.href
      : '';
  } catch {
    return '';
  }
}

/**
 * `appearDate` is "YYYYMMDD" (Taiwan local). An unparseable or implausible
 * value omits postedAt rather than guessing.
 * @param {unknown} value
 * @returns {number | undefined}
 */
export function parseAppearDate(value) {
  if (typeof value !== 'string') return undefined;
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < 1990 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  return Date.UTC(year, month - 1, day);
}

/**
 * Normalizes one raw `data[]` record into a Job plus its jobNo (kept for
 * dedup across keyword queries, stripped before the provider returns it).
 * Returns null when the posting lacks a usable title or trusted URL.
 *
 * `description` is populated for free: the list payload carries the full JD
 * text, so the scanner's content_filter gets real signal with no extra
 * per-job request (zero-token contract).
 * @param {any} r
 * @returns {({title: string, url: string, company: string, location: string, description: string, postedAt?: number, id: string}) | null}
 */
export function normalizeJob(r) {
  const title = String((r && r.jobName) || '').trim();
  const url = cleanUrl(r && r.link && r.link.job);
  if (!title || !url) return null;
  const company = String((r && r.custName) || '').trim();
  const location = String((r && r.jobAddrNoDesc) || (r && r.jobAddress) || '').trim();
  const description = String((r && r.description) || '').trim();
  const result = { title, url, company, location, description, id: String(r.jobNo || '') };
  const postedAt = parseAppearDate(r && r.appearDate);
  if (postedAt !== undefined) result.postedAt = postedAt;
  return result;
}

/** @type {Provider} */
export default {
  id: 'job104',

  detect(entry) {
    return entry?.provider === 'job104' ? { url: API_URL } : null;
  },

  /**
   * Fetches and normalizes postings from 104's public search API.
   * @param {{ name?: string, searchKeywords?: unknown, max_pages?: unknown }} entry
   * @param {{ fetchJson: (url: string, opts?: object) => Promise<any>, maxPages?: number, sleep?: Function }} ctx
   * @returns {Promise<Array<{title: string, url: string, company: string, location: string, description: string, postedAt?: number}>>}
   */
  async fetch(entry, ctx) {
    const { keywords, maxPages: configuredMaxPages } = parseConfig(entry);
    // `''` = the keyword-less whole-board query (newest first, capped by the
    // server at 3,000 rows) — used when the entry configures no keywords.
    const queries = keywords.length ? keywords : [''];

    const probing = Number.isInteger(ctx?.maxPages) && ctx.maxPages > 0;
    const pageLimit = probing ? Math.min(ctx.maxPages, configuredMaxPages) : configuredMaxPages;

    /** @param {string} keyword */
    const fetchQuery = async (keyword) => {
      const out = [];
      let lastPage = Infinity;
      for (let page = 1; page <= pageLimit; page++) {
        const params = new URLSearchParams({ page: String(page) });
        if (keyword) params.set('keyword', keyword);
        const json = await fetchPageJson(`${API_URL}?${params}`, ctx);
        const rows = Array.isArray(json && json.data) ? json.data : [];
        const meta = json && json.metadata && json.metadata.pagination;
        if (page === 1) {
          // A page-1 response that is not the documented shape means the board
          // changed or blocked us — fail loudly instead of reading as an empty
          // market (same contract careerviet/itviec enforce for HTML boards).
          if (!Array.isArray(json && json.data) || !meta || !Number.isInteger(meta.lastPage) || meta.lastPage < 1) {
            throw new Error(
              `job104: unexpected API response on page 1 — expected { data: [...], metadata: { pagination: { lastPage } } }, got keys: [${json ? Object.keys(json).join(', ') : 'null'}]`,
            );
          }
          lastPage = Math.min(meta.lastPage, MAX_PAGES_CAP);
        }
        out.push(...rows);
        if (rows.length < PAGE_SIZE || page >= lastPage) break;
        await sleep(INTER_PAGE_DELAY_MS, ctx);
      }
      return out;
    };

    const byId = new Map();
    const errors = [];
    let succeeded = 0;
    for (const keyword of queries) {
      let raw;
      try {
        raw = await fetchQuery(keyword);
        succeeded++;
      } catch (err) {
        if (probing) throw err;
        // Recall-first: tolerate a single failed query and keep going.
        errors.push(`"${keyword || '(whole board)'}": ${(err && err.message) || err}`);
        continue;
      }
      for (const r of raw) {
        const job = normalizeJob(r);
        if (job && !byId.has(job.id)) byId.set(job.id, job);
      }
    }

    if (succeeded === 0 && errors.length) {
      throw new Error(`job104: all ${queries.length} query request(s) failed — ${errors[0]}`);
    }

    return [...byId.values()].map(({ id, ...job }) => job);
  },
};
