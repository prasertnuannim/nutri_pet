 "use client";

import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-6xl space-y-3">
      <h1 className="text-3xl font-semibold text-foreground">
        {t("auditPage.title")}
      </h1>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
        {t("auditPage.description")}
      </p>
    </main>
  );
}
