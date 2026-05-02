"use client";

import { useFormikContext } from "formik";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RegisteredPet } from "@/types/pets-register.type";
import { PatientTreatmentSummary } from "./patient-treatment-summary";
import { treatmentTextareaClassName, type TreatmentFormValues } from "./treatment-form";

type PersonalizeNutrientFormProps = {
  pet: RegisteredPet;
  petAgeLabel: string;
  speciesBreedLabel: string;
};

function SummaryBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

export function PersonalizeNutrientForm({
  pet,
  petAgeLabel,
  speciesBreedLabel,
}: PersonalizeNutrientFormProps) {
  const { t } = useTranslation();
  const formik = useFormikContext<TreatmentFormValues>();

  const hasSelectedStandard = Boolean(formik.values.aafcoStandard);
  const selectedRequirements = formik.values.nutritionalNeeds.filter((value) => value !== "none");
  const aafcoLabelMap: Record<string, string> = {
    adultMaintenance: t("petTreatment.aafcoAdultMaintenance"),
    growthReproduction: t("petTreatment.aafcoGrowthReproduction"),
    seniorSupport: t("petTreatment.aafcoSeniorSupport"),
    weightManagement: t("petTreatment.aafcoWeightManagement"),
  };
  const needLabelMap: Record<string, string> = {
    loseWeight: t("petTreatment.nutritionNeedLoseWeight"),
    gainWeight: t("petTreatment.nutritionNeedGainWeight"),
  };

  const resetDefaults = () => {
    formik.setFieldValue("proteinTarget", "");
    formik.setFieldValue("fatTarget", "");
    formik.setFieldValue("fiberTarget", "");
    formik.setFieldValue("feedingFrequency", "");
    formik.setFieldValue("supplementPlan", "");
  };

  return (
    <div className="space-y-6">
      <PatientTreatmentSummary
        pet={pet}
        petAgeLabel={petAgeLabel}
        speciesBreedLabel={speciesBreedLabel}
      />

      <div className="space-y-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {t("petTreatment.steps.personalizeNutrientRequirement.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("petTreatment.personalizeNutrientDescription")}
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={resetDefaults}>
            <RotateCcw className="h-4 w-4" />
            {t("petTreatment.resetDefaults")}
          </Button>
        </div>

        {hasSelectedStandard ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryBadge
                label={t("petTreatment.selectedStandard")}
                value={aafcoLabelMap[formik.values.aafcoStandard] ?? t("userPets.notAvailable")}
              />
              <SummaryBadge
                label={t("petTreatment.selectedRequirements")}
                value={
                  selectedRequirements.length > 0
                    ? selectedRequirements.map((value) => needLabelMap[value] ?? value).join(", ")
                    : t("userPets.notAvailable")
                }
              />
              <SummaryBadge
                label={t("petTreatment.additionalNutrientRequirement")}
                value={formik.values.additionalNutrientRequirement || t("userPets.notAvailable")}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="proteinTarget">
                  {t("petTreatment.proteinTarget")}
                </Label>
                <Input
                  id="proteinTarget"
                  placeholder={t("petTreatment.proteinTargetPlaceholder")}
                  {...formik.getFieldProps("proteinTarget")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatTarget">
                  {t("petTreatment.fatTarget")}
                </Label>
                <Input
                  id="fatTarget"
                  placeholder={t("petTreatment.fatTargetPlaceholder")}
                  {...formik.getFieldProps("fatTarget")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiberTarget">
                  {t("petTreatment.fiberTarget")}
                </Label>
                <Input
                  id="fiberTarget"
                  placeholder={t("petTreatment.fiberTargetPlaceholder")}
                  {...formik.getFieldProps("fiberTarget")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedingFrequency">
                  {t("petTreatment.feedingFrequency")}
                </Label>
                <Input
                  id="feedingFrequency"
                  placeholder={t("petTreatment.feedingFrequencyPlaceholder")}
                  {...formik.getFieldProps("feedingFrequency")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplementPlan">
                {t("petTreatment.supplementPlan")}
              </Label>
              <textarea
                id="supplementPlan"
                rows={5}
                placeholder={t("petTreatment.supplementPlanPlaceholder")}
                className={cn(treatmentTextareaClassName, "min-h-32")}
                {...formik.getFieldProps("supplementPlan")}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/10 px-6 py-20 text-center">
            <p className="text-xl font-medium text-muted-foreground">
              {t("petTreatment.noNutrientDataTitle")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("petTreatment.noNutrientDataDescription")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
