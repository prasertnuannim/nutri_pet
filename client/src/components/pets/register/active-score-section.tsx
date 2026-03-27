import { BatteryMedium, Moon, Zap } from "lucide-react";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "./section-title";
import { TabButton } from "./tab-button";
import { RadioCard } from "./radio-card";
import { RegisterPetsFormValues } from "@/types/pets-register";

type Props = {
  formik: FormikProps<RegisterPetsFormValues>;
};

export function ActiveScoreSection({ formik }: Props) {
  const { t } = useTranslation();
  const { values, setFieldValue } = formik;

  return (
    <section className="space-y-5">
      <SectionTitle title={t("registerPet.activeScore")} />

      <div className="inline-flex rounded-xl bg-muted p-1">
        <TabButton
          label={t("registerPet.visualActiveScore")}
          active={values.activeScoreTab === "visual"}
          onClick={() => setFieldValue("activeScoreTab", "visual")}
        />
        <TabButton
          label={t("registerPet.activeScoreAssessment")}
          active={values.activeScoreTab === "assessment"}
          onClick={() => setFieldValue("activeScoreTab", "assessment")}
        />
      </div>

      {values.activeScoreTab === "visual" ? (
        <div className="space-y-4">
          <Label>{t("registerPet.selectVisualActiveScore")}</Label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RadioCard
              selected={values.visualActiveScore === "veryActive"}
              onClick={() => setFieldValue("visualActiveScore", "veryActive")}
              icon={<Zap className="h-7 w-7" />}
              title={t("registerPet.veryActive")}
              points={t("registerPet.points", { count: 10 })}
            />

            <RadioCard
              selected={values.visualActiveScore === "moderatelyActive"}
              onClick={() => setFieldValue("visualActiveScore", "moderatelyActive")}
              icon={<BatteryMedium className="h-7 w-7" />}
              title={t("registerPet.moderatelyActive")}
              points={t("registerPet.points", { count: 5 })}
            />

            <RadioCard
              selected={values.visualActiveScore === "notVeryActive"}
              onClick={() => setFieldValue("visualActiveScore", "notVeryActive")}
              icon={<Moon className="h-7 w-7" />}
              title={t("registerPet.notVeryActive")}
              points={t("registerPet.points", { count: 0 })}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          {t("registerPet.assessmentArea")}
        </div>
      )}
    </section>
  );
}
