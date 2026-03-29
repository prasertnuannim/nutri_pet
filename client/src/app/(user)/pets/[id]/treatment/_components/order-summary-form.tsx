"use client";

import { useFormikContext } from "formik";
import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";
import type { RegisteredPet } from "@/types/pets-register";
import { PatientTreatmentSummary } from "./patient-treatment-summary";
import { getCommercialFormulaById, getHomecookedRecipeById } from "./product-matching-data";
import { type TreatmentFormValues } from "./treatment-form";

type OrderSummaryFormProps = {
  pet: RegisteredPet;
  petAgeLabel: string;
  speciesBreedLabel: string;
};

type OrderItem = {
  id: string;
  title: string;
  meta: string;
  quantity: string;
};

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

function formatCalories(value: number) {
  return `${Math.round(value).toLocaleString()} kcal`;
}

function formatMoney(amount: number) {
  return `฿${amount.toLocaleString()}`;
}

function formatGrams(value: number) {
  return `${value.toFixed(1)} g/day`;
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-primary">
        {value}
      </p>
    </div>
  );
}

function SummarySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <div className="mt-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">
        {label}
      </span>
      <span className="font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

export function OrderSummaryForm({
  pet,
  petAgeLabel,
  speciesBreedLabel,
}: OrderSummaryFormProps) {
  const { t } = useTranslation();
  const formik = useFormikContext<TreatmentFormValues>();

  const diagnosis =
    formik.values.diagnosis === "healthy"
      ? t("petTreatment.diagnosisHealthy")
      : t("petTreatment.diagnosisDisease");
  const currentBcs = parseNumber(formik.values.bodyConditionScore);
  const idealBcs = parseNumber(formik.values.idealBodyConditionScore);
  const idealWeight =
    currentBcs && idealBcs && currentBcs > 0 ? pet.weight * (idealBcs / currentBcs) : pet.weight;
  const rerWeight = formik.values.rerWeightSource === "ideal" ? idealWeight : pet.weight;
  const rerCalories = rerWeight ? 70 * Math.pow(rerWeight, 0.75) : 0;
  const derFactor = parseNumber(formik.values.derFactor);
  const derCalories = derFactor ? rerCalories * derFactor : 0;
  const selectedCommercialFormula = getCommercialFormulaById(formik.values.selectedCommercialFormulaId);
  const selectedHomecookedRecipe = getHomecookedRecipeById(formik.values.selectedHomecookedRecipeId);
  const mealsPerDay = Math.max(parseNumber(formik.values.mealsPerDay) ?? 2, 1);
  const mixedCommercialPercentage = Math.min(
    100,
    Math.max(parseNumber(formik.values.mixedCommercialPercentage) ?? 50, 0),
  );
  const commercialEnergy =
    formik.values.foodType === "mixed" ? (derCalories * mixedCommercialPercentage) / 100 : derCalories;
  const homecookedEnergy =
    formik.values.foodType === "mixed" ? (derCalories * (100 - mixedCommercialPercentage)) / 100 : derCalories;
  const dailyTargetGrams =
    selectedCommercialFormula && commercialEnergy > 0
      ? commercialEnergy / selectedCommercialFormula.kcalDensity
      : 0;

  const orderItems: OrderItem[] = [];

  if (formik.values.foodType === "commercialFeed" && selectedCommercialFormula) {
    orderItems.push({
      id: selectedCommercialFormula.id,
      title: selectedCommercialFormula.name,
      meta: `${selectedCommercialFormula.kcalDensity} ${t("petTreatment.kcalDensity")} · ${mealsPerDay} ${t("petTreatment.mealsPerDay")}`,
      quantity: formatGrams(dailyTargetGrams),
    });
  }

  if (formik.values.foodType === "homecooked" && selectedHomecookedRecipe) {
    orderItems.push({
      id: selectedHomecookedRecipe.id,
      title: selectedHomecookedRecipe.name,
      meta: t("petTreatment.foodTypeHomecooked"),
      quantity: formatCalories(derCalories),
    });
  }

  if (formik.values.foodType === "mixed") {
    if (selectedCommercialFormula) {
      orderItems.push({
        id: `${selectedCommercialFormula.id}-mixed`,
        title: selectedCommercialFormula.name,
        meta: `${t("petTreatment.foodTypeCommercialFeed")} · ${mealsPerDay} ${t("petTreatment.mealsPerDay")}`,
        quantity: formatGrams(dailyTargetGrams),
      });
    }

    if (selectedHomecookedRecipe) {
      orderItems.push({
        id: `${selectedHomecookedRecipe.id}-mixed`,
        title: selectedHomecookedRecipe.name,
        meta: t("petTreatment.foodTypeHomecooked"),
        quantity: formatCalories(homecookedEnergy),
      });
    }
  }

  const logisticsFee = 0;
  const grandTotal = 0;

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
              {t("petTreatment.steps.orderSummary.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("petTreatment.orderSummaryDescription")}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("petTreatment.status")}
            </p>
            <span className="mt-2 inline-flex rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
              {t("petTreatment.pendingConfirmation")}
            </span>
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-muted/10 p-4">
            <SummarySection title={t("petTreatment.basicInformation")}>
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label={t("registerPet.patientName")} value={pet.patientName} />
                <DetailRow label={t("userPets.weight")} value={`${pet.weight} ${t("common.units.kg")}`} />
              </div>
            </SummarySection>

            <Separator className="my-5" />

            <SummarySection title={t("petTreatment.clinicalContext")}>
              <DetailRow label={t("petTreatment.diagnosis")} value={diagnosis} />
            </SummarySection>

            <Separator className="my-5" />

            <SummarySection title={t("petTreatment.nutritionPlan")}>
              <SummaryMetric
                label={t("petTreatment.targetDer")}
                value={formatCalories(derCalories)}
              />
              <SummaryMetric
                label={t("petTreatment.idealWeight")}
                value={formatWeight(idealWeight, t("userPets.notAvailable"))}
              />
            </SummarySection>

            <Separator className="my-5" />

            <SummarySection title={t("petTreatment.logistics")}>
              <div className="rounded-xl border border-border bg-card p-4">
                <DetailRow label={t("petTreatment.deliveryVia")} value={t("petTreatment.pickup")} />
              </div>
            </SummarySection>
          </aside>

          <section className="rounded-2xl border border-border overflow-hidden">
            <div className="border-b border-border px-4 py-4">
              <h3 className="text-xl font-semibold text-foreground">
                {t("petTreatment.orderItems")}
              </h3>
            </div>

            <div className="min-h-[15rem] px-4 py-5">
              {orderItems.length > 0 ? (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                          <ClipboardList className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.meta}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[12rem] rounded-2xl border border-dashed border-border bg-muted/5" />
              )}
            </div>

            <div className="border-t border-border px-4 py-4">
              <div className="flex items-center justify-between gap-4 text-base">
                <span className="text-muted-foreground">
                  {t("petTreatment.logisticsFee")}
                </span>
                <span className="font-semibold text-foreground">
                  {formatMoney(logisticsFee)}
                </span>
              </div>

              <Separator className="my-4" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("petTreatment.grandTotal")}
                </p>
                <p className="mt-1 text-5xl font-semibold tracking-tight text-primary">
                  {formatMoney(grandTotal)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
