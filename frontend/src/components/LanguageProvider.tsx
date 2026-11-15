"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMessage, type Locale, type MessageKey } from "@/services/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
}

const LANGUAGE_STORAGE_KEY = "spacehealth-language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLocale === "en" || savedLocale === "es") setLocaleState(savedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = locale === "en"
      ? "FAVALORO SpaceHealth | Crew dashboard"
      : "FAVALORO SpaceHealth | Panel de tripulación";
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute(
      "content",
      locale === "en"
        ? "A demo wellbeing dashboard for crew members."
        : "Panel demostrativo de bienestar para la tripulación.",
    );
  }, [locale]);

  function setLocale(nextLocale: Locale) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLocale);
    setLocaleState(nextLocale);
  }

  const value = {
    locale,
    setLocale,
    t: (key: MessageKey) => getMessage(locale, key),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}