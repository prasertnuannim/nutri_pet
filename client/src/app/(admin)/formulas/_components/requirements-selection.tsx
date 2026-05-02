import type { Requirement } from "@/types/requirement.type";
import { useTranslation } from "react-i18next";

type RequirementsSelectionProps = {
  filteredRequirements: Requirement[];
  selectedId: number | null;
  selectedRequirement: Requirement | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectChange: (value: number | null) => void;
};

export function RequirementsSelection({
  filteredRequirements,
  selectedId,
  selectedRequirement,
  search,
  onSearchChange,
  onSelectChange,
}: RequirementsSelectionProps) {
  const { t } = useTranslation();

  return (
    <section className="sticky top-4 z-20 mb-6 overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/92 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="shrink-0">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            {t("formulaSettings.requirementsPage.selection.eyebrow")}
          </p>
          <h2 className="mt-2 text-[2rem] font-semibold tracking-tight text-zinc-950">
            {t("formulaSettings.requirementsPage.selection.title")}
          </h2>
        </div>

        <div className="grid w-full gap-4 xl:max-w-5xl xl:grid-cols-[0.85fr_1.65fr]">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("formulaSettings.requirementsPage.selection.searchPlaceholder")}
            className="w-full rounded-full border border-zinc-300 bg-zinc-50/80 px-5 py-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white"
          />

          <select
            value={selectedId ?? ""}
            onChange={(event) => {
              const nextId = Number(event.target.value);
              onSelectChange(Number.isNaN(nextId) ? null : nextId);
            }}
            className="w-full rounded-full border border-zinc-300 bg-white px-5 py-4 text-base font-medium text-zinc-950 outline-none transition focus:border-zinc-500"
          >
            {filteredRequirements.length === 0 ? (
              <option value="">
                {t("formulaSettings.requirementsPage.selection.emptySearch")}
              </option>
            ) : (
              filteredRequirements.map((requirement) => (
                <option key={requirement.requirement_id} value={requirement.requirement_id}>
                  #{requirement.requirement_id} • {requirement.type} • {requirement.species} •{" "}
                  {requirement.requirement_name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {selectedRequirement ? (
        <div className="relative mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
          <span className="rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white">
            #{selectedRequirement.requirement_id}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
            {selectedRequirement.type}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
            {selectedRequirement.species}
          </span>
          <span className="min-w-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-700">
            {selectedRequirement.requirement_name}
          </span>
        </div>
      ) : null}
    </section>
  );
}
