"use client";

import { Languages } from "lucide-react";
import { useT } from "@/lib/i18n/i18n";

// Compact language pill: shows the CURRENT UI language, click cycles en ↔ zh-TW.
export function LanguageToggle() {
  const { lang, toggleLang } = useT();
  return (
    <button
      type="button"
      onClick={toggleLang}
      title={lang === "zhTW" ? "Switch to English" : "切換為繁體中文"}
      aria-label={lang === "zhTW" ? "Switch to English" : "切換為繁體中文"}
      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-md px-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
    >
      <Languages className="size-4" />
      <span className="hidden tabular-nums md:inline">{lang === "zhTW" ? "繁中" : "EN"}</span>
    </button>
  );
}
