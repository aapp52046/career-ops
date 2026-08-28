"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X, Settings } from "lucide-react";
import { useT } from "@/lib/i18n/i18n";
import type { TKey } from "@/lib/i18n/strings";

type Doctor = { available: boolean; onboardingNeeded: boolean; missing: string[]; warnings: string[] };

function hasCli(): boolean {
  try {
    return !!JSON.parse(localStorage.getItem("career-ops:config") || "{}").cliId;
  } catch {
    return false;
  }
}

// English labels feed the assistant kickoff prompt (the AI reads English).
const KICKOFF_LABELS: Record<string, string> = {
  "cv.md": "your CV",
  "config/profile.yml": "your profile — target roles, comp, location",
  "modes/_profile.md": "your personalization",
  "portals.yml": "the companies to scan",
};

// Translation keys for the human-facing list.
const DISPLAY_KEYS: Record<string, TKey> = {
  "cv.md": "ob.missing.cv",
  "config/profile.yml": "ob.missing.profile",
  "modes/_profile.md": "ob.missing.personalization",
  "portals.yml": "ob.missing.portals",
};

// Detect (via the core's doctor.mjs) whether setup is incomplete, and offer to
// finish it CONVERSATIONALLY — the assistant asks in plain language and writes
// the canonical files (no YAML to edit). This is the #1 adoption barrier.
export function OnboardingBanner() {
  const { t } = useT();
  const [d, setD] = useState<Doctor | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [cli, setCli] = useState(true); // assume until read (avoid CTA flash)

  useEffect(() => {
    setCli(hasCli());
    fetch("/api/doctor")
      .then((r) => r.json())
      .then(setD)
      .catch(() => {});
  }, []);

  if (dismissed || !d || !d.onboardingNeeded) return null;
  const displayItems = d.missing.map((m) => (DISPLAY_KEYS[m] ? t(DISPLAY_KEYS[m]) : m));
  const kickoffItems = d.missing.map((m) => KICKOFF_LABELS[m] ?? m);
  const kickoff =
    `Help me finish setting up career-ops. I still need to add ${kickoffItems.join(", ")} — walk me through just those, conversationally, and write the files for me. Don't ask me for anything that's already set up (for example, don't ask for my CV if it's already saved).`;

  return (
    <div className="dot-bg relative mb-6 overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 via-surface/40 to-transparent p-5">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-faint transition-colors hover:text-foreground"
        aria-label={t("ob.dismiss")}
      >
        <X className="size-4" />
      </button>
      <h2 className="font-display text-xl text-landing">{t("ob.title")}</h2>
      <p className="mt-1.5 max-w-xl text-sm text-muted">
        {t("ob.worksBest", { items: displayItems.join("、") })}{" "}
        <span className="text-foreground">{t("ob.noYaml")}</span> — {t("ob.answerPlain")}
      </p>
      {cli ? (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("co-assistant", { detail: { message: kickoff } }))}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-200"
        >
          <Sparkles className="size-4" /> {t("ob.setMeUp")}
        </button>
      ) : (
        // The assistant needs a CLI to run — without one the kickoff would silently
        // drop. Send them to connect one first.
        <Link
          href="/config"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-200"
        >
          <Settings className="size-4" /> {t("ob.connectCli")}
        </Link>
      )}
    </div>
  );
}
