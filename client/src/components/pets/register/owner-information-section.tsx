import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "./section-title";
import { FormError } from "./form-error";
import { TabButton } from "./tab-button";
import { PetOwnerSummary, RegisterPetsFormValues } from "@/types/pets-register.type";

type Props = {
  formik: FormikProps<RegisterPetsFormValues>;
  ownerOptions: PetOwnerSummary[];
  isOwnerSearchLoading: boolean;
  ownerSearchError?: string | null;
};

export function OwnerInformationSection({
  formik,
  ownerOptions,
  isOwnerSearchLoading,
  ownerSearchError,
}: Props) {
  const { t } = useTranslation();
  const { values, handleChange, handleBlur, setFieldValue } = formik;
  const selectedOwner = ownerOptions.find((owner) => owner.id === values.ownerId);

  return (
    <section className="space-y-5">
      <SectionTitle title={t("registerPet.ownerInformation")} />

      <div className="inline-flex rounded-xl bg-muted p-1">
        <TabButton
          label={t("registerPet.newOwner")}
          active={values.ownerType === "new"}
          onClick={() => {
            setFieldValue("ownerType", "new");
            setFieldValue("ownerId", "");
            setFieldValue("existingOwnerSearch", "");
          }}
        />
        <TabButton
          label={t("registerPet.existingOwner")}
          active={values.ownerType === "existing"}
          onClick={() => {
            setFieldValue("ownerType", "existing");
            setFieldValue("firstName", "");
            setFieldValue("lastName", "");
            setFieldValue("phoneNumber", "");
            setFieldValue("email", "");
          }}
        />
      </div>

      {values.ownerType === "new" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="firstName">
              {t("registerPet.firstName")} <span className="text-required">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder={t("registerPet.firstNamePlaceholder")}
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-2"
            />
            <FormError name="firstName" />
          </div>

          <div>
            <Label htmlFor="lastName">
              {t("registerPet.lastName")} <span className="text-required">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder={t("registerPet.lastNamePlaceholder")}
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-2"
            />
            <FormError name="lastName" />
          </div>

          <div>
            <Label htmlFor="phoneNumber">
              {t("registerPet.phoneNumber")} <span className="text-required">*</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder={t("registerPet.phoneNumberPlaceholder")}
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-2"
            />
            <FormError name="phoneNumber" />
          </div>

          <div>
            <Label htmlFor="email">{t("registerPet.email")}</Label>
            <Input
              id="email"
              name="email"
              placeholder={t("registerPet.emailPlaceholder")}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-2"
            />
            <FormError name="email" />
          </div>
        </div>
      ) : (
        <div className="space-y-4 md:max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="existingOwnerSearch">
              {t("registerPet.searchExistingOwner")}
            </Label>
            <Input
              id="existingOwnerSearch"
              name="existingOwnerSearch"
              placeholder={t("registerPet.searchExistingOwnerPlaceholder")}
              value={values.existingOwnerSearch}
              onChange={(event) => {
                setFieldValue("existingOwnerSearch", event.target.value);
                if (values.ownerId) {
                  setFieldValue("ownerId", "");
                }
              }}
              onBlur={handleBlur}
            />
            <FormError name="ownerId" />
          </div>

          {ownerSearchError ? (
            <p className="text-sm text-destructive">{ownerSearchError}</p>
          ) : null}

          {selectedOwner ? (
            <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary">
              {t("registerPet.selectedOwner", {
                name: selectedOwner.fullName,
                phone: selectedOwner.phoneNumber,
              })}
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {values.existingOwnerSearch.trim()
                ? t("registerPet.matchingOwners")
                : t("registerPet.recentOwners")}
            </p>

            {isOwnerSearchLoading ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                {t("registerPet.searchingOwners")}
              </div>
            ) : ownerOptions.length > 0 ? (
              <div className="space-y-2">
                {ownerOptions.map((owner) => {
                  const isSelected = values.ownerId === owner.id;
                  return (
                    <button
                      key={owner.id}
                      type="button"
                      onClick={() => {
                        setFieldValue("ownerId", owner.id);
                        setFieldValue("existingOwnerSearch", owner.fullName);
                      }}
                      className={`flex w-full items-start justify-between rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted/70"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{owner.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {owner.phoneNumber}
                          {owner.email ? ` • ${owner.email}` : ""}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t("registerPet.petsCount", { count: owner.petsCount })}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                {t("registerPet.ownersNotFound")}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
