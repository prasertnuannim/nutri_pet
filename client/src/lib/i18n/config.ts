"use client";

import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  I18N_RESOURCES,
  type AppLanguage,
} from "@/lib/i18n/shared";

export function createI18nInstance(language: AppLanguage = DEFAULT_LANGUAGE) {
  const i18n = createInstance();

  void i18n.use(initReactI18next).init({
    resources: I18N_RESOURCES,
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    react: {
      useSuspense: false,
    },
    initImmediate: false,
  });

  return i18n;
}
