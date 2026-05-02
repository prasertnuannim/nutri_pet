"use client";

import { useFormikContext } from "formik";
import { Check, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { RegisteredPet } from "@/types/pets-register.type";
import { PatientTreatmentSummary } from "./patient-treatment-summary";
import { type TreatmentFormValues } from "./treatment-form";

type NutritionRequirementFormProps = {
  pet: RegisteredPet;
  petAgeLabel: string;
  speciesBreedLabel: string;
};

type ChoiceOption = {
  label: string;
  value: string;
};

type MultiValueField = "nutritionalNeeds" | "foodAllergies" | "foodAvoidances";
type ListValueField = "currentRegularFoods" | "snackTreats";

const readonlyInputClassName =
  "h-10 w-full rounded-xl border border-input bg-muted/35 px-3 text-sm text-muted-foreground outline-none";

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatWeight(weight: number | null, fallback: string) {
  if (weight === null || Number.isNaN(weight)) {
    return fallback;
  }

  return `${weight.toFixed(1)} kg`;
}

function formatCalories(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return null;
  }

  return Math.round(value).toLocaleString();
}

function SelectionChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-9 rounded-xl border-border px-4 text-sm font-medium text-muted-foreground",
        active && "border-primary/25 bg-primary-soft text-primary hover:bg-primary-soft",
      )}
      onClick={onClick}
    >
      {active ? <Check className="h-4 w-4" /> : null}
      {label}
    </Button>
  );
}

