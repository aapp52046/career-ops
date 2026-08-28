// Localization dictionaries for the web UI. Flat dot-namespaced keys; zhTW is
// typed against en so a missing translation is a compile error. Values may
// contain {placeholder} tokens filled by translate().

const en = {
  // Nav
  "nav.today": "Today",
  "nav.explore": "Explore",
  "nav.pipeline": "Pipeline",
  "nav.followups": "Follow-ups",
  "nav.portals": "Portals",
  "nav.analytics": "Analytics",
  "nav.cv": "CV",
  "nav.config": "Config",
  "nav.newChip": "New",

  // Shell
  "shell.localFirst": "local-first · v0",
  "shell.menu": "Menu",
  "shell.openMenu": "Open menu",
  "shell.closeMenu": "Close menu",
  "shell.home": "career-ops home",
  "shell.language": "Language",
  "shell.switchLang": "Switch language",

  // Today (home)
  "home.todayLabel": "today",
  "home.allCaughtUp": "You're all caught up.",
  "home.newMatches": "{n} new matches this week",
  "home.followupsDue": "{n} follow-ups due",
  "home.keepScanning": "I'll keep scanning the market in the background and surface anything that fits.",
  "home.actionQueue": "Your action queue for today — discovery and follow-ups, in one place.",
  "home.findNewRoles": "Find new roles",
  "home.openPipeline": "Open pipeline",
  "home.followupsDueTitle": "Follow-ups due",
  "home.keepAliveHint": "Keep your applications alive — a nudge beats silence",
  "home.nextFollowup": "Next follow-up",
  "home.nothingDue": "Nothing due yet",
  "home.upcomingDate": "upcoming {d}",
  "home.awaitingDecision": "Awaiting your decision",
  "home.scoredApplySkip": "Scored — apply or skip",
  "home.freshMatches": "Fresh matches this week",
  "home.foundByScans": "Found by your free scans · 0 tokens",
  "home.seeAll": "See all {n} →",
  "home.nothingNeedsYou": "Nothing needs you right now. Run a",
  "home.freeScan": "free scan",
  "home.orCheck": "to surface this week's roles, or check your",
  "home.pipelineWord": "pipeline",

  // Decision card
  "decision.review": "Review",
  "decision.skip": "Skip",
  "decision.applied": "Applied",
  "decision.recordApplied": "Record Applied without opening the apply flow",

  // Follow-up card
  "followup.appliedOn": "applied {d}",
  "followup.due": "follow-up due",
  "followup.markFollowedUp": "Mark followed up",
  "followup.followedUp": "Followed up",
  "followup.retry": "Retry",
  "followup.failedRetry": "{msg} — retry",
  "followup.failed": "Failed",
  "followup.openReport": "Open report",
  "followup.snooze": "Snooze",

  // Pipeline
  "pipeline.title": "Pipeline",
  "pipeline.inInbox": "{n} in inbox",
  "pipeline.tracked": "{n} tracked",
  "pipeline.searchPlaceholder": "Search company or role…",
  "pipeline.tab.inbox": "INBOX",
  "pipeline.tab.all": "ALL",
  "pipeline.tab.evaluated": "EVALUATED",
  "pipeline.tab.applied": "APPLIED",
  "pipeline.tab.responded": "RESPONDED",
  "pipeline.tab.interview": "INTERVIEW",
  "pipeline.tab.offer": "OFFER",
  "pipeline.tab.hired": "HIRED",
  "pipeline.tab.rejected": "REJECTED",
  "pipeline.tab.discarded": "DISCARDED",
  "pipeline.tab.skip": "SKIP",
  "pipeline.filtered": "Filtered:",
  "pipeline.clearScoreFilter": "Clear score filter",
  "pipeline.scoreMin": "score ≥ {v}",
  "pipeline.noMatches": "No matches",
  "pipeline.tryDifferentTab": "Try a different tab or clear the search.",
  "pipeline.clearSearchFullInbox": "Clear the search to see the full inbox.",
  "pipeline.yourInbox": "Your",
  "pipeline.inboxWord": "inbox",
  "pipeline.inboxEmpty": "inbox is empty.",
  "pipeline.nothingPending": "Nothing pending right now.",
  "pipeline.findRolesFree": "Find roles that match your CV — free, no tokens spent.",
  "pipeline.runFirstScan": "Run your first free scan",
  "pipeline.preferTerminal": "Prefer the terminal? Run",
  "pipeline.orAddUrls": ", or add job URLs to",
  "pipeline.sort.company": "company",
  "pipeline.sort.role": "role",
  "pipeline.sort.score": "score",
  "pipeline.sort.status": "status",
  "pipeline.sort.date": "date",

  // Canonical status labels
  "status.label": "status",
  "status.saved": "saved",
  "status.Evaluated": "Evaluated",
  "status.Applied": "Applied",
  "status.Responded": "Responded",
  "status.Interview": "Interview",
  "status.Offer": "Offer",
  "status.Hired": "Hired",
  "status.Rejected": "Rejected",
  "status.Discarded": "Discarded",
  "status.SKIP": "SKIP",

  // Delete from tracker
  "delete.removeFromTracker": "Remove from tracker",
  "delete.confirmTitle": "Permanently remove application #{n} from your tracker?",
  "delete.cantUndo": "This can't be undone.",
  "delete.reportLeft": " Its report file ({f}) is left on disk.",
  "delete.delete": "Delete",
  "delete.cancel": "Cancel",
  "delete.cantRemoveRow": "This row can't be removed.",
  "delete.cantReach": "Couldn't reach the tracker.",
  "delete.failed": "Delete failed.",

  // Generate PDF
  "pdf.generating": "Generating CV…",
  "pdf.viewTailored": "View tailored CV",
  "pdf.regenerate": "Regenerate the tailored CV",
  "pdf.generateTailored": "Generate tailored CV (PDF)",
  "pdf.generateHint": "Generate an ATS-optimized CV tailored to this role",
  "pdf.subtitle": "tailored for this role",

  // Quick evaluate
  "quick.placeholder": "Paste a job URL to evaluate…",
  "quick.evaluate": "Evaluate",
  "quick.pasteFull": "Paste a full job-posting URL (https://…).",
  "quick.evaluating": "Evaluating — watch it in the Workers tray.",
  "quick.runsOnYourAi": "Evaluation runs on your own AI — your key, your machine.",

  // Inbox triage
  "inbox.filterPlaceholder": "Filter by company or role…",
  "inbox.locationPlaceholder": "location…",
  "inbox.clear": "Clear",
  "inbox.filteringFree": "Filtering is free — only scoring uses tokens.",
  "inbox.freshWorthALook": "Fresh — worth a look",
  "inbox.matches": "{n} matches",
  "inbox.allRoles": "All roles",
  "inbox.hiddenRestore": "{n} hidden · restore",
  "inbox.selected": "{n} selected",
  "inbox.saveToShortlist": "Save to shortlist",
  "inbox.noMatchesInbox": "Loosen the filters to see more of your inbox.",
  "inbox.seeAllInbox": "See all {n} in inbox →",
  "inbox.saveRolesHint": "Save roles worth a look, then score them together — one token spend.",
  "inbox.undo": "Undo",
  "inbox.skipped": "Skipped {c}",
  "inbox.notScored": "not scored",
  "inbox.scoring": "Scoring…",
  "inbox.save": "Save",
  "inbox.saved": "Saved",
  "inbox.inShortlist": "In your shortlist",
  "inbox.skipHide": "Skip — hide from the inbox",
  "inbox.selectItem": "Select {c} {r}",
  "inbox.today": "today",
  "inbox.yesterday": "yesterday",
  "inbox.dAgo": "{n}d ago",
  "inbox.wAgo": "{n}w ago",
  "inbox.moAgo": "{n}mo ago",
  "inbox.shortlist": "Shortlist",
  "inbox.scoreN": "Score {n}",
  "inbox.scoreNNow": "Score {n} now",
  "inbox.noAiConfigured": "No AI configured.",
  "inbox.setUp": "Set up",
  "inbox.usesYourTokens": "uses your tokens",
  "inbox.onlyStepSpends": "— the only step that spends",
  "inbox.removeItem": "Remove {c}",

  // Usage meter
  "usage.title": "Usage",
  "usage.titleAttr": "{n} tokens in the last {w}",

  // Beta banner
  "beta.reportBug": "Report a bug",
  "beta.title": "Report a bug · {c}",
  "beta.close": "Close",
  "beta.placeholder": "What were you doing, and what went wrong?",
  "beta.checkExisting": "Check for existing reports first",
  "beta.whatAttached": "Exactly what gets attached — review before sending ↓",
  "beta.alreadyReported": "Already reported? A 👍 on an existing issue beats a duplicate:",
  "beta.nothingSent": "Opens a GitHub issue you confirm — nothing is sent until you click. NEVER includes your CV, profile, application answers, or job URLs.",
  "beta.cancel": "Cancel",
  "beta.openIssue": "Open GitHub issue",

  // Onboarding banner
  "ob.title": "Let's finish setting you up",
  "ob.worksBest": "career-ops works best when it knows you. We still need {items}.",
  "ob.noYaml": "No YAML to edit",
  "ob.answerPlain": "answer in plain language and the assistant writes it for you.",
  "ob.setMeUp": "Set me up with the assistant",
  "ob.connectCli": "Connect your AI CLI to get started",
  "ob.dismiss": "Dismiss",
  "ob.missing.cv": "your CV",
  "ob.missing.profile": "your profile — target roles, comp, location",
  "ob.missing.personalization": "your personalization",
  "ob.missing.portals": "the companies to scan",

  // First-run home
  "firstrun.badge": "local-first · your machine",
  "firstrun.title": "Drop your CV. See who's hiring you in 60 seconds.",
  "firstrun.noAccount": "No account. Paste text or drop a .md / .txt file to start. A PDF needs an AI CLI in",
  "firstrun.configLink": "Config",
  "firstrun.first": "first. The market scan is",
  "firstrun.free": "free",
  "firstrun.onlySpend": "You only spend tokens when you choose to score a role.",
} as const;

