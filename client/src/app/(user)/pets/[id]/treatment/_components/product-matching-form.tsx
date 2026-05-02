"use client";

import { useFormikContext } from "formik";
import { Check, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
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
import {
  commercialFormulaOptions,
  getCommercialFormulaById,
  getHomecookedRecipeById,
  homecookedRecipeOptions,
  type ProductFoodType,
  type RecipeCategory,
} from "./product-matching-data";
import { type TreatmentFormValues } from "./treatment-form";

type ProductMatchingFormProps = {
  pet: RegisteredPet;
  petAgeLabel: string;
  speciesBreedLabel: string;
};

function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCalories(value: number) {
  return Math.round(value).toLocaleString();
}

function formatGrams(value: number) {
  return value.toFixed(1);
}

function MatchBadge({ match }: { match: number }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        match >= 90 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
      )}
    >
      {match}% MATCH
    </span>
  );
}

function RecipeSelector({
  activeCategory,
  onCategoryChange,
  onSelectRecipe,
  selectedRecipeId,
  title,
}: {
  activeCategory: RecipeCategory;
  onCategoryChange: (category: RecipeCategory) => void;
  onSelectRecipe: (id: string) => void;
  selectedRecipeId: string;
  title: string;
}) {
  const { t } = useTranslation();

  const recipeTabs: Array<{ key: RecipeCategory; label: string }> = [
    { key: "all", label: t("petTreatment.recipeCategoryAll") },
    { key: "chicken", label: t("petTreatment.recipeCategoryChicken") },
    { key: "beef", label: t("petTreatment.recipeCategoryBeef") },
    { key: "fish", label: t("petTreatment.recipeCategoryFish") },
  ];
  const filteredRecipes =
    activeCategory === "all"
      ? homecookedRecipeOptions
      : homecookedRecipeOptions.filter((recipe) => recipe.category === activeCategory);

  return (
    <div className="rounded-2xl border border-border p-4">
      <h3 className="text-xl font-semibold text-foreground">
        {title}
      </h3>

      <div className="mt-4 flex gap-1 border-b border-border">
        {recipeTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onCategoryChange(tab.key)}
            className={cn(
              "rounded-t-xl border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors",
              activeCategory === tab.key
                ? "border-border border-b-card bg-card text-primary"
                : "hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        {filteredRecipes.map((recipe) => {
          const selected = recipe.id === selectedRecipeId;

          return (
            <button
              key={recipe.id}
              type="button"
              onClick={() => onSelectRecipe(recipe.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border px-4 py-5 text-left transition-colors",
                selected
                  ? "border-primary bg-primary-soft/40"
                  : "border-border hover:bg-muted/20",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 bg-background",
                )}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : null}
              </span>

              <div>
                <p className="text-lg font-semibold text-foreground">
                  {recipe.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("petTreatment.match")}:
                  <span className="ml-1 font-semibold text-orange-500">
                    {recipe.match}%
                  </span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProductMatchingForm({
  pet,
  petAgeLabel,
  speciesBreedLabel,
}: ProductMatchingFormProps) {
  const { t } = useTranslation();
  const formik = useFormikContext<TreatmentFormValues>();

  const currentBcs = parseNumber(formik.values.bodyConditionScore);
  const idealBcs = parseNumber(formik.values.idealBodyConditionScore);
  const idealWeight =
    currentBcs && idealBcs && currentBcs > 0 ? pet.weight * (idealBcs / currentBcs) : null;
  const rerWeight = formik.values.rerWeightSource === "ideal" ? idealWeight : pet.weight;
  const rerCalories = rerWeight ? 70 * Math.pow(rerWeight, 0.75) : 0;
  const derFactor = parseNumber(formik.values.derFactor);
  const totalEnergy = derFactor ? rerCalories * derFactor : 0;
  const mealsPerDay = Math.max(parseNumber(formik.values.mealsPerDay) ?? 2, 1);
  const foodType = formik.values.foodType as ProductFoodType;
  const selectedCommercialFormula = getCommercialFormulaById(formik.values.selectedCommercialFormulaId);
  const selectedHomecookedRecipe = getHomecookedRecipeById(formik.values.selectedHomecookedRecipeId);
  const mixedCommercialPercentage = Math.min(
    100,
    Math.max(parseNumber(formik.values.mixedCommercialPercentage) ?? 50, 0),
  );
  const commercialEnergy =
    foodType === "mixed" ? (totalEnergy * mixedCommercialPercentage) / 100 : totalEnergy;
  const homecookedEnergy =
    foodType === "mixed" ? (totalEnergy * (100 - mixedCommercialPercentage)) / 100 : totalEnergy;
  const dailyTargetGrams =
    selectedCommercialFormula && commercialEnergy > 0
      ? commercialEnergy / selectedCommercialFormula.kcalDensity
      : 0;
  const perMealGrams = mealsPerDay > 0 ? dailyTargetGrams / mealsPerDay : 0;

  const updateMealsPerDay = (nextValue: number) => {
    formik.setFieldValue("mealsPerDay", String(Math.min(6, Math.max(1, nextValue))));
  };

  const recipeSection = (
    <RecipeSelector
      title={
        foodType === "mixed"
          ? t("petTreatment.selectFormulaForHomecookedPortion")
          : t("petTreatment.selectRecipeFormula")
      }
      activeCategory={formik.values.recipeFormulaCategory}
      onCategoryChange={(category) => formik.setFieldValue("recipeFormulaCategory", category)}
      selectedRecipeId={formik.values.selectedHomecookedRecipeId}
      onSelectRecipe={(id) => formik.setFieldValue("selectedHomecookedRecipeId", id)}
    />
  );

  return (
    <div className="space-y-6">
      <PatientTreatmentSummary
        pet={pet}
        petAgeLabel={petAgeLabel}
        speciesBreedLabel={speciesBreedLabel}
      />

      <div className="space-y-6 p-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {t("petTreatment.steps.productMatching.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("petTreatment.productMatchingDescription")}
          </p>
        </div>

        <div className="space-y-2">
          <Label>{t("petTreatment.foodType")}</Label>
          <Select
            value={formik.values.foodType || undefined}
            onValueChange={(value) => formik.setFieldValue("foodType", value)}
          >
            <SelectTrigger className="h-10 w-full rounded-xl px-3 text-sm">
              <SelectValue placeholder={t("petTreatment.foodTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homecooked">
                {t("petTreatment.foodTypeHomecooked")}
              </SelectItem>
              <SelectItem value="commercialFeed">
                {t("petTreatment.foodTypeCommercialFeed")}
              </SelectItem>
              <SelectItem value="mixed">
                {t("petTreatment.foodTypeMixed")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {foodType === "homecooked" ? recipeSection : null}

        {foodType === "commercialFeed" ? (
          <div className="rounded-2xl border border-border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t("petTreatment.commercialFeedSelection")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("petTreatment.commercialFeedSelectionDescription")}
                </p>
              </div>

              <div className="inline-flex items-center gap-3 rounded-xl border border-border px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("petTreatment.mealsPerDay")}
                </span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => updateMealsPerDay(mealsPerDay - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-4 text-center text-lg font-semibold text-primary">
                  {mealsPerDay}
                </span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => updateMealsPerDay(mealsPerDay + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 max-h-[22rem] space-y-4 overflow-y-auto pr-2">
              {commercialFormulaOptions.map((formula) => {
                const selected = formula.id === formik.values.selectedCommercialFormulaId;

                return (
                  <button
                    key={formula.id}
                    type="button"
                    onClick={() => formik.setFieldValue("selectedCommercialFormulaId", formula.id)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary-soft/40"
                        : "border-border hover:bg-muted/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <span
                          className={cn(
                            "mt-1 h-5 w-5 rounded-full border",
                            selected ? "border-primary bg-primary" : "border-muted-foreground/40",
                          )}
                        />
                        <div>
                          <p className="text-xl font-semibold text-foreground">
                            {formula.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formula.kcalDensity} {t("petTreatment.kcalDensity")}
                          </p>
                        </div>
                      </div>
                      <MatchBadge match={formula.match} />
                    </div>

                    {selected ? (
                      <>
                        <Separator className="my-4" />
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                              {t("petTreatment.dailyTarget")}
                            </p>
                            <p className="mt-2 text-4xl font-semibold text-primary">
                              {formatGrams(dailyTargetGrams)}
                              <span className="ml-1 text-base font-medium text-muted-foreground">
                                g/day
                              </span>
                            </p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                              {t("petTreatment.perMeal")} ({mealsPerDay})
                            </p>
                            <p className="mt-2 text-4xl font-semibold text-primary">
                              {formatGrams(perMealGrams)}
                              <span className="ml-1 text-base font-medium text-muted-foreground">
                                g/meal
                              </span>
                            </p>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {foodType === "mixed" ? (
          <div className="rounded-2xl border border-border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t("petTreatment.mixedFeedingPlan")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("petTreatment.mixedFeedingPlanDescription")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("petTreatment.totalEnergy")}
                </p>
                <p className="mt-1 text-3xl font-semibold text-emerald-700">
                  {formatCalories(totalEnergy)} kcal
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-muted/10 p-5">
              <Label>{t("petTreatment.adjustSplitPercentage")}</Label>

              <div className="mt-5 flex items-center justify-between text-sm font-semibold">
                <span className="text-primary">
                  {t("petTreatment.commercialPortion")}: {mixedCommercialPercentage}%
                </span>
                <span className="text-orange-500">
                  {t("petTreatment.homecookedPortion")}: {100 - mixedCommercialPercentage}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={mixedCommercialPercentage}
                onChange={(event) =>
                  formik.setFieldValue("mixedCommercialPercentage", event.target.value)
                }
                className="mt-4 h-2 w-full cursor-pointer accent-primary"
              />

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-primary/20 bg-primary-soft/35 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                      {t("petTreatment.commercialPortion")}
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <span>{t("petTreatment.mealsPerDay")}</span>
                      <span className="text-lg text-primary">
                        {mealsPerDay}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {commercialFormulaOptions.slice(0, 2).map((formula) => (
                      <div key={formula.id} className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue("selectedCommercialFormulaId", formula.id)}
                          className={cn(
                            "text-left text-sm font-semibold text-foreground transition-colors hover:text-primary",
                            formik.values.selectedCommercialFormulaId === formula.id && "text-primary",
                          )}
                        >
                          {formula.name}
                        </button>
                        <span className="text-sm font-semibold text-emerald-700">
                          {formula.match}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                    {t("petTreatment.homecookedPortion")}
                  </p>
                  <div className="mt-5 rounded-xl border border-dashed border-orange-200 bg-card/70 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("petTreatment.targetEnergy")}
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-foreground">
                      {formatCalories(homecookedEnergy)} kcal
                    </p>
                  </div>
                  {selectedHomecookedRecipe ? (
                    <p className="mt-4 text-sm font-medium text-foreground">
                      {selectedHomecookedRecipe.name}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm font-medium text-orange-500">
                    {t("petTreatment.selectRecipeFormulaBelow")}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {recipeSection}
          </div>
        ) : null}
      </div>
    </div>
  );
}
