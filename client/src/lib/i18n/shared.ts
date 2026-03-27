import enCommon from "@/locales/en/common.json";
import thCommon from "@/locales/th/common.json";
import zhCommon from "@/locales/zh/common.json";

export const LANGUAGE_STORAGE_KEY = "nutripet-language";
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const APP_LANGUAGES = ["th", "en", "zh"] as const;
export type AppLanguage = (typeof APP_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: AppLanguage = "th";

export const LANGUAGE_OPTIONS = [
  { value: "th", labelKey: "languages.th" },
  { value: "en", labelKey: "languages.en" },
  { value: "zh", labelKey: "languages.zh" },
] as const satisfies ReadonlyArray<{ value: AppLanguage; labelKey: string }>;

export const I18N_RESOURCES = {
  th: { common: thCommon },
  en: { common: enCommon },
  zh: { common: zhCommon },
} as const;

export type CommonDictionary = (typeof I18N_RESOURCES)[AppLanguage]["common"];

export function isSupportedLanguage(value: unknown): value is AppLanguage {
  return (
    typeof value === "string" &&
    APP_LANGUAGES.includes(value as AppLanguage)
  );
}

export function resolveLanguage(value: unknown): AppLanguage {
  if (value === "ja") {
    return "zh";
  }

  return isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
}

export function getIntlLocale(language: AppLanguage): string {
  switch (language) {
    case "en":
      return "en-US";
    case "zh":
      return "zh-CN";
    case "th":
    default:
      return "th-TH";
  }
}

function getNestedValue(source: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

function interpolate(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    const value = values[token];
    return value == null ? "" : String(value);
  });
}

export function translateText(
  language: AppLanguage,
  key: string,
  values?: Record<string, string | number>,
  fallback?: string,
): string {
  const primary = getNestedValue(I18N_RESOURCES[language].common, key);
  const secondary = getNestedValue(I18N_RESOURCES[DEFAULT_LANGUAGE].common, key);
  const resolved =
    typeof primary === "string"
      ? primary
      : typeof secondary === "string"
        ? secondary
        : fallback ?? key;

  return interpolate(resolved, values);
}
