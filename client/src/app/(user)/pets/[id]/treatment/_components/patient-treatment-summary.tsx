"use client";

import { PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";
import type { RegisteredPet } from "@/types/pets-register.type";

type PatientTreatmentSummaryProps = {
  pet: RegisteredPet;
  petAgeLabel: string;
  speciesBreedLabel: string;
};

export function PatientTreatmentSummary({
  pet,
  petAgeLabel,
  speciesBreedLabel,
}: PatientTreatmentSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-black/5">
            <PawPrint className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">
              {pet.patientName}
              <span className="ml-2 text-sm font-medium text-muted-foreground">
                {t("userPets.owner")}: {pet.owner.fullName}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {speciesBreedLabel}
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("userPets.weight")}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {pet.weight} {t("common.units.kg")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("userPets.age")}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {petAgeLabel}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("petTreatment.chiefComplaint")}
        </p>
        <p className="mt-2 text-sm text-foreground">
          {t("petTreatment.chiefComplaintValue")}
        </p>
      </div>
    </div>
  );
}
