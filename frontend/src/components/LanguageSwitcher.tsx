"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="language-switcher" role="group" aria-label={t("language")}>
      <button
        className={locale === "en" ? "language-option language-option-active" : "language-option"}
        type="button"
        aria-pressed={locale === "en"}
        aria-label={t("english")}
        title={t("english")}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        className={locale === "es" ? "language-option language-option-active" : "language-option"}
        type="button"
        aria-pressed={locale === "es"}
        aria-label={t("spanish")}
        title={t("spanish")}
        onClick={() => setLocale("es")}
      >
        ES
      </button>
    </div>
  );
}