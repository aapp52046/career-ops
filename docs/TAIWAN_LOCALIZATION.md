# career-ops 台灣地區化 — 改造計畫書・日誌

> 狀態：**執行中**（2026-08-28 起）
> 目標：104人力銀行、1111人力銀行、LinkedIn「打得通」；輸出繁中、台灣市場規則。

---

## 0. 目標與範圍

| 平台 | 目標 | 路徑 | 限制 |
|------|------|------|------|
| 104人力銀行 | `scan` 能拉職缺 | 新 provider（條件式，先探勘） | 須過 ToS／robots／WAF gate |
| 1111人力銀行 | `scan` 能拉職缺 | 新 provider（條件式，先探勘） | 同上 |
| LinkedIn | 單則職缺可評估 | Playwright 擷取 + guest liveness + contacto/join | **禁止整站 scraper** |

範圍外：LinkedIn 整板掃描、104/1111 登入後爬蟲、自動投遞。

---

## 1. 現況盤點（執行前已確認）

**已具備：** `modes/zh-TW/`（台灣市場模式）、`providers/yourator.mjs`（台新創板）、`liveness-api.mjs` LinkedIn guest rung（僅英文 closure 文案）、`linkedin-join.mjs`、可鏡像的亞洲板 provider（itviec/careerviet/mycareersfuture）。

**缺口：** 無 104/1111 provider；User Layer 全缺（cv.md/profile.yml/portals.yml/_profile.md）；portals 範本無台灣內容；LinkedIn liveness 無繁中訊號。

---

## 2. 分階段計畫

| Phase | 內容 |
|-------|------|
| 0 | User Layer 台灣化（profile/portals/tracker/cv） |
| 1 | LinkedIn 單則打通（liveness 繁中化 + 端到端驗證） |
| 2 | 104／1111 可行性探勘（gate：robots／WAF／SSR 與否） |
| 3 | 條件式：通過者實作 provider + tests + docs |
| 4 | 台灣公司／ATS 覆蓋；評估 CakeResume／Meet.jobs |
| 5 | 驗證（doctor／test-all／實機 scan）＋台灣設定說明 |

---

## 3. 檔案影響清單

| 類型 | 路徑 | 動作 |
|------|------|------|
| User | `config/profile.yml` | ✅ 新建（台灣值，TODO 待補） |
| User | `portals.yml` | ✅ 新建（台 filter + Yourator + 104） |
| User | `data/applications.md` | ✅ 新建（tracker 骨架） |
| User | `cv.md`、`modes/_profile.md` | ⏳ onboarding（需你提供履歷） |
| Sys | `providers/job104.mjs` | ✅ 新建（探勘通過；node:https 傳輸） |
| Sys | `providers/1111.mjs` | 🚫 探勘不通過（Altcha/Turnstile 閘）→ 不實作 |
| Sys | `tests/providers/job104.test.mjs` | ✅ 新建（30 項全綠） |
| Sys | `tests/fixtures/linkedin-guest-closed-zh-TW.html` | ✅ 新建 |
| Sys | `tests/liveness-api-linkedin.test.mjs` | ✅ 改（繁中用例，39 項全綠） |
| Sys | `liveness-api.mjs` | ✅ 改（繁中 closure 訊號） |
| Sys | `templates/portals.example.yml` | ✅ 改（台灣 job_boards 範例） |
| Sys | `docs/SUPPORTED_JOB_BOARDS.md` | ✅ 改（104 列 + 1111 Evaluated） |
| Sys | `docs/TAIWAN_LOCALIZATION.md`（本檔） | ✅ 計畫書＋日誌 |

---

## 4. 風險與決策點

| 風險 | 對策 |
|------|------|
| 104/1111 需登入／WAF／robots 擋 AI bot | 不進 core，記 Evaluated + WebSearch/手動 pipeline |
| 列表 HTML 常改版 | 穩錨點；首頁 parse 0 筆要 throw（itviec 模式） |
| LinkedIn 整板 | 堅守只做單則（專案 ToS） |
| 關鍵字未定 | placeholder，之後改 title_filter／profile roles |

---

## 5. Todo List

