// tests/providers/job104.test.mjs
import { pass, fail, ROOT } from '../helpers.mjs';
import { join } from 'path';
import { pathToFileURL } from 'url';

console.log('\nProvider — job104');

try {
  const mod = await import(pathToFileURL(join(ROOT, 'providers/job104.mjs')).href);
  const job104 = mod.default;
  const { parseConfig, cleanUrl, parseAppearDate, normalizeJob } = mod;

  if (job104.id === 'job104') pass('job104.id is "job104"');
  else fail(`job104.id is ${JSON.stringify(job104.id)}`);

  const hit = job104.detect({ name: '104', provider: 'job104' });
  if (hit && hit.url === 'https://www.104.com.tw/jobs/search/api/jobs') {
    pass('job104.detect() claims explicit provider config');
  } else {
    fail(`job104.detect() returned ${JSON.stringify(hit)}`);
  }
  if (job104.detect({ name: 'Other', provider: 'yourator' }) === null) {
    pass('job104.detect() ignores other provider ids');
  } else {
    fail('job104.detect() should only claim provider: job104');
  }

  // ── parseConfig ──
  const cfg = parseConfig({ searchKeywords: [' 軟體工程師 ', '後端', '', 42, '後端'] });
  if (JSON.stringify(cfg.keywords) === JSON.stringify(['軟體工程師', '後端'])) {
    pass('parseConfig trims/dedups keywords and drops blank/non-string entries');
  } else {
    fail(`parseConfig keywords = ${JSON.stringify(cfg.keywords)}`);
  }
  if (parseConfig({}).keywords.length === 0) {
    pass('parseConfig defaults to no keywords when searchKeywords is absent');
  } else {
    fail('parseConfig should default to an empty keywords array');
  }
  if (parseConfig({}).maxPages === 10) {
    pass('parseConfig defaults max_pages to 10');
  } else {
    fail(`parseConfig({}).maxPages = ${parseConfig({}).maxPages} (expected 10)`);
  }
  if (parseConfig({ max_pages: 500 }).maxPages === 100) {
    pass('parseConfig clamps max_pages to MAX_PAGES_CAP (100)');
  } else {
    fail(`parseConfig({ max_pages: 500 }).maxPages = ${parseConfig({ max_pages: 500 }).maxPages}`);
  }
  if (parseConfig({ max_pages: 0 }).maxPages === 1 && parseConfig({ max_pages: 'x' }).maxPages === 10) {
    pass('parseConfig clamps non-positive max_pages to 1 and falls back on non-numeric');
  } else {
    fail(`parseConfig bad max_pages: ${parseConfig({ max_pages: 0 }).maxPages} / ${parseConfig({ max_pages: 'x' }).maxPages}`);
  }

  // ── cleanUrl ──
  const trusted = 'https://www.104.com.tw/job/93k7u';
  if (cleanUrl(trusted) === trusted) pass('cleanUrl() returns a trusted https URL unchanged');
  else fail(`cleanUrl(trusted) = ${JSON.stringify(cleanUrl(trusted))}`);
  if (cleanUrl('https://evil.example.com/job/93k7u') === '') pass('cleanUrl() rejects an untrusted hostname');
  else fail('cleanUrl() should reject an untrusted hostname');
  if (cleanUrl('http://www.104.com.tw/job/93k7u') === '') pass('cleanUrl() rejects a non-HTTPS URL');
  else fail('cleanUrl() should reject a non-HTTPS URL');
  if (cleanUrl('https://www.104.com.tw:9999/job/x') === '') pass('cleanUrl() rejects a non-default port on the trusted host');
  else fail('cleanUrl() should reject a non-default port');
  if (cleanUrl('https://user:pass@www.104.com.tw/job/x') === '') pass('cleanUrl() rejects embedded credentials on the trusted host');
  else fail('cleanUrl() should reject embedded credentials');
  if (cleanUrl('') === '' && cleanUrl(null) === '' && cleanUrl('not a url') === '') {
    pass('cleanUrl() returns "" for empty/non-string/unparseable input');
  } else {
    fail('cleanUrl() should return "" for empty/non-string/unparseable input');
  }

  // ── parseAppearDate ──
  if (parseAppearDate('20260810') === Date.UTC(2026, 7, 10)) {
    pass('parseAppearDate parses "YYYYMMDD" into UTC epoch ms');
  } else {
    fail(`parseAppearDate('20260810') = ${parseAppearDate('20260810')}`);
  }
  if (parseAppearDate('2026-08-10') === undefined && parseAppearDate('') === undefined
    && parseAppearDate(null) === undefined && parseAppearDate('18000101') === undefined) {
    pass('parseAppearDate omits postedAt for malformed/implausible/missing dates');
  } else {
    fail('parseAppearDate should return undefined for bad input');
  }

  // ── normalizeJob ──
  const raw = {
    jobName: ' PLC 軟體工程師 ',
    custName: ' 弈鎧系統科技有限公司 ',
    jobAddrNoDesc: '新竹縣寶山鄉',
    description: '負責軟體之分析、設計以及程式撰寫。',
    jobNo: '15282714',
    appearDate: '20260810',
    link: { job: 'https://www.104.com.tw/job/93k7u' },
  };
  const norm = normalizeJob(raw);
  if (norm
    && norm.title === 'PLC 軟體工程師'
    && norm.company === '弈鎧系統科技有限公司'
    && norm.location === '新竹縣寶山鄉'
    && norm.description === '負責軟體之分析、設計以及程式撰寫。'
    && norm.url === 'https://www.104.com.tw/job/93k7u'
    && norm.id === '15282714'
    && norm.postedAt === Date.UTC(2026, 7, 10)) {
    pass('normalizeJob maps title/company/location/description/url/postedAt/id from a 104 row');
  } else {
    fail(`normalizeJob = ${JSON.stringify(norm)}`);
  }
  if (normalizeJob({ jobName: 'X', link: {} }) === null) {
    pass('normalizeJob returns null when the row lacks a usable URL');
  } else {
    fail('normalizeJob should return null without a usable URL');
  }
  if (normalizeJob({ link: { job: trusted } }) === null) {
    pass('normalizeJob returns null when the row lacks a title');
  } else {
    fail('normalizeJob should return null without a title');
  }

  // ── fetch ──
  const row = (n, name = `工程師${n}`) => ({
    jobName: name,
    custName: `公司${n}`,
    jobAddrNoDesc: '台北市',
    description: `JD ${n}`,
    jobNo: String(1000 + n),
    appearDate: '20260820',
    link: { job: `https://www.104.com.tw/job/${n}` },
  });

  // Helper: build a mock ctx that serves a scripted sequence of pages. The
  // seam is `fetchJson104` — the provider's node:https transport is exercised
  // by live smoke runs, never by unit tests.
  const serve = (pages) => {
    const calls = [];
    let i = 0;
    const ctx = {
      fetchJson104: async (url) => {
        calls.push({ url });
        if (i >= pages.length) throw new Error(`unexpected page request ${url}`);
        return pages[i++];
      },
      sleep: async () => {},
    };
    return { ctx, calls };
  };

  const page = (rows, lastPage) => ({
    data: rows,
    metadata: { pagination: { count: rows.length, currentPage: 1, lastPage, total: rows.length } },
  });

  // The server always fills a page with 30 rows except on the last page, so
  // "full page" fixtures must carry 30 rows — anything shorter reads as the
  // final page and ends pagination (which is exactly what the short-page test
  // below relies on).
  const fullPage = (offset, lastPage) => page(
    Array.from({ length: 30 }, (_, i) => row(offset + i)),
    lastPage,
  );

  {
    const { ctx, calls } = serve([
      fullPage(1, 2),
      page([row(31), row(32)], 2), // short page → done
    ]);
    const jobs = await job104.fetch({ name: '104', searchKeywords: ['軟體'] }, ctx);
    if (jobs.length === 32) pass('fetch walks pages and stops on a short page');
    else fail(`fetch returned ${jobs.length} jobs (expected 32)`);
    if (calls.length === 2) pass('fetch made exactly the two page requests the fixture serves');
    else fail(`fetch made ${calls.length} requests (expected 2)`);
    const u1 = new URL(calls[0].url);
    if (u1.searchParams.get('page') === '1' && u1.searchParams.get('keyword') === '軟體') {
      pass('fetch sends page and keyword as query params');
    } else {
      fail(`fetch page-1 URL = ${calls[0].url}`);
    }
    if (calls[1] && new URL(calls[1].url).searchParams.get('page') === '2') {
      pass('fetch advances the page param on subsequent requests');
    } else {
      fail(`fetch page-2 URL = ${calls[1] && calls[1].url}`);
    }
  }

  {
    // Keyword-less entry → one whole-board query with no keyword param.
    const { ctx, calls } = serve([page([row(1)], 1)]);
    const jobs = await job104.fetch({ name: '104' }, ctx);
    if (jobs.length === 1 && !new URL(calls[0].url).searchParams.has('keyword')) {
      pass('fetch runs a keyword-less whole-board query when no keywords are configured');
    } else {
      fail(`keyword-less fetch: jobs=${jobs.length} url=${calls[0].url}`);
    }
  }

  {
    // Two keywords: both queried, results deduped by jobNo.
    const { ctx, calls } = serve([
      page([row(1, '軟體工程師')], 1),
      page([row(1, '軟體工程師'), row(2, '後端工程師')], 1),
    ]);
    const jobs = await job104.fetch({ name: '104', searchKeywords: ['軟體', '後端'] }, ctx);
    if (jobs.length === 2 && calls.length === 2) pass('fetch dedups rows across keyword queries by jobNo');
    else fail(`two-keyword fetch: jobs=${jobs.length} calls=${calls.length}`);
  }

  {
    // Malformed first page → throws (a broken board must look broken).
    const { ctx } = serve([{ hello: 'world' }]);
    let threw = false;
    try {
      await job104.fetch({ name: '104' }, ctx);
    } catch (err) {
      threw = /job104: unexpected API response/.test(String(err && err.message));
    }
    if (threw) pass('fetch throws on a page-1 response that is not the documented shape');
    else fail('fetch should throw on a malformed page-1 response');
  }

  {
    // Health probe: ctx.maxPages=1 bounds the walk to one page per query.
    const { ctx, calls } = serve([
      page([row(1)], 2),
      page([row(2)], 2),
    ]);
    const jobs = await job104.fetch({ name: '104', max_pages: 10 }, { ...ctx, maxPages: 1 });
    if (jobs.length === 1 && calls.length === 1) pass('fetch honours ctx.maxPages (probe) over the configured cap');
    else fail(`probe fetch: jobs=${jobs.length} calls=${calls.length}`);
  }

  {
    // One query fails, the other succeeds → the survivor's rows come back.
    const { ctx } = serve([
      page([row(1, '後端工程師')], 1),
      { boom: true },
    ]);
    const jobs = await job104.fetch({ name: '104', searchKeywords: ['後端', '軟體'] }, ctx);
    if (jobs.length === 1) pass('fetch tolerates a single failed keyword query and keeps the others');
    else fail(`partial-failure fetch: jobs=${jobs.length}`);
  }

  {
    // Every query fails → throws.
    const { ctx } = serve([{ boom: true }]);
    let threw = false;
    try {
      await job104.fetch({ name: '104', searchKeywords: ['軟體'] }, ctx);
    } catch (err) {
      threw = /all 1 query request\(s\) failed/.test(String(err && err.message));
    }
    if (threw) pass('fetch throws when every keyword query fails');
    else fail('fetch should throw when every keyword query fails');
  }

  {
    // max_pages bounds the walk even when the server keeps reporting more.
    const pages = Array.from({ length: 3 }, (_, i) => fullPage(i * 30 + 1, 100));
    const { ctx, calls } = serve(pages);
    const jobs = await job104.fetch({ name: '104', max_pages: 2 }, ctx);
    if (calls.length === 2 && jobs.length === 60) pass('fetch respects the configured max_pages');
    else fail(`max_pages fetch: calls=${calls.length} jobs=${jobs.length}`);
  }
} catch (err) {
  fail(`job104 test crashed: ${err && err.stack ? err.stack : err}`);
}
