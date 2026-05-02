"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { Search, Plus, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import FormAlert from "@/components/form/formAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getIntlLocale, resolveLanguage } from "@/lib/i18n/shared";
import { getPetsAction } from "./actions";
import type { PetsListResponse, RegisteredPet } from "@/types/pets-register.type";

export default function PatientsTablePage() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(resolveLanguage(i18n.resolvedLanguage));
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<RegisteredPet[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search.trim());

  useEffect(() => {
    let ignore = false;

    getPetsAction({ query: deferredSearch, limit: 100 })
      .then((result) => {
        if (ignore) return;

        if (!result?.success) {
          setPatients([]);
          setTotal(0);
          setError(result?.error ?? "errors.pets.fetchFailed");
          return;
        }

        const payload = result.data as PetsListResponse | undefined;
        setPatients(Array.isArray(payload?.data) ? payload.data : []);
        setTotal(typeof payload?.total === "number" ? payload.total : 0);
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
  }, [deferredSearch]);

  const formatSpecies = (species: string) =>
    t(`registerPet.${species}`, {
      defaultValue: species ? species.charAt(0).toUpperCase() + species.slice(1) : "",
    });

  const formatAge = (patient: RegisteredPet) => {
    if (patient.ageType === "birthDate" && patient.birthDate) {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(patient.birthDate));
    }

    const parts: string[] = [];
    if (typeof patient.years === "number") {
      parts.push(t("userPets.year", { count: patient.years }));
    }
    if (typeof patient.months === "number") {
      parts.push(t("userPets.month", { count: patient.months }));
    }

    return parts.join(" ") || "-";
  };

  return (
    <div className="w-full p-6">
      <FormAlert title="userPets.loadFailedTitle" message={error ?? undefined} />

      <div className="rounded-xl border border-border bg-card shadow-sm shadow-black/5">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                const nextSearch = e.target.value;
                if (nextSearch.trim() !== deferredSearch) {
                  setIsLoading(true);
                }
                setSearch(nextSearch);
              }}
              placeholder={t("userPets.searchPlaceholder")}
              className="pl-9"
            />
          </div>

          <Button asChild className="gap-2">
            <Link href="/pets/register">
              <Plus className="h-4 w-4" />
              {t("userPets.registerPets")}
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/70 hover:bg-muted/70">
                <TableHead className="w-[60px] text-center align-middle">{t("userPets.number")}</TableHead>
                <TableHead className="w-[130px]">{t("userPets.hn")}</TableHead>
                <TableHead className="min-w-[150px]">{t("userPets.patientName")}</TableHead>
                <TableHead className="min-w-[160px]">{t("userPets.speciesBreed")}</TableHead>
                <TableHead className="w-[100px]">{t("userPets.age")}</TableHead>
                <TableHead className="w-[110px]">{t("userPets.weight")}</TableHead>
                <TableHead className="min-w-[170px]">{t("userPets.owner")}</TableHead>
                <TableHead className="min-w-[140px]">{t("userPets.registeredDate")}</TableHead>
                <TableHead className="w-[90px] text-center">{t("userPets.actions")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <TableRow key={patient.id} className="h-[72px]">
                    <TableCell className="text-center align-middle text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/pets/${patient.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {patient.hn}
                      </Link>
                    </TableCell>

                    <TableCell className="font-medium text-foreground">
                      {patient.patientName}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {formatSpecies(patient.species)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {patient.breedType === "mixed"
                            ? patient.mixedBreedNote || t("userPets.mixedBreed")
                            : t("userPets.purebred")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatAge(patient)}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {patient.weight} {t("common.units.kg")}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {patient.owner.fullName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {patient.owner.phoneNumber}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {new Intl.DateTimeFormat(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(patient.createdAt))}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          aria-label={t("userPets.openPatient", { name: patient.patientName })}
                          className="text-primary hover:bg-primary-soft hover:text-primary"
                        >
                          <Link href={`/pets/${patient.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {isLoading ? t("userPets.loading") : t("userPets.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          {t("userPets.showingPatients", { shown: patients.length, total })}
        </div>
      </div>
    </div>
  );
}
