import React, { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";
import en from "./en.json";
import my from "./my.json";

export type Locale = "en" | "my";

const STORAGE_KEY = "ecomind-locale";
const dictionaries: Record<Locale, Record<string, string>> = { en, my };

type TranslateVars = Record<string, string | number>;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: TranslateVars) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "my" ? "my" : "en";
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale === "my" ? "my" : "en";
  document.documentElement.dataset.locale = locale;
}

function interpolate(template: string, vars?: TranslateVars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] === undefined ? `{${name}}` : String(vars[name])
  );
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useLayoutEffect(() => {
    applyLocale(locale);
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const t = (key: string, vars?: TranslateVars) => {
      const template = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
      return interpolate(template, vars);
    };

    return {
      locale,
      setLocale: setLocaleState,
      t,
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
