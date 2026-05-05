"use client";

import { startTransition, useDeferredValue, useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  createNutrientLimitAction,
  deleteNutrientLimitAction,
  getNutrientLimitsAction,
  updateNutrientLimitAction,
} from "../actions";
import {
  NUTRIENT_CATEGORY_ORDER,
  type NutrientLimit,
  type Requirement,
} from "@/types/requirement.type";
import { NutrientLimitsSection } from "./nutrient-limits-section";
import { RequirementsSelection } from "./requirements-selection";
import { type NutrientLimitForm, toLimitForm } from "./types";

type RequirementsClientProps = {
  initialRequirements: Requirement[];
};

function toPayloadNumber(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export function RequirementsClient({
  initialRequirements,
}: RequirementsClientProps) {
  const { t } = useTranslation();
  const [requirements] = useState(initialRequirements);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialRequirements[0]?.requirement_id ?? null
  );
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const [nutrientLimits, setNutrientLimits] = useState<NutrientLimit[]>([]);
  const [isLoadingLimits, setIsLoadingLimits] = useState(false);
  const [limitsError, setLimitsError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<NutrientLimitForm>(toLimitForm());
  const [isAddingLimit, setIsAddingLimit] = useState(false);
  const [activeLimitId, setActiveLimitId] = useState<number | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [editForms, setEditForms] = useState<Record<number, NutrientLimitForm>>({});

  const selectedRequirement =
    requirements.find((requirement) => requirement.requirement_id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedRequirement) {
      setNutrientLimits([]);
      setEditForms({});
      return;
    }

    const requirementId = selectedRequirement.requirement_id;
    let cancelled = false;

    async function loadLimits() {
      setIsLoadingLimits(true);
      setLimitsError(null);

      try {
        const result = await getNutrientLimitsAction({
          requirementId,
        });

        if (!result?.success) {
          throw new Error(
            result?.error || t("formulaSettings.requirementsPage.feedback.fetchFailed")
          );
        }

        if (cancelled) {
          return;
        }

        const limits = Array.isArray(result.data) ? result.data : [];
        setNutrientLimits(limits);
        setEditForms(
          Object.fromEntries(limits.map((limit) => [limit.limit_id, toLimitForm(limit)]))
        );
      } catch (loadError) {
        if (!cancelled) {
          setNutrientLimits([]);
          setEditForms({});
          setLimitsError(
            loadError instanceof Error
              ? loadError.message
              : t("formulaSettings.requirementsPage.feedback.fetchFailed")
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingLimits(false);
        }
      }
    }

    loadLimits();

    return () => {
      cancelled = true;
    };
  }, [selectedRequirement]);

  const filteredRequirements = [...requirements]
    .sort((left, right) => left.requirement_id - right.requirement_id)
    .filter((requirement) => {
      const keyword = deferredSearch.trim().toLowerCase();

      if (!keyword) {
        return true;
      }

      return [
        requirement.requirement_id.toString(),
        requirement.species,
        requirement.type,
        requirement.requirement_name,
      ].some((value) => value.toLowerCase().includes(keyword));
    });

  const groups = new Map<string, NutrientLimit[]>();

  for (const limit of nutrientLimits) {
    const current = groups.get(limit.category) ?? [];
    current.push(limit);
    groups.set(limit.category, current);
  }

  const groupedLimits = [
    ...NUTRIENT_CATEGORY_ORDER.map((category) => [category, groups.get(category) ?? []] as const),
    ...Array.from(groups.entries()).filter(
      ([category]) =>
        !NUTRIENT_CATEGORY_ORDER.includes(category as (typeof NUTRIENT_CATEGORY_ORDER)[number])
    ),
  ].filter(([, limits]) => limits.length > 0);

  async function handleAddLimit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRequirement) {
      return;
    }

    setIsAddingLimit(true);
    setLimitsError(null);
    setLimitMessage(null);

    try {
      const result = await createNutrientLimitAction(
        {
          requirementId: selectedRequirement.requirement_id,
        },
        {
          category: addForm.category,
          nutrient: addForm.nutrient,
          min_value: toPayloadNumber(addForm.min_value),
          max_value: toPayloadNumber(addForm.max_value),
        }
      );

      if (!result?.success || !result.data) {
        throw new Error(
          result?.error || t("formulaSettings.requirementsPage.feedback.createFailed")
        );
      }

      const created = result.data as NutrientLimit;

      startTransition(() => {
        setNutrientLimits((current) => [...current, created]);
        setEditForms((current) => ({ ...current, [created.limit_id]: toLimitForm(created) }));
      });

      setAddForm((current) => ({
        ...toLimitForm(),
        category: current.category,
      }));
      setLimitMessage(
        t("formulaSettings.requirementsPage.feedback.createSuccess", {
          nutrient: created.nutrient,
        })
      );
    } catch (addError) {
      setLimitsError(
        addError instanceof Error
          ? addError.message
          : t("formulaSettings.requirementsPage.feedback.createFailed")
      );
    } finally {
      setIsAddingLimit(false);
    }
  }

  async function handleLimitSave(limitId: number) {
    if (!selectedRequirement) {
      return;
    }

    const form = editForms[limitId];

    if (!form) {
      return;
    }

    setActiveLimitId(limitId);
    setLimitsError(null);
    setLimitMessage(null);

    try {
      const result = await updateNutrientLimitAction(
        {
          requirementId: selectedRequirement.requirement_id,
          limitId,
        },
        {
          category: form.category,
          nutrient: form.nutrient,
          min_value: toPayloadNumber(form.min_value),
          max_value: toPayloadNumber(form.max_value),
        }
      );

      if (!result?.success || !result.data) {
        throw new Error(
          result?.error || t("formulaSettings.requirementsPage.feedback.updateFailed")
        );
      }

      const updated = result.data as NutrientLimit;

      startTransition(() => {
        setNutrientLimits((current) =>
          current.map((limit) => (limit.limit_id === updated.limit_id ? updated : limit))
        );
        setEditForms((current) => ({ ...current, [updated.limit_id]: toLimitForm(updated) }));
      });

      setLimitMessage(
        t("formulaSettings.requirementsPage.feedback.updateSuccess", {
          nutrient: updated.nutrient,
        })
      );
    } catch (saveError) {
      setLimitsError(
        saveError instanceof Error
          ? saveError.message
          : t("formulaSettings.requirementsPage.feedback.updateFailed")
      );
    } finally {
      setActiveLimitId(null);
    }
  }

  async function handleLimitDelete(limitId: number) {
    if (!selectedRequirement) {
      return;
    }

    setActiveLimitId(limitId);
    setLimitsError(null);
    setLimitMessage(null);

    try {
      const result = await deleteNutrientLimitAction({
        requirementId: selectedRequirement.requirement_id,
        limitId,
      });

      if (!result?.success) {
        throw new Error(
          result?.error || t("formulaSettings.requirementsPage.feedback.deleteFailed")
        );
      }

      startTransition(() => {
        setNutrientLimits((current) => current.filter((limit) => limit.limit_id !== limitId));
        setEditForms((current) => {
          const next = { ...current };
          delete next[limitId];
          return next;
        });
      });

      setLimitMessage(
        t("formulaSettings.requirementsPage.feedback.deleteSuccess", {
          id: limitId,
        })
      );
    } catch (deleteError) {
      setLimitsError(
        deleteError instanceof Error
          ? deleteError.message
          : t("formulaSettings.requirementsPage.feedback.deleteFailed")
      );
    } finally {
      setActiveLimitId(null);
    }
  }

  return (
    <>
      <RequirementsSelection
        filteredRequirements={filteredRequirements}
        selectedId={selectedId}
        selectedRequirement={selectedRequirement}
        search={search}
        onSearchChange={setSearch}
        onSelectChange={(nextId) => {
          setSelectedId(nextId);
          setLimitsError(null);
          setLimitMessage(null);
        }}
      />

      <NutrientLimitsSection
        activeLimitId={activeLimitId}
        addForm={addForm}
        editForms={editForms}
        groupedLimits={groupedLimits}
        isAddingLimit={isAddingLimit}
        isLoadingLimits={isLoadingLimits}
        limitMessage={limitMessage}
        limitsError={limitsError}
        nutrientLimits={nutrientLimits}
        selectedRequirement={selectedRequirement}
        onAddSubmit={handleAddLimit}
        onAddFormChange={(field, value) =>
          setAddForm((current) => ({ ...current, [field]: value }))
        }
        onEditFormChange={(limitId, field, value) =>
          setEditForms((current) => {
            const form = current[limitId] ?? toLimitForm();
            return {
              ...current,
              [limitId]: {
                ...form,
                [field]: value,
              },
            };
          })
        }
        onLimitDelete={handleLimitDelete}
        onLimitSave={handleLimitSave}
      />
    </>
  );
}
