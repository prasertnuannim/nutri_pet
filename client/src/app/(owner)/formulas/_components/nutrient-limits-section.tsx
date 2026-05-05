import {
  NUTRIENT_CATEGORY_ORDER,
  type NutrientLimit,
  type Requirement,
} from "@/types/requirement.type";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { NutrientLimitForm } from "./types";

type NutrientLimitsSectionProps = {
  activeLimitId: number | null;
  addForm: NutrientLimitForm;
  editForms: Record<number, NutrientLimitForm>;
  groupedLimits: Array<readonly [string, NutrientLimit[]]>;
  isAddingLimit: boolean;
  isLoadingLimits: boolean;
  limitMessage: string | null;
  limitsError: string | null;
  nutrientLimits: NutrientLimit[];
  selectedRequirement: Requirement | null;
  onAddSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onAddFormChange: (field: keyof NutrientLimitForm, value: string) => void;
  onEditFormChange: (limitId: number, field: keyof NutrientLimitForm, value: string) => void;
  onLimitDelete: (limitId: number) => void;
  onLimitSave: (limitId: number) => void;
};

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  Energy: "formulaSettings.requirementsPage.categories.energy",
  "Proximate Analysis": "formulaSettings.requirementsPage.categories.proximateAnalysis",
  "Amino Acids": "formulaSettings.requirementsPage.categories.aminoAcids",
  "Fatty Acids": "formulaSettings.requirementsPage.categories.fattyAcids",
  Minerals: "formulaSettings.requirementsPage.categories.minerals",
  Vitamins: "formulaSettings.requirementsPage.categories.vitamins",
  Others: "formulaSettings.requirementsPage.categories.others",
};

export function NutrientLimitsSection({
  activeLimitId,
  addForm,
  editForms,
  groupedLimits,
  isAddingLimit,
  isLoadingLimits,
  limitMessage,
  limitsError,
  nutrientLimits,
  selectedRequirement,
  onAddSubmit,
  onAddFormChange,
  onEditFormChange,
  onLimitDelete,
  onLimitSave,
}: NutrientLimitsSectionProps) {
  const { t } = useTranslation();
  const resolveCategoryLabel = (category: string) =>
    t(CATEGORY_LABEL_KEYS[category] ?? "", { defaultValue: category });

  return (
    <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("formulaSettings.requirementsPage.limits.title")}
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-zinc-500">
            {t("formulaSettings.requirementsPage.limits.description")}
          </p>
        </div>
        {selectedRequirement ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            {t("formulaSettings.requirementsPage.limits.summary", {
              id: selectedRequirement.requirement_id,
              count: nutrientLimits.length,
            })}
          </div>
        ) : null}
      </div>

      {selectedRequirement ? (
        <>
          <form
            onSubmit={onAddSubmit}
            className="mt-6 grid gap-4 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-5 lg:grid-cols-[1.1fr_1.4fr_0.8fr_0.8fr_auto]"
          >
            <select
              value={addForm.category}
              onChange={(event) => onAddFormChange("category", event.target.value)}
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
            >
              {NUTRIENT_CATEGORY_ORDER.map((category) => (
                <option key={category} value={category}>
                  {resolveCategoryLabel(category)}
                </option>
              ))}
            </select>
            <input
              value={addForm.nutrient}
              onChange={(event) => onAddFormChange("nutrient", event.target.value)}
              placeholder={t("formulaSettings.requirementsPage.limits.nutrientPlaceholder")}
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
              required
            />
            <input
              value={addForm.min_value}
              onChange={(event) => onAddFormChange("min_value", event.target.value)}
              placeholder={t("formulaSettings.requirementsPage.limits.minPlaceholder")}
              inputMode="decimal"
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
            />
            <input
              value={addForm.max_value}
              onChange={(event) => onAddFormChange("max_value", event.target.value)}
              placeholder={t("formulaSettings.requirementsPage.limits.maxPlaceholder")}
              inputMode="decimal"
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
            />
            <button
              type="submit"
              disabled={isAddingLimit}
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isAddingLimit
                ? t("formulaSettings.requirementsPage.limits.adding")
                : t("formulaSettings.requirementsPage.limits.addButton")}
            </button>
          </form>

          {limitMessage ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {limitMessage}
            </div>
          ) : null}

          {limitsError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {limitsError}
            </div>
          ) : null}

          {isLoadingLimits ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
              {t("formulaSettings.requirementsPage.limits.loading")}
            </div>
          ) : groupedLimits.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
              {t("formulaSettings.requirementsPage.limits.empty")}
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {groupedLimits.map(([category, limits]) => (
                <div key={category} className="overflow-hidden rounded-3xl border border-zinc-200">
                  <div className="border-b border-zinc-200 bg-zinc-100/80 px-5 py-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {resolveCategoryLabel(category)}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200">
                      <thead className="bg-white">
                        <tr className="text-left text-sm font-semibold text-zinc-700">
                          <th className="px-5 py-4">
                            {t("formulaSettings.requirementsPage.limits.table.nutrient")}
                          </th>
                          <th className="px-5 py-4">
                            {t("formulaSettings.requirementsPage.limits.table.min")}
                          </th>
                          <th className="px-5 py-4">
                            {t("formulaSettings.requirementsPage.limits.table.max")}
                          </th>
                          <th className="px-5 py-4">
                            {t("formulaSettings.requirementsPage.limits.table.actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 bg-white">
                        {limits.map((limit) => {
                          const form = editForms[limit.limit_id];
                          const isBusy = activeLimitId === limit.limit_id;

                          if (!form) {
                            return null;
                          }

                          return (
                            <tr key={limit.limit_id} className="align-top text-sm text-zinc-700">
                              <td className="px-5 py-4">
                                <input
                                  value={form.nutrient}
                                  onChange={(event) =>
                                    onEditFormChange(limit.limit_id, "nutrient", event.target.value)
                                  }
                                  className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                                />
                              </td>
                              <td className="px-5 py-4">
                                <input
                                  value={form.min_value}
                                  onChange={(event) =>
                                    onEditFormChange(limit.limit_id, "min_value", event.target.value)
                                  }
                                  inputMode="decimal"
                                  className="w-32 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                                />
                              </td>
                              <td className="px-5 py-4">
                                <input
                                  value={form.max_value}
                                  onChange={(event) =>
                                    onEditFormChange(limit.limit_id, "max_value", event.target.value)
                                  }
                                  inputMode="decimal"
                                  className="w-32 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                                />
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => onLimitSave(limit.limit_id)}
                                    disabled={isBusy}
                                    className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                                  >
                                    {isBusy
                                      ? t("formulaSettings.requirementsPage.limits.saving")
                                      : t("formulaSettings.requirementsPage.limits.saveButton")}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onLimitDelete(limit.limit_id)}
                                    disabled={isBusy}
                                    className="rounded-full border border-red-300 px-4 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                                  >
                                    {t("formulaSettings.requirementsPage.limits.deleteButton")}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
          {t("formulaSettings.requirementsPage.limits.selectRequirement")}
        </div>
      )}
    </section>
  );
}
