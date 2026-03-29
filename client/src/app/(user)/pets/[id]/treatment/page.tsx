"use client";

import Link from "next/link";
import { type ComponentType, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Form, Formik } from "formik";
import {
  ArrowLeft,
  Calculator,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ShoppingCart,
  Save,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import FormAlert from "@/components/form/formAlert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RegisteredPet } from "@/types/pets-register";
import { getPetByIdAction } from "../../actions";
import { NutritionRequirementForm } from "./_components/nutrition-requirement-form";
import { OrderSummaryForm } from "./_components/order-summary-form";
import { PersonalizeNutrientForm } from "./_components/personalize-nutrient-form";
import { PhysicalExaminationForm } from "./_components/physical-examination-form";
import { ProductMatchingForm } from "./_components/product-matching-form";
import { initialTreatmentValues, type TreatmentFormValues } from "./_components/treatment-form";

type TreatmentStepKey =
  | "physicalExamination"
  | "nutritionRequirement"
  | "personalizeNutrientRequirement"
  | "productMatching"
  | "orderSummary";

type TreatmentStep = {
  key: TreatmentStepKey;
  icon: ComponentType<{ className?: string }>;
  titleKey: string;
  subtitleKey: string;
};

const treatmentSteps: TreatmentStep[] = [
  {
    key: "physicalExamination",
    icon: Stethoscope,
    titleKey: "petTreatment.steps.physicalExamination.title",
    subtitleKey: "petTreatment.steps.physicalExamination.subtitle",
  },
  {
    key: "nutritionRequirement",
    icon: ClipboardList,
    titleKey: "petTreatment.steps.nutritionRequirement.title",
    subtitleKey: "petTreatment.steps.nutritionRequirement.subtitle",
  },
  {
    key: "personalizeNutrientRequirement",
    icon: Calculator,
    titleKey: "petTreatment.steps.personalizeNutrientRequirement.title",
    subtitleKey: "petTreatment.steps.personalizeNutrientRequirement.subtitle",
  },
  {
    key: "productMatching",
    icon: UtensilsCrossed,
    titleKey: "petTreatment.steps.productMatching.title",
    subtitleKey: "petTreatment.steps.productMatching.subtitle",
  },
  {
    key: "orderSummary",
    icon: ShoppingCart,
    titleKey: "petTreatment.steps.orderSummary.title",
    subtitleKey: "petTreatment.steps.orderSummary.subtitle",
  },
];

function toDateValue(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }

  return new Date(value);
}

function getAgeFromBirthDate(birthDate: string): { years: number; months: number } {
  const birth = toDateValue(birthDate);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(years, 0),
    months: Math.max(months, 0),
  };
}

function getPetAgeLabel(pet: RegisteredPet, t: ReturnType<typeof useTranslation>["t"]) {
  if (pet.ageType === "birthDate" && pet.birthDate) {
    const age = getAgeFromBirthDate(pet.birthDate);
    const parts: string[] = [];

    if (age.years > 0) {
      parts.push(t("userPets.year", { count: age.years }));
    }
    if (age.months > 0 || parts.length === 0) {
      parts.push(t("userPets.month", { count: age.months }));
    }

    return parts.join(" ");
  }

  const parts: string[] = [];
  if (typeof pet.years === "number") {
    parts.push(t("userPets.year", { count: pet.years }));
  }
  if (typeof pet.months === "number") {
    parts.push(t("userPets.month", { count: pet.months }));
  }

  return parts.join(" ") || t("userPets.notAvailable");
}

function getSpeciesBreedLabel(pet: RegisteredPet, t: ReturnType<typeof useTranslation>["t"]) {
  const species = t(`registerPet.${pet.species}`, {
    defaultValue: pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : "-",
  });
  const breed =
    pet.breedType === "mixed"
      ? pet.mixedBreedNote || t("userPets.mixedBreed")
      : t("userPets.purebred");

  return `${species} • ${breed}`;
}

function TreatmentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      <div className="h-[520px] animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function renderTreatmentStep(
  step: TreatmentStepKey,
  pet: RegisteredPet,
  petAgeLabel: string,
  speciesBreedLabel: string,
) {
  switch (step) {
    case "physicalExamination":
      return (
        <PhysicalExaminationForm
          pet={pet}
          petAgeLabel={petAgeLabel}
          speciesBreedLabel={speciesBreedLabel}
        />
      );
    case "nutritionRequirement":
      return (
        <NutritionRequirementForm
          pet={pet}
          petAgeLabel={petAgeLabel}
          speciesBreedLabel={speciesBreedLabel}
        />
      );
    case "personalizeNutrientRequirement":
      return (
        <PersonalizeNutrientForm
          pet={pet}
          petAgeLabel={petAgeLabel}
          speciesBreedLabel={speciesBreedLabel}
        />
      );
    case "productMatching":
      return (
        <ProductMatchingForm
          pet={pet}
          petAgeLabel={petAgeLabel}
          speciesBreedLabel={speciesBreedLabel}
        />
      );
    case "orderSummary":
      return (
        <OrderSummaryForm
          pet={pet}
          petAgeLabel={petAgeLabel}
          speciesBreedLabel={speciesBreedLabel}
        />
      );
    default:
      return null;
  }
}

function TreatmentPageContent({ petId }: { petId: string }) {
  const { t } = useTranslation();
  const [pet, setPet] = useState<RegisteredPet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    getPetByIdAction({ id: petId })
      .then((result) => {
        if (ignore) return;

        if (!result?.success || !result.data) {
          setPet(null);
          setError(result?.error ?? "errors.pets.fetchFailed");
          return;
        }

        setPet(result.data as RegisteredPet);
        setError(null);
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [petId]);

  const activeStep = treatmentSteps[activeStepIndex];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === treatmentSteps.length - 1;
  const petAgeLabel = pet ? getPetAgeLabel(pet, t) : "";
  const speciesBreedLabel = pet ? getSpeciesBreedLabel(pet, t) : "";

  return (
    <div className="w-full space-y-4 p-6">
      <Link
        href={`/pets/${petId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("petTreatment.backToPatient")}
      </Link>

      <FormAlert title="userPets.loadFailedTitle" message={error ?? undefined} />

      {isLoading ? (
        <TreatmentSkeleton />
      ) : pet ? (
        <Formik<TreatmentFormValues>
          initialValues={initialTreatmentValues}
          onSubmit={async () => {}}
        >
          {() => (
            <Form className="space-y-4">
              <section className="rounded-2xl border border-border bg-card p-4 shadow-sm shadow-black/5">
                <div className="grid gap-3 md:grid-cols-5">
                  {treatmentSteps.map((step, index) => {
                    const Icon = step.icon;
                    const active = index === activeStepIndex;
                    const completed = index < activeStepIndex;

                    return (
                      <button
                        key={step.key}
                        type="button"
                        onClick={() => setActiveStepIndex(index)}
                        className={cn(
                          "flex min-h-20 flex-col items-center justify-center rounded-xl border px-3 py-4 text-center transition-colors",
                          completed
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : active
                            ? "border-primary/20 bg-primary-soft text-primary"
                            : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/60",
                        )}
                      >
                        <div
                          className={cn(
                            "mb-2 flex h-10 w-10 items-center justify-center rounded-full",
                            completed
                              ? "bg-emerald-600 text-white"
                              : active
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold">
                          {t(step.titleKey)}
                        </p>
                        <p className="mt-1 text-xs">
                          {t(step.subtitleKey)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
                {renderTreatmentStep(activeStep.key, pet, petAgeLabel, speciesBreedLabel)}

                <div className="flex items-center justify-between border-t border-border px-4 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isFirstStep}
                    className="gap-2"
                    onClick={() => setActiveStepIndex((current) => Math.max(current - 1, 0))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("petTreatment.previous")}
                  </Button>

                  {isLastStep ? (
                    <Button
                      type="submit"
                      className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4" />
                      {t("petTreatment.completeAndSave")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="gap-2"
                      onClick={() =>
                        setActiveStepIndex((current) => Math.min(current + 1, treatmentSteps.length - 1))
                      }
                    >
                      {t("petTreatment.next")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </section>
            </Form>
          )}
        </Formik>
      ) : null}
    </div>
  );
}

export default function PetTreatmentPage() {
  const params = useParams();
  const petId = typeof params.id === "string" ? params.id : "";

  if (!petId) {
    return null;
  }

  return <TreatmentPageContent key={petId} petId={petId} />;
}
