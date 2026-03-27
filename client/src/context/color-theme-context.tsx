"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  COLOR_THEMES,
  COLOR_THEME_STORAGE_KEY,
  DEFAULT_COLOR_THEME,
  resolveColorTheme,
  type ColorTheme,
} from "@/lib/color-theme";

type ColorThemeContextValue = {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  themes: typeof COLOR_THEMES;
};

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

function applyColorTheme(theme: ColorTheme) {
  document.documentElement.dataset.colorTheme = theme;
}

function getInitialTheme(): ColorTheme {
  if (typeof document !== "undefined") {
    return resolveColorTheme(
      document.documentElement.dataset.colorTheme ||
        window.localStorage.getItem(COLOR_THEME_STORAGE_KEY),
    );
  }

  return DEFAULT_COLOR_THEME;
}

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ColorTheme>(getInitialTheme);

  useEffect(() => {
    applyColorTheme(theme);
    window.localStorage.setItem(COLOR_THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== COLOR_THEME_STORAGE_KEY) {
        return;
      }

      setTheme(resolveColorTheme(event.newValue));
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <ColorThemeContext.Provider value={{ theme, setTheme, themes: COLOR_THEMES }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);

  if (!context) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }

  return context;
}
