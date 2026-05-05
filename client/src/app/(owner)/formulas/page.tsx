import { RequirementsClient } from "./_components/requirements-client";
import { getRequirementsAction } from "./actions";
import { getServerTranslation } from "@/lib/i18n/server";
import type { Requirement } from "@/types/requirement.type";

export const dynamic = "force-dynamic";

type ServerTranslator = (
  key: string,
  values?: Record<string, string | number>,
  fallback?: string,
) => string;

function RequirementsLoadError({ t }: { t: ServerTranslator }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-500">
          {t("formulaSettings.requirementsPage.loadErrorEyebrow")}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          {t("formulaSettings.requirementsPage.loadErrorTitle")}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          {t("formulaSettings.requirementsPage.loadErrorDescription")}
        </p>
      </div>
    </main>
  );
}

function RequirementsPageLayout({
  requirements,
  t,
}: {
  requirements: Requirement[];
  t: ServerTranslator;
}) {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              {t("formulaSettings.requirementsPage.pageEyebrow")}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              {t("formulaSettings.requirementsPage.pageTitle")}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              {t("formulaSettings.requirementsPage.pageDescription")}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-zinc-500">
              {t("formulaSettings.requirementsPage.countLabel")}
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{requirements.length}</p>
          </div>
        </div>

        <RequirementsClient initialRequirements={requirements} />
      </div>
    </main>
  );
}

export default async function RequirementsPage() {
  const { t } = await getServerTranslation();
  const result = await getRequirementsAction();

  if (!result?.success || !Array.isArray(result.data)) {
    if (result?.error) {
      console.error(result.error);
    }
    return <RequirementsLoadError t={t} />;
  }

  return <RequirementsPageLayout requirements={result.data} t={t} />;
}
