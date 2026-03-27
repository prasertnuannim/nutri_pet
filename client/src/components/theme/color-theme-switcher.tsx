"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useColorTheme } from "@/context/color-theme-context";
import { isColorTheme } from "@/lib/color-theme";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ColorThemeSwitcher({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation();
  const { theme, setTheme, themes } = useColorTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-2", className)} aria-hidden="true">
        <div className="h-8 w-[148px] rounded-lg border border-border bg-card/80 sm:w-[168px]" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Palette className="hidden h-4 w-4 text-primary sm:block" />
      <Select
        value={theme}
        onValueChange={(value) => {
          if (isColorTheme(value)) {
            setTheme(value);
          }
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label={t("themeSwitcher.label")}
          className="w-[148px] border-border bg-card/90 text-foreground shadow-sm sm:w-[168px]"
        >
          <SelectValue placeholder={t("themeSwitcher.placeholder")} />
        </SelectTrigger>
        <SelectContent align="end" className="min-w-[168px]">
          {themes.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-border"
                  style={{ backgroundColor: item.swatch }}
                />
                {t(item.labelKey)}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
