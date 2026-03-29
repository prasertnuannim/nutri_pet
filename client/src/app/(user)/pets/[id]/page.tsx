"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Mail,
  PawPrint,
  Phone,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import FormAlert from "@/components/form/formAlert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getIntlLocale, resolveLanguage } from "@/lib/i18n/shared";
import type { RegisteredPet } from "@/types/pets-register";
import { getPetByIdAction } from "../actions";

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function PetDetailSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/5">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-muted" />
          <div className="h-7 w-32 rounded bg-muted" />
          <div className="h-5 w-24 rounded bg-muted" />
          <div className="mt-4 w-full space-y-3">
            <div className="h-10 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
            <div className="h-10 rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/5">
        <div className="space-y-4 animate-pulse">
          <div className="h-7 w-48 rounded bg-muted" />
          <div className="h-5 w-36 rounded bg-muted" />
          <div className="h-36 rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
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

function toDateValue(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }

  return new Date(value);
}

function PetDetailContent({ petId }: { petId: string }) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(resolveLanguage(i18n.resolvedLanguage));
  const [pet, setPet] = useState<RegisteredPet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(toDateValue(value));

  const formatTime = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(toDateValue(value));

  const formatSpecies = (species: string) =>
    t(`registerPet.${species}`, {
      defaultValue: species ? species.charAt(0).toUpperCase() + species.slice(1) : "-",
    });

  const formatBreed = (currentPet: RegisteredPet) =>
    currentPet.breedType === "mixed"
      ? currentPet.mixedBreedNote || t("userPets.mixedBreed")
      : t("userPets.purebred");

  const formatAge = (currentPet: RegisteredPet) => {
    const parts: string[] = [];

    if (currentPet.ageType === "birthDate" && currentPet.birthDate) {
      const calculatedAge = getAgeFromBirthDate(currentPet.birthDate);

      if (calculatedAge.years > 0) {
        parts.push(t("userPets.year", { count: calculatedAge.years }));
      }
      if (calculatedAge.months > 0 || parts.length === 0) {
        parts.push(t("userPets.month", { count: calculatedAge.months }));
      }

      return parts.join(" ");
    }

    if (typeof currentPet.years === "number") {
      parts.push(t("userPets.year", { count: currentPet.years }));
    }
    if (typeof currentPet.months === "number") {
      parts.push(t("userPets.month", { count: currentPet.months }));
    }

    return parts.join(" ") || t("userPets.notAvailable");
  };

  const formatHousing = (housingCondition: RegisteredPet["housingCondition"]) => {
    const key = housingCondition === "both" ? "indoorOutdoor" : housingCondition;
    return t(`registerPet.${key}`);
  };

  const avatarLabel = pet?.patientName?.trim().charAt(0).toUpperCase() || "P";

  return (
    <div className="w-full p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link
          href="/pets"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("userPets.backToPatients")}
        </Link>
      </div>

      <FormAlert title="userPets.loadFailedTitle" message={error ?? undefined} className="mb-4" />

      {isLoading ? (
        <PetDetailSkeleton />
      ) : pet ? (
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/5">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24" size="lg">
                <AvatarFallback className="bg-primary text-3xl font-semibold text-primary-foreground">
                  {avatarLabel}
                </AvatarFallback>
              </Avatar>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                {pet.patientName}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatSpecies(pet.species)} • {formatBreed(pet)}
              </p>
            </div>

            <div className="mt-6 divide-y divide-border">
              <DetailRow label={t("userPets.hn")} value={pet.hn} />
              <DetailRow label={t("userPets.age")} value={formatAge(pet)} />
              <DetailRow label={t("registerPet.sex")} value={t(`registerPet.${pet.sex}`)} />
              <DetailRow
                label={t("userPets.weight")}
                value={`${pet.weight} ${t("common.units.kg")}`}
              />
              <DetailRow
                label={t("userPets.registeredDate")}
                value={formatDate(pet.createdAt)}
              />
              {pet.birthDate ? (
                <DetailRow
                  label={t("registerPet.birthDate")}
                  value={formatDate(pet.birthDate)}
                />
              ) : null}
              <DetailRow
                label={t("registerPet.housingCondition")}
                value={formatHousing(pet.housingCondition)}
              />
              <DetailRow
                label={t("registerPet.healthStatus")}
                value={t(`registerPet.${pet.healthStatus}`)}
              />
            </div>

            <Separator className="my-5" />

            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">
                {t("registerPet.ownerInformation")}
              </h2>

              <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3">
                <div className="rounded-full bg-background p-2 text-primary shadow-sm shadow-black/5">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{pet.owner.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("userPets.owner")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{pet.owner.phoneNumber || t("userPets.notAvailable")}</span>
                </div>

                <div className="flex items-center gap-3 text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{pet.owner.email || t("userPets.notAvailable")}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/5">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {t("userPets.treatmentHistory")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("userPets.treatmentHistoryDescription")}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-muted/60 p-3 text-primary shadow-sm shadow-black/5">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {formatDate(pet.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(pet.createdAt)}
                    </p>
                    <Button
                      asChild
                      variant="link"
                      className="mt-1 h-auto px-0 text-primary"
                    >
                      <Link href={`/pets/${pet.id}/treatment`}>
                        {t("userPets.continueTreatment")}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700">
                  {t("userDashboard.stats.waiting")}
                </span>
              </div>

              <div className="mt-4 flex items-start gap-4">
                <div className="rounded-xl bg-primary-soft p-3 text-primary shadow-sm shadow-black/5">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    {t("userPets.noTreatmentHistory")}
                  </p>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                    {t("userPets.noTreatmentHistoryDescription")}
                  </p>

                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                    <PawPrint className="h-3.5 w-3.5" />
                    {formatDate(pet.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default function PetDetailPage() {
  const params = useParams();
  const petId = typeof params.id === "string" ? params.id : "";

  if (!petId) {
    return null;
  }

  return <PetDetailContent key={petId} petId={petId} />;
}