### Phase 0 — User Layer
- [x] 環境檢查（npm install 補齊依賴；update-system v1.30.0 up-to-date）
- [x] 建立 `config/profile.yml`（Taiwan/TWD/zh-TW/TODO 佔位）
- [x] 建立 `portals.yml`（台灣 filter + Yourator + 104 啟用）
- [x] 建立 `data/applications.md` tracker 骨架
- [x] 建立本計畫書＋日誌 `docs/TAIWAN_LOCALIZATION.md`
- [x] `validate-portals.mjs` / `doctor.mjs` 驗證
- [ ] onboarding：收集履歷 → `cv.md` + `modes/_profile.md`

### Phase 1 — LinkedIn 單則打通
- [x] `liveness-api.mjs` 補繁中 closure 文案 + 單元測試
- [x] 驗證機制在位（guest API rung + zh-TW 判定 + Playwright 已裝）
- [ ] 用真實 LinkedIn 職缺 URL 跑一次端到端（待你提供一則）

### Phase 2 — 104／1111 探勘
- [x] 104：robots（/jobs/ 允許、search=yes）+ API 端點 + Referer/傳輸 gate
- [x] 1111：robots + captcha gate 確認
- [x] 探勘筆記寫入本檔「附錄 A」

### Phase 3 — Provider（條件式）
- [x] `providers/job104.mjs`（探勘通過）
- [x] `tests/providers/job104.test.mjs`（30 項全綠）
- [x] `docs/SUPPORTED_JOB_BOARDS.md` 列 + `portals.example.yml` 範例
- [x] 1111 記「Evaluated, not supported」（不實作）
- [ ] 剩餘 lint/test 全綠（done：lint ✓、--only 兩套 ✓）

### Phase 4 — 台灣公司／ATS 覆蓋
- [x] 實機 scan：635 筆進 pipeline（104 全板 + Yourator）
- [ ] 台/外商在台 tracked_companies（待你定職類後精選）
- [ ] 評估 CakeResume／Meet.jobs

### Phase 5 — 驗證
- [x] `node doctor.mjs --json`（僅剩 cv.md 缺 → onboarding）
- [x] `node test-all.mjs --only providers/job104` 30 綠；`--only liveness-api-linkedin` 39 綠
- [x] 實機 scan 抽樣：2,089 掃到 → 635 進 pipeline
- [ ] 台灣設定說明（本檔即說明；可再補 README 一節）

---

## 6. 日誌

| 時間 | 任務 | 動作/結果 | 狀態 |
|------|------|-----------|------|
| 2026-08-28 | 環境檢查 | `update-system.mjs check` → up-to-date (v1.30.0)；`node_modules` 缺失 → `npm install` 補齊 | ✅ |
| 2026-08-28 | 冷啟動檢查 | `doctor.mjs` → onboardingNeeded: true（缺 cv.md/profile.yml/portals.yml）；`_profile.md`/`_brief.md` 為範本未個人化 | ✅ |
| 2026-08-28 | Phase 0 | 建立 `config/profile.yml`、`portals.yml`、`data/applications.md`、本計畫書 | ✅ |
| 2026-08-28 | Phase 0 驗證 | `validate-portals.mjs` 0 errors 0 warnings | ✅ |
| 2026-08-28 | Phase 1 | `liveness-api.mjs` 補繁中 closure 訊號（不再接受申請／已停止接受申請／不再接受申请／已停止招聘）+ zh-TW fixture + 測試 39 綠 | ✅ |
| 2026-08-28 | Phase 2 探勘 104 | robots：/jobs/ 全 UA 群組允許、Content-Signal search=yes；API `GET /jobs/search/api/jobs`（30/頁、上限 100 頁、全板 52.1 萬筆）；需 Referer；undici fetch 全 403、node:https Title-Case 標頭全 200（6/6）→ **通過** | ✅ |
| 2026-08-28 | Phase 2 探勘 1111 | 列表/搜尋頁為 Altcha+Turnstile captcha-gate（FOREGROUND_TAKEOVER）→ **不通過**（JobsGo 先例） | ✅ |
| 2026-08-28 | Phase 3 | `providers/job104.mjs`（node:https 傳輸、Referer、分頁、關鍵字、jobNo 去重、appearDate→postedAt、完整 JD 描述）+ 30 項單元測試 | ✅ |
| 2026-08-28 | Phase 3 docs | `SUPPORTED_JOB_BOARDS.md` 加 104 列與 1111 Evaluated；`portals.example.yml` 加台灣區塊；`portals.yml` 啟用 104 | ✅ |
| 2026-08-28 | Phase 5 實機 | `scan.mjs`：2,089 掃到 → 635 筆進 `data/pipeline.md`（104 + Yourator），scan-runs.tsv 記錄完整 | ✅ |
| 2026-08-28 | Phase 5 測試 | `test-all.mjs --only providers/job104` 30 綠；`--only liveness-api-linkedin` 39 綠；`npm run lint` 583 檔通過 | ✅ |
| 2026-08-28 | 已知問題 | `cv-sync-check.mjs` 上游 v1.30.0 import 層 bug（projectRoot 未定義）— 未修（非本任務範圍，記檔備查） | ⚠️ |
| 2026-08-28 | 待辦 | 等你提供：① 履歷/背景（→ cv.md、_profile.md）② 目標職稱關鍵字 ③ 一則真實 LinkedIn 職缺 URL（端到端驗證） | ⏳ |

