import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionTitle } from "./section-title";
import { FormError } from "./form-error";
import { RadioGroupInline } from "./radio-group-inline";
import { RegisterPetsFormValues } from "@/types/pets-register.type";

type Props = {
  formik: FormikProps<RegisterPetsFormValues>;
};

export function PetInformationSection({ formik }: Props) {
  const { t } = useTranslation();
  const { values, handleChange, handleBlur, setFieldValue } = formik;

  return (
    <section className="space-y-5">
      <SectionTitle title={t("registerPet.patientInformation")} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="hn">{t("registerPet.hospitalNumber")}</Label>
          <Input
            id="hn"
            name="hn"
            placeholder={t("registerPet.hospitalNumberPlaceholder")}
            value={values.hn}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="patientName">
            {t("registerPet.patientName")} <span className="text-required">*</span>
          </Label>
          <Input
            id="patientName"
            name="patientName"
            placeholder={t("registerPet.patientNamePlaceholder")}
            value={values.patientName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-2"
          />
          <FormError name="patientName" />
        </div>

        <div>
          <Label>
            {t("registerPet.species")} <span className="text-required">*</span>
          </Label>
          <div className="mt-2">
            <Select
              value={values.species}
              onValueChange={(value) => setFieldValue("species", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("registerPet.selectSpecies")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">{t("registerPet.dog")}</SelectItem>
                <SelectItem value="cat">{t("registerPet.cat")}</SelectItem>
                <SelectItem value="rabbit">{t("registerPet.rabbit")}</SelectItem>
                <SelectItem value="bird">{t("registerPet.bird")}</SelectItem>
                <SelectItem value="other">{t("registerPet.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormError name="species" />
        </div>

        <div>
          <Label>
            {t("registerPet.sex")} <span className="text-required">*</span>
          </Label>
          <RadioGroupInline
            name="sex"
            value={values.sex}
            setFieldValue={setFieldValue}
            options={[
              { label: t("registerPet.male"), value: "male" },
              { label: t("registerPet.female"), value: "female" },
            ]}
          />
          <FormError name="sex" />
        </div>
      </div>

      <div>
        <Label>
          {t("registerPet.breed")} <span className="text-required">*</span>
        </Label>
        <RadioGroupInline
          name="breedType"
          value={values.breedType}
          setFieldValue={setFieldValue}
          options={[
            { label: t("registerPet.mixedBreedOption"), value: "mixed" },
            { label: t("registerPet.purebredOption"), value: "purebred" },
          ]}
        />
        <Input
          name="mixedBreedNote"
          placeholder={t("registerPet.mixedBreedPlaceholder")}
          value={values.mixedBreedNote}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-3"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label>
            {t("registerPet.neuteredStatus")} <span className="text-required">*</span>
          </Label>
          <RadioGroupInline
            name="neuteredStatus"
            value={values.neuteredStatus}
            setFieldValue={setFieldValue}
            options={[
              { label: t("registerPet.intact"), value: "intact" },
              { label: t("registerPet.neutered"), value: "neutered" },
            ]}
          />
        </div>

        <div>
          <Label>
            {t("registerPet.housingCondition")} <span className="text-required">*</span>
          </Label>
          <RadioGroupInline
            name="housingCondition"
            value={values.housingCondition}
            setFieldValue={setFieldValue}
            options={[
              { label: t("registerPet.indoor"), value: "indoor" },
              { label: t("registerPet.outdoor"), value: "outdoor" },
              { label: t("registerPet.indoorOutdoor"), value: "both" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label>{t("registerPet.ageBirthDate")}</Label>
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="ageType"
                checked={values.ageType === "age"}
                onChange={() => setFieldValue("ageType", "age")}
                className="h-4 w-4 accent-primary"
              />
              {t("registerPet.age")}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <Input
                name="years"
                placeholder={t("registerPet.years")}
                value={values.years}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={values.ageType !== "age"}
              />
              <Input
                name="months"
                placeholder={t("registerPet.months")}
                value={values.months}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={values.ageType !== "age"}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="pt-7">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                name="ageType"
                checked={values.ageType === "birthDate"}
                onChange={() => setFieldValue("ageType", "birthDate")}
                className="h-4 w-4 accent-primary"
              />
              {t("registerPet.birthDate")}
            </label>

            <Input
              name="birthDate"
              type="date"
              value={values.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={values.ageType !== "birthDate"}
              className="mt-3"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md">
        <Label htmlFor="weight">
          {t("registerPet.weightKg")} <span className="text-required">*</span>
        </Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          step="0.01"
          placeholder={t("registerPet.weightPlaceholder")}
          value={values.weight}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-2"
        />
        <FormError name="weight" />
      </div>
    </section>
  );
}
