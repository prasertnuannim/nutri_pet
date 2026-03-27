"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18nInstance } from "@/lib/i18n/config";
import {
  LANGUAGE_OPTIONS,
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_STORAGE_KEY,
  resolveLanguage,
  type AppLanguage,
} from "@/lib/i18n/shared";

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  languages: typeof LANGUAGE_OPTIONS;
  isReady: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyLanguage(language: AppLanguage) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage failures and still apply the language in-memory.
  }

  document.documentElement.lang = language;
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;
}

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: AppLanguage;
  children: React.ReactNode;
}) {
  const [i18n] = useState(() => createI18nInstance(initialLanguage));
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let storedLanguage: string | null = null;

    try {
      storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      storedLanguage = null;
    }

    setLanguageState(resolveLanguage(storedLanguage ?? initialLanguage));
    setIsReady(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LANGUAGE_STORAGE_KEY) {
        return;
      }

      setLanguageState(resolveLanguage(event.newValue));
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [initialLanguage]);

  useEffect(() => {
    applyLanguage(language);
    void i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider
        value={{
          language,
          setLanguage: setLanguageState,
          languages: LANGUAGE_OPTIONS,
          isReady,
        }}
      >
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useAppLanguage must be used within a LanguageProvider");
  }

  return context;
}
