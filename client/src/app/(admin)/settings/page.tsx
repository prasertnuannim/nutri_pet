"use client";

import { Check, Palette, Users2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import AccountForm from "@/app/(admin)/settings/accountForm";
import { useColorTheme } from "@/context/color-theme-context";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme, setTheme, themes } = useColorTheme();
  const activeTheme = themes.find((item) => item.value === theme) ?? themes[0];

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-[28px] border border-border bg-card p-4 shadow-sm shadow-black/5 sm:p-5">
        <div className="mb-4 space-y-2 border-b border-border pb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Users2 className="h-3.5 w-3.5" />
            {t("accountPage.title")}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {t("accountPage.title")}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {t("accountPage.description")}
            </p>
          </div>
        </div>

        <AccountForm />
      </section>

      <section className="rounded-[28px] border border-border bg-card p-4 shadow-sm shadow-black/5 sm:p-5">
        <div className="mb-4 space-y-2 border-b border-border pb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Palette className="h-3.5 w-3.5" />
            {t("settingsPage.badge")}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {t("settingsPage.title")}
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                {t("settingsPage.description")}
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
              <span
                className="h-2.5 w-2.5 rounded-full border border-primary/20"
                style={{ backgroundColor: activeTheme.swatch }}
              />
              {t("settingsPage.active", {
                theme: t(activeTheme.labelKey),
              })}
            </div>
          </div>
        </div>

        <div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t("settingsPage.paletteTitle")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("settingsPage.paletteDescription")}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {themes.map((item) => {
              const isActive = item.value === theme;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTheme(item.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                    isActive
                      ? "border-primary bg-primary-soft text-primary shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/25 hover:bg-muted/60",
                  )}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/5 shadow-inner"
                    style={{ backgroundColor: item.swatch }}
                  >
                    {isActive ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className="h-3 w-3 rounded-full bg-white/85" />
                    )}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {t(item.labelKey)}
                    </span>
                    <span
                      className={cn(
                        "block truncate text-xs",
                        isActive ? "text-primary/80" : "text-muted-foreground",
                      )}
                    >
                      {t(item.descriptionKey)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
