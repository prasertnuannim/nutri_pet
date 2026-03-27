"use client";

import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="space-y-3 rounded-3xl border border-border bg-card px-8 py-10 text-center shadow-sm shadow-black/5">
        <h1 className="text-3xl font-semibold">{t("notFound.title")}</h1>
        <p className="text-muted-foreground">
          {t("notFound.description")}
        </p>
      </div>
    </main>
  );
}
