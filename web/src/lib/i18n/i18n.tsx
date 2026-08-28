"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  LANG_STORAGE_KEY,
  STRINGS,
  detectLang,
  translate,
  type Lang,
  type TKey,
} from "./strings";

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
};

const Ctx = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => STRINGS.en[key],
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  // SSR-safe: server + first client render agree on "en"; the stored/browser
  // preference is applied right after mount (no hydration mismatch).
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "zhTW" || stored === "en") setLangState(stored);
      else setLangState(detectLang());
    } catch {
      setLangState(detectLang());
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* private mode */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "zhTW" ? "en" : "zhTW";
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang],
  );

  return <Ctx.Provider value={{ lang, setLang, toggleLang, t }}>{children}</Ctx.Provider>;
}

export function useT(): I18nCtx {
  return useContext(Ctx);
}