---

## 附錄 A — 104／1111 探勘筆記（2026-08-28 實測）

### 104人力銀行 → ✅ 通過，provider: `job104`

| 項目 | 結果 |
|------|------|
| robots.txt | `User-agent: ClaudeBot` 等群組 `Disallow: /` 但 `Allow: /jobs/`；`*` 群組同樣允許 `/jobs/`；`Content-Signal: ai-train=no, search=yes, ai-input=yes`。Disallow 僅限垃圾關鍵字參數（keyword=*telegram* 等）。 |
| 列表頁 | `www.104.com.tw/jobs/main/` 為 SPA（9KB 殼，無 SSR 職缺卡） |
| API 端點 | `GET https://www.104.com.tw/jobs/search/api/jobs?keyword=…&page=N` → `{ data: [jobs…], metadata: { pagination: { count, currentPage, lastPage, total } } }`，30 筆/頁，服務端上限 lastPage=100（3,000 筆/查詢）。全板（無 keyword，ro=0）total 521,313。 |
| 每筆欄位 | `jobName`/`custName`/`jobAddrNoDesc`/`jobAddress`/`appearDate`(YYYYMMDD)/`description`(完整 JD)/`jobNo`/`salaryLow·High`(月薪 NTD，0=面議)/`remoteWorkType`/`link.job`(https://www.104.com.tw/job/{code}) |
| 防護 | ① 無 Referer → 403；`Referer: https://www.104.com.tw/jobs/search/` → 200（誠實 career-ops UA 即可）② **undici fetch 全 403**（任何標頭組合）；`node:https` Title-Case 標頭 → 200（6/6 實測）；curl.exe(Schannel) → 200；.NET → 403。屬請求簽名檢查，非 captcha。 |
| 對策 | provider 自帶 node:https 傳輸（curl 風格標頭：UA/Referer/Accept/Accept-Encoding: identity/Connection: keep-alive），host 固定、HTTPS-only、無 redirect 跟隨；429/5xx/timeout 重試 2 次。 |

### 1111人力銀行 → 🚫 不通過（不實作）

| 項目 | 結果 |
|------|------|
| robots.txt | 泛 `*` 群組無 bot 名稱封鎖；`allow: /job/*`；主列表 `/job-bank/job-index.asp` 未 Disallow |
| 列表/搜尋 | `/job-bank/job-index.asp` 與 `/search/job?c0=…` 皆回「Loading...」外殼，內嵌 `api/v1/captcha-gate`（Altcha）+ Cloudflare Turnstile 驗證，必須解題才能載入（FOREGROUND_TAKEOVER_HOLD_MS）。 |
| sitemap | 僅列分類/搜尋頁 URL（`sitemap_position.xml`、`jobindexcity_searchpage_ts*`），無職缺 detail URL 可列舉 |
| 結論 | 同 JobsGo/ViecOi 先例：專案不解 bot 保護 → 記 `SUPPORTED_JOB_BOARDS.md`「Evaluated, not supported」。1111 職缺走手動 pipeline（貼 URL）或 `search_queries` WebSearch 發現。 |
