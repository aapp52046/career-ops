"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { CANONICAL_STATES } from "@/lib/format";
import { useT } from "@/lib/i18n/i18n";
import { statusKey } from "@/lib/i18n/strings";

// Status writeback control. Updates the existing tracker row (status cell) via
// /api/status — never adds rows. Reverts on failure; confirms with the
// terminal-popup animation.
export function StatusSelect({ n, current }: { n: string; current: string }) {
  const [status, setStatus] = useState(current);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { t } = useT();

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const prev = status;
    setStatus(next);
    setBusy(true);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n, status: next }),
      });
      if (!res.ok) throw new Error("write failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch {
      setStatus(prev); // revert on failure
    } finally {
      setBusy(false);
    }
  }

  const known = (CANONICAL_STATES as readonly string[]).includes(status);
  return (
    <span className="inline-flex items-center gap-2">
      <label className="text-xs text-faint">{t("status.label")}</label>
      <select
        value={status}
        onChange={onChange}
        disabled={busy}
        className="rounded-md border border-border bg-surface px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus:border-brand/50 disabled:opacity-50 max-sm:min-h-[44px]"
      >
        {!known && <option value={status}>{status}</option>}
        {CANONICAL_STATES.map((s) => {
          const sKey = statusKey(s);
          return (
            <option key={s} value={s}>
              {sKey ? t(sKey) : s}
            </option>
          );
        })}
      </select>
      {saved && (
        <span className="animate-terminal-popup inline-flex items-center gap-1 text-xs font-medium text-brand">
          <Check className="size-3" /> {t("status.saved")}
        </span>
      )}
    </span>
  );
}
