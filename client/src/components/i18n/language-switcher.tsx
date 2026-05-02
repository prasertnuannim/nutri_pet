"use client";

import { startTransition } from "react";
import { Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppLanguage } from "@/context/language-context";
import { resolveLanguage } from "@/lib/i18n/shared";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const { language, languages, setLanguage } = useAppLanguage();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Select
      value={language}
      onValueChange={(value) => {
        const nextLanguage = resolveLanguage(value);
        setLanguage(nextLanguage);
        startTransition(() => {
          router.refresh();
        });
      }}
    >
      <SelectTrigger
        aria-label={t("languageSwitcher.label")}
        className={cn(
          "h-10 min-w-[148px] rounded-full border-border bg-background px-3 text-foreground shadow-sm",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Globe2 className="h-4 w-4 shrink-0 text-primary" />
          <SelectValue placeholder={t("languageSwitcher.placeholder")} />
        </div>
      </SelectTrigger>

      <SelectContent align="end">
        {languages.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {t(option.labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
