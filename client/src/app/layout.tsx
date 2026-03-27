import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import { ColorThemeProvider } from "@/context/color-theme-context";
import { LanguageProvider } from "@/context/language-context";
import {
  COLOR_THEME_STORAGE_KEY,
  COLOR_THEME_VALUES,
  DEFAULT_COLOR_THEME,
} from "@/lib/color-theme";
import {
  LANGUAGE_STORAGE_KEY,
  resolveLanguage,
} from "@/lib/i18n/shared";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriPet",
  description: "Next.js 16 + NextAuth + GoLong API server",
};

const themeInitScript = `
(() => {
  try {
    const storageKey = ${JSON.stringify(COLOR_THEME_STORAGE_KEY)};
    const fallbackTheme = ${JSON.stringify(DEFAULT_COLOR_THEME)};
    const supportedThemes = ${JSON.stringify(COLOR_THEME_VALUES)};
    const storedTheme = window.localStorage.getItem(storageKey);
    const theme = supportedThemes.includes(storedTheme ?? "")
      ? storedTheme
      : fallbackTheme;

    document.documentElement.dataset.colorTheme = theme;
  } catch {
    document.documentElement.dataset.colorTheme = ${JSON.stringify(DEFAULT_COLOR_THEME)};
  }
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLanguage = resolveLanguage(
    cookieStore.get(LANGUAGE_STORAGE_KEY)?.value,
  );

  return (
    <html
      lang={initialLanguage}
      className={`${plusJakarta.variable} ${notoThai.variable}`}
      data-color-theme={DEFAULT_COLOR_THEME}
      suppressHydrationWarning
    >
      <body
        className="font-sans transition-colors duration-500"
        style={{
          fontFamily:
            "var(--font-plus-jakarta), var(--font-noto-thai), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <Script id="color-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <LanguageProvider initialLanguage={initialLanguage}>
          <ColorThemeProvider>{children}</ColorThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
