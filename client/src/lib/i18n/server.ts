import { cookies } from "next/headers";
import {
  resolveLanguage,
  translateText,
  LANGUAGE_STORAGE_KEY,
  type AppLanguage,
} from "@/lib/i18n/shared";

export function createServerTranslator(language: AppLanguage) {
  return (key: string, values?: Record<string, string | number>, fallback?: string) =>
    translateText(language, key, values, fallback);
}

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const language = resolveLanguage(cookieStore.get(LANGUAGE_STORAGE_KEY)?.value);

  return {
    language,
    t: createServerTranslator(language),
  };
}