function AddableList({
  addLabel,
  items,
  label,
  onAdd,
  onChange,
  onRemove,
}: {
  addLabel: string;
  items: string[];
  label: string;
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <Button type="button" variant="link" className="h-auto px-0 py-0" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={`${label}-${index + 1}`} className="flex items-center gap-2">
              <Input value={item} onChange={(event) => onChange(index, event.target.value)} />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(index)}
                aria-label={`${label} ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function NutritionRequirementForm({
  pet,
  petAgeLabel,
  speciesBreedLabel,
}: NutritionRequirementFormProps) {
  const { t } = useTranslation();
  const formik = useFormikContext<TreatmentFormValues>();

  const nutritionalNeedOptions: ChoiceOption[] = [
    { value: "none", label: t("petTreatment.nutritionNeedNone") },
    { value: "loseWeight", label: t("petTreatment.nutritionNeedLoseWeight") },
    { value: "gainWeight", label: t("petTreatment.nutritionNeedGainWeight") },
  ];
  const dietRestrictionOptions: ChoiceOption[] = [
    { value: "none", label: t("petTreatment.none") },
    { value: "pork", label: t("petTreatment.proteinPork") },
    { value: "beef", label: t("petTreatment.proteinBeef") },
    { value: "chicken", label: t("petTreatment.proteinChicken") },
    { value: "fish", label: t("petTreatment.proteinFish") },
    { value: "duck", label: t("petTreatment.proteinDuck") },
    { value: "sheep", label: t("petTreatment.proteinSheep") },
  ];

  const toggleMultiSelect = (field: MultiValueField, value: string) => {
    const currentValues = formik.values[field];

    if (value === "none") {
      formik.setFieldValue(field, currentValues.includes("none") ? [] : ["none"]);
      return;
    }

    const withoutNone = currentValues.filter((item) => item !== "none");
    const nextValues = withoutNone.includes(value)
      ? withoutNone.filter((item) => item !== value)
      : [...withoutNone, value];

    formik.setFieldValue(field, nextValues.length > 0 ? nextValues : ["none"]);
  };

  const updateListField = (field: ListValueField, index: number, value: string) => {
    const nextItems = [...formik.values[field]];
    nextItems[index] = value;
    formik.setFieldValue(field, nextItems);
  };

  const addListFieldItem = (field: ListValueField) => {
    formik.setFieldValue(field, [...formik.values[field], ""]);
  };

  const removeListFieldItem = (field: ListValueField, index: number) => {
    formik.setFieldValue(
      field,
      formik.values[field].filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const currentBcs = parseNumber(formik.values.bodyConditionScore);
  const idealBcs = parseNumber(formik.values.idealBodyConditionScore);
  const currentWeight = pet.weight;
  const estimatedIdealWeight =
    currentBcs && idealBcs && currentBcs > 0 ? currentWeight * (idealBcs / currentBcs) : null;
  const rerWeight =
    formik.values.rerWeightSource === "ideal" ? estimatedIdealWeight : currentWeight;
  const rerCalories = rerWeight ? 70 * Math.pow(rerWeight, 0.75) : null;
  const derFactor = parseNumber(formik.values.derFactor);
  const derCalories = rerCalories && derFactor ? rerCalories * derFactor : null;

  return (
    <div className="space-y-6">
      <PatientTreatmentSummary
        pet={pet}
        petAgeLabel={petAgeLabel}
        speciesBreedLabel={speciesBreedLabel}
      />

      <div className="space-y-8 p-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {t("petTreatment.nutrientRequirementTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("petTreatment.nutritionRequirementDescription")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <Label>{t("petTreatment.crossSectionMethod")}</Label>
            <div className="space-y-3">
              {[
                { label: t("petTreatment.crossSectionMethodMinMostFit"), value: "minMostFit" },
                { label: t("petTreatment.crossSectionMethodMinLowest"), value: "minLowest" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 text-sm text-foreground">
                  <input
                    type="radio"
                    name="crossSectionMethod"
                    value={option.value}
                    checked={formik.values.crossSectionMethod === option.value}
                    onChange={() => formik.setFieldValue("crossSectionMethod", option.value)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t("petTreatment.aafcoNutrientRequirement")}</Label>
            <Select
              value={formik.values.aafcoStandard}
              onValueChange={(value) => formik.setFieldValue("aafcoStandard", value)}
            >
              <SelectTrigger className="h-10 w-full rounded-xl px-3 text-sm">
                <SelectValue placeholder={t("petTreatment.selectStandardPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adultMaintenance">
                  {t("petTreatment.aafcoAdultMaintenance")}
                </SelectItem>
                <SelectItem value="growthReproduction">
                  {t("petTreatment.aafcoGrowthReproduction")}
                </SelectItem>
                <SelectItem value="seniorSupport">
                  {t("petTreatment.aafcoSeniorSupport")}
                </SelectItem>
                <SelectItem value="weightManagement">
                  {t("petTreatment.aafcoWeightManagement")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalNutrientRequirement">
            {t("petTreatment.additionalNutrientRequirement")}
          </Label>
          <Input
            id="additionalNutrientRequirement"
            placeholder={t("petTreatment.additionalNutrientRequirementPlaceholder")}
            {...formik.getFieldProps("additionalNutrientRequirement")}
          />
        </div>

        <div className="space-y-3">
          <Label>{t("petTreatment.nutritionalNeeds")}</Label>
          <div className="flex flex-wrap gap-2">
            {nutritionalNeedOptions.map((option) => (
              <SelectionChip
                key={option.value}
                active={formik.values.nutritionalNeeds.includes(option.value)}
                label={option.label}
                onClick={() => toggleMultiSelect("nutritionalNeeds", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>{t("petTreatment.stomachSize")}</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "20", label: "20 ml/kg" },
              { value: "30", label: "30 ml/kg" },
              { value: "40", label: "40 ml/kg" },
              { value: "custom", label: t("petTreatment.stomachSizeCustom") },
            ].map((option) => (
              <SelectionChip
                key={option.value}
                active={formik.values.stomachSizePreset === option.value}
                label={option.label}
                onClick={() => formik.setFieldValue("stomachSizePreset", option.value)}
              />
            ))}
          </div>
          {formik.values.stomachSizePreset === "custom" ? (
            <Input
              className="max-w-xs"
              placeholder={t("petTreatment.stomachSizeCustomPlaceholder")}
              {...formik.getFieldProps("stomachSizeCustom")}
            />
          ) : null}
        </div>

        <Separator />

        <div>
          <h3 className="text-2xl font-semibold text-foreground">
            {t("petTreatment.dietaryHistoryTitle")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("petTreatment.dietaryHistoryDescription")}
          </p>
        </div>

        <div className="space-y-3">
          <Label>{t("petTreatment.foodAllergies")}</Label>
          <div className="flex flex-wrap gap-2">
            {dietRestrictionOptions.map((option) => (
              <SelectionChip
                key={`allergy-${option.value}`}
                active={formik.values.foodAllergies.includes(option.value)}
                label={option.label}
                onClick={() => toggleMultiSelect("foodAllergies", option.value)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>{t("petTreatment.foodAvoidances")}</Label>
          <div className="flex flex-wrap gap-2">
            {dietRestrictionOptions.map((option) => (
              <SelectionChip
                key={`avoid-${option.value}`}
                active={formik.values.foodAvoidances.includes(option.value)}
                label={option.label}
                onClick={() => toggleMultiSelect("foodAvoidances", option.value)}
              />
            ))}
          </div>
        </div>

        <AddableList
          addLabel={t("petTreatment.addItem")}
          items={formik.values.currentRegularFoods}
          label={t("petTreatment.currentRegularFood")}
          onAdd={() => addListFieldItem("currentRegularFoods")}
          onChange={(index, value) => updateListField("currentRegularFoods", index, value)}
          onRemove={(index) => removeListFieldItem("currentRegularFoods", index)}
        />

        <AddableList
          addLabel={t("petTreatment.addItem")}
          items={formik.values.snackTreats}
          label={t("petTreatment.snacksTreats")}
          onAdd={() => addListFieldItem("snackTreats")}
          onChange={(index, value) => updateListField("snackTreats", index, value)}
          onRemove={(index) => removeListFieldItem("snackTreats", index)}
        />

        <Separator />

        <div>
          <h3 className="text-2xl font-semibold text-foreground">
            {t("petTreatment.energyCalculatorTitle")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("petTreatment.energyCalculatorDescription")}
          </p>
        </div>

        <div className="rounded-2xl border border-border">
          <div className="grid gap-0 xl:grid-cols-2">
            <div className="space-y-4 p-4 xl:border-r xl:border-border">
              <div className="space-y-2">
                <Label htmlFor="idealBodyConditionScore">
                  {t("petTreatment.idealBcs")}
                </Label>
                <Input
                  id="idealBodyConditionScore"
                  placeholder={t("petTreatment.idealBcsPlaceholder")}
                  {...formik.getFieldProps("idealBodyConditionScore")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("petTreatment.currentBcs")}:{" "}
                  {formik.values.bodyConditionScore || t("userPets.notAvailable")}
                </p>
              </div>

              <div className="space-y-3">
                <Label>{t("petTreatment.weightForRer")}</Label>
                <div className="grid gap-2">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                      formik.values.rerWeightSource === "current"
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                    onClick={() => formik.setFieldValue("rerWeightSource", "current")}
                  >
                    <span>{t("petTreatment.weightForRerCurrent")}</span>
                    <span>{formatWeight(currentWeight, t("petTreatment.notSet"))}</span>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                      formik.values.rerWeightSource === "ideal"
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                    onClick={() => formik.setFieldValue("rerWeightSource", "ideal")}
                  >
                    <span>{t("petTreatment.weightForRerIdeal")}</span>
                    <span>{formatWeight(estimatedIdealWeight, t("petTreatment.notSet"))}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="derFactor">
                  {t("petTreatment.factorDer")}
                </Label>
                <Input
                  id="derFactor"
                  placeholder={t("petTreatment.factorDerPlaceholder")}
                  {...formik.getFieldProps("derFactor")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("petTreatment.factorDerHint")}
                </p>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="idealWeightDisplay">
                  {t("petTreatment.idealWeight")}
                </Label>
                <input
                  id="idealWeightDisplay"
                  readOnly
                  value={estimatedIdealWeight ? estimatedIdealWeight.toFixed(1) : ""}
                  placeholder={t("petTreatment.idealWeightPlaceholder")}
                  className={readonlyInputClassName}
                />
                <p className="text-xs text-muted-foreground">
                  {t("petTreatment.idealWeightAutoCalculated", {
                    weight: formatWeight(currentWeight, t("petTreatment.notSet")),
                  })}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("petTreatment.rerTitle")}
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-primary">
                  {formatCalories(rerCalories) ?? t("userPets.notAvailable")}
                  <span className="ml-2 text-base font-medium text-muted-foreground">
                    {t("petTreatment.kcalPerDay")}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("petTreatment.rerDescription")}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("petTreatment.derTitle")}
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-primary">
                  {formatCalories(derCalories) ?? t("petTreatment.derPlaceholder")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("petTreatment.derDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
