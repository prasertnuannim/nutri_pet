"use client";

import { useState } from "react";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RegisteredPet } from "@/types/pets-register.type";
import { PatientTreatmentSummary } from "./patient-treatment-summary";
import { treatmentTextareaClassName, type TreatmentFormValues } from "./treatment-form";

type PhysicalExaminationFormProps = {
  pet: RegisteredPet;
  petAgeLabel: string;
  speciesBreedLabel: string;
};

type BcsQuestionnaireSection = {
  title: string;
  items: string[];
};

export function PhysicalExaminationForm({
  pet,
  petAgeLabel,
  speciesBreedLabel,
}: PhysicalExaminationFormProps) {
  const { t } = useTranslation();
  const formik = useFormikContext<TreatmentFormValues>();
  const [activeTab, setActiveTab] = useState<"general" | "blood">("general");
  const [showBcsQuestionnaires, setShowBcsQuestionnaires] = useState(false);
  const bcsQuestionnaires = t("petTreatment.bcsQuestionnaire.sections", {
    returnObjects: true,
  }) as BcsQuestionnaireSection[];

  const handleBcsQuestionnaireSelect = (sectionIndex: number, itemIndex: number) => {
    const nextAnswers = [...formik.values.bcsQuestionnaireAnswers];
    nextAnswers[sectionIndex] = String(itemIndex);
    formik.setFieldValue("bcsQuestionnaireAnswers", nextAnswers);
  };

  return (
    <>
      <PatientTreatmentSummary
        pet={pet}
        petAgeLabel={petAgeLabel}
        speciesBreedLabel={speciesBreedLabel}
      />

      <div className="border-b border-border px-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={cn(
              "border-b-2 px-3 py-4 text-sm font-semibold transition-colors",
              activeTab === "general"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t("petTreatment.tabs.generalExam")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("blood")}
            className={cn(
              "border-b-2 px-3 py-4 text-sm font-semibold transition-colors",
              activeTab === "blood"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t("petTreatment.tabs.bloodTest")}
          </button>
        </div>
      </div>

      <div className="space-y-6 p-4">
        {activeTab === "general" ? (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {t("petTreatment.generalExamTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("petTreatment.generalExamDescription")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="historyTaking">
                {t("petTreatment.historyTaking")}
              </Label>
              <textarea
                id="historyTaking"
                rows={4}
                placeholder={t("petTreatment.historyTakingPlaceholder")}
                className={treatmentTextareaClassName}
                {...formik.getFieldProps("historyTaking")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalExamNotes">
                {t("petTreatment.physicalExamNotes")}
              </Label>
              <textarea
                id="physicalExamNotes"
                rows={4}
                placeholder={t("petTreatment.physicalExamNotesPlaceholder")}
                className={treatmentTextareaClassName}
                {...formik.getFieldProps("physicalExamNotes")}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bodyTemperature">
                  {t("petTreatment.bodyTemperature")}
                </Label>
                <Input id="bodyTemperature" {...formik.getFieldProps("bodyTemperature")} />
                <p className="text-xs text-muted-foreground">
                  {t("petTreatment.bodyTemperatureHint")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">
                  {t("petTreatment.heartRate")}
                </Label>
                <Input id="heartRate" {...formik.getFieldProps("heartRate")} />
                <p className="text-xs text-muted-foreground">
                  {t("petTreatment.heartRateHint")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">
                  {t("petTreatment.respiratoryRate")}
                </Label>
                <Input id="respiratoryRate" {...formik.getFieldProps("respiratoryRate")} />
                <p className="text-xs text-muted-foreground">
                  {t("petTreatment.respiratoryRateHint")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="bodyConditionScore">
                    {t("petTreatment.bodyConditionScore")}
                  </Label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowBcsQuestionnaires((current) => !current)}
                  >
                    {showBcsQuestionnaires
                      ? t("petTreatment.bcsQuestionnaire.hide")
                      : t("petTreatment.bcsQuestionnaire.show")}
                  </Button>
                </div>
                <Input
                  id="bodyConditionScore"
                  placeholder={t("petTreatment.bodyConditionScorePlaceholder")}
                  {...formik.getFieldProps("bodyConditionScore")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("petTreatment.bodyConditionScoreHint")}
                </p>
              </div>
            </div>

            {showBcsQuestionnaires ? (
              <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-5">
                <div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t("petTreatment.bcsQuestionnaire.title")}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("petTreatment.bcsQuestionnaire.description")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {bcsQuestionnaires.map((questionnaire, sectionIndex) => {
                    const selectedAnswer =
                      formik.values.bcsQuestionnaireAnswers[sectionIndex] ?? "";

                    return (
                      <fieldset
                        key={questionnaire.title}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <legend className="px-1 text-sm font-semibold text-foreground">
                          {questionnaire.title}
                        </legend>

                        <div className="mt-3 space-y-2">
                          {questionnaire.items.map((item, itemIndex) => {
                            const inputId = `bcs-questionnaire-${sectionIndex}-${itemIndex}`;
                            const isChecked = selectedAnswer === String(itemIndex);

                            return (
                              <label
                                key={inputId}
                                htmlFor={inputId}
                                className={cn(
                                  "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                                  isChecked
                                    ? "bg-primary-soft text-foreground"
                                    : "text-foreground hover:bg-muted/40",
                                )}
                              >
                                <input
                                  id={inputId}
                                  type="radio"
                                  name={`bcs-questionnaire-${sectionIndex}`}
                                  value={itemIndex}
                                  checked={isChecked}
                                  onChange={() =>
                                    handleBcsQuestionnaireSelect(sectionIndex, itemIndex)
                                  }
                                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                                />
                                <span className="leading-6">{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <Label>{t("petTreatment.diagnosis")}</Label>
              <div className="flex flex-wrap gap-6 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="diagnosis"
                    value="healthy"
                    checked={formik.values.diagnosis === "healthy"}
                    onChange={() => formik.setFieldValue("diagnosis", "healthy")}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{t("petTreatment.diagnosisHealthy")}</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="diagnosis"
                    value="disease"
                    checked={formik.values.diagnosis === "disease"}
                    onChange={() => formik.setFieldValue("diagnosis", "disease")}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{t("petTreatment.diagnosisDisease")}</span>
                </label>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              {t("petTreatment.bloodTestTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("petTreatment.bloodTestDescription")}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
