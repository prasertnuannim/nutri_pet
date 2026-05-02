import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "./section-title";
import { RadioGroupInline } from "./radio-group-inline";
import { RegisterPetsFormValues } from "@/types/pets-register.type";

type Props = {
  formik: FormikProps<RegisterPetsFormValues>;
};

export function HealthStatusSection({ formik }: Props) {
  const { t } = useTranslation();
  const { values, setFieldValue } = formik;

  return (
    <section className="space-y-5">
      <SectionTitle title={t("registerPet.healthStatus")} />
      <RadioGroupInline
        name="healthStatus"
        value={values.healthStatus}
        setFieldValue={setFieldValue}
        options={[
          { label: t("registerPet.healthy"), value: "healthy" },
          { label: t("registerPet.diseaseHistory"), value: "diseaseHistory" },
        ]}
      />
    </section>
  );
}