export type TKey = keyof typeof en;
export type Lang = "en" | "zhTW";

const zhTW: Record<TKey, string> = {
  // Nav
  "nav.today": "今天",
  "nav.explore": "探索",
  "nav.pipeline": "管道",
  "nav.followups": "後續追蹤",
  "nav.portals": "求職平台",
  "nav.analytics": "分析",
  "nav.cv": "履歷",
  "nav.config": "設定",
  "nav.newChip": "新",

  // Shell
  "shell.localFirst": "本機優先 · v0",
  "shell.menu": "選單",
  "shell.openMenu": "開啟選單",
  "shell.closeMenu": "關閉選單",
  "shell.home": "career-ops 首頁",
  "shell.language": "語言",
  "shell.switchLang": "切換語言",

  // Today (home)
  "home.todayLabel": "今天",
  "home.allCaughtUp": "你已經全部跟上了。",
  "home.newMatches": "本週 {n} 筆新職缺",
  "home.followupsDue": "{n} 筆後續追蹤待辦",
  "home.keepScanning": "我會持續在背景掃描市場，遇到合適的職缺就提醒你。",
  "home.actionQueue": "你今天的待辦隊列 — 職缺發現與後續追蹤，一次看齊。",
  "home.findNewRoles": "尋找新職缺",
  "home.openPipeline": "開啟管道",
  "home.followupsDueTitle": "待辦後續追蹤",
  "home.keepAliveHint": "讓你的應徵保持活絡 — 主動追蹤勝過沉默",
  "home.nextFollowup": "下一次追蹤",
  "home.nothingDue": "目前無待辦",
  "home.upcomingDate": "預定 {d}",
  "home.awaitingDecision": "等你決定",
  "home.scoredApplySkip": "已評分 — 投遞或略過",
  "home.freshMatches": "本週新職缺",
  "home.foundByScans": "免費掃描發現 · 0 token",
  "home.seeAll": "查看全部 {n} →",
  "home.nothingNeedsYou": "目前沒有需要你處理的事。跑一次",
  "home.freeScan": "免費掃描",
  "home.orCheck": "找出本週職缺，或看看你的",
  "home.pipelineWord": "管道",

  // Decision card
  "decision.review": "檢視",
  "decision.skip": "略過",
  "decision.applied": "已投遞",
  "decision.recordApplied": "不開啟應徵流程，直接記錄為已投遞",

  // Follow-up card
  "followup.appliedOn": "{d} 投遞",
  "followup.due": "待追蹤",
  "followup.markFollowedUp": "標記已追蹤",
  "followup.followedUp": "已追蹤",
  "followup.retry": "重試",
  "followup.failedRetry": "{msg} — 重試",
  "followup.failed": "失敗",
  "followup.openReport": "開啟報告",
  "followup.snooze": "稍後提醒",

  // Pipeline
  "pipeline.title": "管道",
  "pipeline.inInbox": "收件匣 {n} 筆",
  "pipeline.tracked": "追蹤 {n} 筆",
  "pipeline.searchPlaceholder": "搜尋公司或職稱…",
  "pipeline.tab.inbox": "收件匣",
  "pipeline.tab.all": "全部",
  "pipeline.tab.evaluated": "已評估",
  "pipeline.tab.applied": "已投遞",
  "pipeline.tab.responded": "已回應",
  "pipeline.tab.interview": "面試中",
  "pipeline.tab.offer": "已獲 Offer",
  "pipeline.tab.hired": "已到職",
  "pipeline.tab.rejected": "已拒絕",
  "pipeline.tab.discarded": "已放棄",
  "pipeline.tab.skip": "略過",
  "pipeline.filtered": "已篩選：",
  "pipeline.clearScoreFilter": "清除分數篩選",
  "pipeline.scoreMin": "分數 ≥ {v}",
  "pipeline.noMatches": "無符合結果",
  "pipeline.tryDifferentTab": "試試其他分頁或清除搜尋。",
  "pipeline.clearSearchFullInbox": "清除搜尋以查看完整收件匣。",
  "pipeline.yourInbox": "你的",
  "pipeline.inboxWord": "收件匣",
  "pipeline.inboxEmpty": "收件匣是空的。",
  "pipeline.nothingPending": "目前沒有待處理項目。",
  "pipeline.findRolesFree": "找出符合你履歷的職缺 — 免費、不花 token。",
  "pipeline.runFirstScan": "執行第一次免費掃描",
  "pipeline.preferTerminal": "偏好用終端機？執行",
  "pipeline.orAddUrls": "，或把職缺 URL 加進",
  "pipeline.sort.company": "公司",
  "pipeline.sort.role": "職稱",
  "pipeline.sort.score": "分數",
  "pipeline.sort.status": "狀態",
  "pipeline.sort.date": "日期",

  // Canonical status labels
  "status.label": "狀態",
  "status.saved": "已儲存",
  "status.Evaluated": "已評估",
  "status.Applied": "已投遞",
  "status.Responded": "已回應",
  "status.Interview": "面試中",
  "status.Offer": "已獲 Offer",
  "status.Hired": "已到職",
  "status.Rejected": "已拒絕",
  "status.Discarded": "已放棄",
  "status.SKIP": "略過",

  // Delete from tracker
  "delete.removeFromTracker": "從追蹤表移除",
  "delete.confirmTitle": "要永久把申請 #{n} 從追蹤表移除嗎？",
  "delete.cantUndo": "此操作無法復原。",
  "delete.reportLeft": " 其報告檔（{f}）會保留在磁碟上。",
  "delete.delete": "刪除",
  "delete.cancel": "取消",
  "delete.cantRemoveRow": "這筆資料無法移除。",
  "delete.cantReach": "無法連上追蹤表。",
  "delete.failed": "刪除失敗。",

  // Generate PDF
  "pdf.generating": "產生履歷中…",
  "pdf.viewTailored": "查看客製履歷",
  "pdf.regenerate": "重新產生客製履歷",
  "pdf.generateTailored": "產生客製履歷（PDF）",
  "pdf.generateHint": "針對此職缺產生 ATS 最佳化履歷",
  "pdf.subtitle": "針對此職缺客製",

  // Quick evaluate
  "quick.placeholder": "貼上職缺 URL 來評估…",
  "quick.evaluate": "評估",
  "quick.pasteFull": "請貼上完整的職缺 URL（https://…）。",
  "quick.evaluating": "評估中 — 可在工作列（Workers）查看進度。",
  "quick.runsOnYourAi": "評估使用你自己的 AI 執行 — 你的金鑰、你的機器。",

  // Inbox triage
  "inbox.filterPlaceholder": "依公司或職稱篩選…",
  "inbox.locationPlaceholder": "地點…",
  "inbox.clear": "清除",
  "inbox.filteringFree": "篩選免費 — 只有評分會花 token。",
  "inbox.freshWorthALook": "新鮮職缺 — 值得一看",
  "inbox.matches": "{n} 筆符合",
  "inbox.allRoles": "全部職缺",
  "inbox.hiddenRestore": "已隱藏 {n} 筆 · 還原",
  "inbox.selected": "已選 {n} 筆",
  "inbox.saveToShortlist": "存入入圍清單",
  "inbox.noMatchesInbox": "放寬篩選條件以查看更多收件匣內容。",
  "inbox.seeAllInbox": "查看收件匣全部 {n} 筆 →",
  "inbox.saveRolesHint": "先把值得一看的職缺存下來，再一起評分 — 一次花費。",
  "inbox.undo": "復原",
  "inbox.skipped": "已略過 {c}",
  "inbox.notScored": "尚未評分",
  "inbox.scoring": "評分中…",
  "inbox.save": "儲存",
  "inbox.saved": "已儲存",
  "inbox.inShortlist": "已在入圍清單",
  "inbox.skipHide": "略過 — 從收件匣隱藏",
  "inbox.selectItem": "選取 {c} {r}",
  "inbox.today": "今天",
  "inbox.yesterday": "昨天",
  "inbox.dAgo": "{n} 天前",
  "inbox.wAgo": "{n} 週前",
  "inbox.moAgo": "{n} 個月前",
  "inbox.shortlist": "入圍清單",
  "inbox.scoreN": "評分 {n} 筆",
  "inbox.scoreNNow": "立即評分 {n} 筆",
  "inbox.noAiConfigured": "尚未設定 AI。",
  "inbox.setUp": "前往設定",
  "inbox.usesYourTokens": "使用你的 token",
  "inbox.onlyStepSpends": "— 唯一會花費的步驟",
  "inbox.removeItem": "移除 {c}",

  // Usage meter
  "usage.title": "用量",
  "usage.titleAttr": "最近 {w} 使用了 {n} tokens",

  // Beta banner
  "beta.reportBug": "回報問題",
  "beta.title": "回報問題 · {c}",
  "beta.close": "關閉",
  "beta.placeholder": "你當時在做什麼？出了什麼問題？",
  "beta.checkExisting": "先看看是否已有人回報",
  "beta.whatAttached": "會附上哪些內容 — 送出前請先檢閱 ↓",
  "beta.alreadyReported": "已經有人回報了嗎？在既有 issue 按 👍 比重複發文更好：",
  "beta.nothingSent": "開啟一個由你確認的 GitHub issue — 在你點擊之前不會送出任何東西。絕不包含你的履歷、個人資料、應徵回答或職缺 URL。",
  "beta.cancel": "取消",
  "beta.openIssue": "開啟 GitHub issue",

  // Onboarding banner
  "ob.title": "讓我們完成你的設定",
  "ob.worksBest": "career-ops 認識你之後表現最好。我們還需要 {items}。",
  "ob.noYaml": "不用編輯 YAML",
  "ob.answerPlain": "用白話回答，助理會幫你寫好檔案。",
  "ob.setMeUp": "讓助理幫我設定",
  "ob.connectCli": "連接你的 AI CLI 開始使用",
  "ob.dismiss": "關閉",
  "ob.missing.cv": "你的履歷",
  "ob.missing.profile": "你的個人資料 — 目標職稱、薪資、地點",
  "ob.missing.personalization": "你的個人化設定",
  "ob.missing.portals": "要掃描的公司",

  // First-run home
  "firstrun.badge": "本機優先 · 你的機器",
  "firstrun.title": "丟進你的履歷，60 秒內看看誰在找你。",
  "firstrun.noAccount": "免帳號。貼上文字或拖入 .md / .txt 檔即可開始。PDF 需先在",
  "firstrun.configLink": "設定",
  "firstrun.first": "完成 AI CLI 設定。市場掃描",
  "firstrun.free": "免費",
  "firstrun.onlySpend": "只有在你選擇評分職缺時才會花費 token。",
};

export const STRINGS: Record<Lang, Record<TKey, string>> = { en, zhTW };

export const LANG_STORAGE_KEY = "career-ops:lang";

export function detectLang(): Lang {
  if (typeof navigator !== "undefined" && /^zh/i.test(navigator.language)) return "zhTW";
  return "en";
}

export function translate(lang: Lang, key: TKey, vars?: Record<string, string | number>): string {
  let s: string = STRINGS[lang][key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  }
  return s;
}

const STATUS_KEYS: Record<string, TKey> = {
  Evaluated: "status.Evaluated",
  Applied: "status.Applied",
  Responded: "status.Responded",
  Interview: "status.Interview",
  Offer: "status.Offer",
  Hired: "status.Hired",
  Rejected: "status.Rejected",
  Discarded: "status.Discarded",
  SKIP: "status.SKIP",
};

/** Canonical status → translation key (null when unknown, caller keeps the raw value). */
export function statusKey(status: string): TKey | null {
  return STATUS_KEYS[status] ?? null;
}
