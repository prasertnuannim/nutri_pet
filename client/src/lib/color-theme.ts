export const COLOR_THEME_STORAGE_KEY = "nutripet-color-theme";

export const COLOR_THEMES = [
  {
    value: "forest",
    labelKey: "themes.forest.label",
    swatch: "#15803d",
    descriptionKey: "themes.forest.description",
  },
  {
    value: "sky",
    labelKey: "themes.sky.label",
    swatch: "#0ea5e9",
    descriptionKey: "themes.sky.description",
  },
  {
    value: "yellow",
    labelKey: "themes.yellow.label",
    swatch: "#d97706",
    descriptionKey: "themes.yellow.description",
  },
  {
    value: "lime",
    labelKey: "themes.lime.label",
    swatch: "#65a30d",
    descriptionKey: "themes.lime.description",
  },
  {
    value: "navy",
    labelKey: "themes.navy.label",
    swatch: "#1e40af",
    descriptionKey: "themes.navy.description",
  },
  {
    value: "cocoa",
    labelKey: "themes.cocoa.label",
    swatch: "#9a3412",
    descriptionKey: "themes.cocoa.description",
  },
  {
    value: "sunset",
    labelKey: "themes.sunset.label",
    swatch: "#ea580c",
    descriptionKey: "themes.sunset.description",
  },
  {
    value: "violet",
    labelKey: "themes.violet.label",
    swatch: "#7c3aed",
    descriptionKey: "themes.violet.description",
  },
  {
    value: "rose",
    labelKey: "themes.rose.label",
    swatch: "#e11d48",
    descriptionKey: "themes.rose.description",
  },
] as const;

export type ColorTheme = (typeof COLOR_THEMES)[number]["value"];

export const DEFAULT_COLOR_THEME: ColorTheme = "forest";
export const COLOR_THEME_VALUES = COLOR_THEMES.map((theme) => theme.value);

const colorThemeValues = new Set<ColorTheme>(COLOR_THEME_VALUES);

export function isColorTheme(
  value: string | null | undefined,
): value is ColorTheme {
  return value != null && colorThemeValues.has(value as ColorTheme);
}

export function resolveColorTheme(
  value: string | null | undefined,
): ColorTheme {
  return isColorTheme(value) ? value : DEFAULT_COLOR_THEME;
}
