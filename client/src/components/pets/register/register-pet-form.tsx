"use client";

import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardPlus, Save } from "lucide-react";
import { Formik, Form, type FormikHelpers, type FormikProps } from "formik";
import { useTranslation } from "react-i18next";

import FormAlert from "@/components/form/formAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  registerPetsInitialValues,
  registerPetsSchema,
} from "@/lib/validators/register-pets.schema";
import { registerPetAction, searchPetOwnersAction } from "@/app/(user)/pets/actions";
import type {
  PetOwnerSummary,
  PetOwnersListResponse,
  RegisterPetsFormValues,
  RegisteredPet,
} from "@/types/pets-register";

import { PetInformationSection } from "./pet-information-section";
import { OwnerInformationSection } from "./owner-information-section";
import { HealthStatusSection } from "./health-status-section";
import { ActiveScoreSection } from "./active-score-section";

type SubmitMode = "saveOnly" | "saveAndVisit";

export function RegisterPatientForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const submitModeRef = useRef<SubmitMode>("saveOnly");
  const [submitError, setSubmitError] = useState<string>();
  const [submitSuccess, setSubmitSuccess] = useState<string>();

  const handleSubmit = async (
    values: RegisterPetsFormValues,
    helpers: FormikHelpers<RegisterPetsFormValues>,
  ) => {
    setSubmitError(undefined);
    setSubmitSuccess(undefined);

    const result = await registerPetAction(values);
    if (!result?.success) {
      setSubmitError(result?.error ?? "errors.pets.saveFailed");
      return;
    }

    const pet = result.data as RegisteredPet | undefined;
    if (submitModeRef.current === "saveAndVisit") {
      startTransition(() => {
        router.push("/pets");
        router.refresh();
      });
      return;
    }

    helpers.resetForm();
    setSubmitSuccess(
      pet
        ? t("registerPet.saveSuccessWithPet", {
            name: pet.patientName,
            hn: pet.hn,
          })
        : t("registerPet.saveSuccess"),
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
  
        <Card className="rounded-2xl border-border bg-card shadow-sm shadow-black/5">
          <CardHeader className="border-b px-6 py-5">
            <h1 className="text-xl font-semibold text-foreground">
              {t("registerPet.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("registerPet.description")}
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <Formik
              initialValues={registerPetsInitialValues}
              validationSchema={registerPetsSchema}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <RegisterPatientFormFields
                  formik={formik}
                  submitError={submitError}
                  submitSuccess={submitSuccess}
                  setSubmitMode={(mode) => {
                    submitModeRef.current = mode;
                  }}
                />
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type RegisterPatientFormFieldsProps = {
  formik: FormikProps<RegisterPetsFormValues>;
  submitError?: string;
  submitSuccess?: string;
  setSubmitMode: (mode: SubmitMode) => void;
};

function RegisterPatientFormFields({
  formik,
  submitError,
  submitSuccess,
  setSubmitMode,
}: RegisterPatientFormFieldsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [ownerOptions, setOwnerOptions] = useState<PetOwnerSummary[]>([]);
  const [ownerSearchError, setOwnerSearchError] = useState<string | null>(null);
  const [isOwnerSearchLoading, setIsOwnerSearchLoading] = useState(false);
  const deferredOwnerQuery = useDeferredValue(formik.values.existingOwnerSearch.trim());

  useEffect(() => {
    if (formik.values.ownerType !== "existing") {
      setOwnerOptions([]);
      setOwnerSearchError(null);
      setIsOwnerSearchLoading(false);
      return;
    }

    if (deferredOwnerQuery.length === 1) {
      setOwnerOptions([]);
      setOwnerSearchError(null);
      setIsOwnerSearchLoading(false);
      return;
    }

    let ignore = false;
    setIsOwnerSearchLoading(true);

    searchPetOwnersAction(deferredOwnerQuery)
      .then((result) => {
        if (ignore) return;

        if (!result?.success) {
          setOwnerOptions([]);
          setOwnerSearchError(result?.error ?? "errors.pets.searchOwnersFailed");
          return;
        }

        const payload = result.data as PetOwnersListResponse | undefined;
        setOwnerOptions(Array.isArray(payload?.data) ? payload.data : []);
        setOwnerSearchError(null);
      })
      .finally(() => {
        if (!ignore) {
          setIsOwnerSearchLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [deferredOwnerQuery, formik.values.ownerType]);

  return (
    <Form className="space-y-8">
      <FormAlert title="registerPet.saveFailedTitle" message={submitError} />
      <FormAlert title="registerPet.savedTitle" message={submitSuccess} variant="success" />

      <PetInformationSection formik={formik} />
      <Separator />
      <OwnerInformationSection
        formik={formik}
        ownerOptions={ownerOptions}
        isOwnerSearchLoading={isOwnerSearchLoading}
        ownerSearchError={ownerSearchError}
      />
      <Separator />
      <HealthStatusSection formik={formik} />
      <Separator />
      <ActiveScoreSection formik={formik} />
      <Separator />

      <div className="flex flex-col gap-3 md:flex-row">
        <Button
          type="button"
          variant="outline"
          className="md:w-[160px]"
          onClick={() => router.push("/pets")}
          disabled={formik.isSubmitting}
        >
          {t("registerPet.cancel")}
        </Button>

        <Button
          type="submit"
          variant="outline"
          className="gap-2 border-primary text-primary hover:bg-primary-soft hover:text-primary md:flex-1"
          onClick={() => setSubmitMode("saveOnly")}
          disabled={formik.isSubmitting}
        >
          <Save className="h-4 w-4" />
          {t("registerPet.saveOnly")}
        </Button>

        <Button
          type="submit"
          className="gap-2 shadow-sm md:flex-1"
          onClick={() => setSubmitMode("saveAndVisit")}
          disabled={formik.isSubmitting}
        >
          <ClipboardPlus className="h-4 w-4" />
          {t("registerPet.saveVisit")}
        </Button>
      </div>
    </Form>
  );
}
