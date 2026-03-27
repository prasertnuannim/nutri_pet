"use client";

import { useActionState, useEffect, useRef } from "react";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { registerUser } from "@/app/actions/registerForm";
import FormAlert from "@/components/form/formAlert";
import { SubmitButton } from "@/components/form/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_ACCOUNT_PASSWORD } from "@/lib/auth/default-account-password";
import { AuthFormState } from "@/types/auth.type";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void | Promise<void>;
  tenantOptions?: string[];
  promotionOptions?: string[];
};

const initialState: AuthFormState = {
  errors: {},
  values: {
    name: "",
    email: "",
    tenant: "",
    promotion: "",
  },
};

export default function RegisterModal({
  open,
  onOpenChange,
  onSuccess,
  tenantOptions = [],
  promotionOptions = [],
}: RegisterModalProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState
  );

  const values = state.values ?? {};

  useEffect(() => {
    if (!state.success) return;

    formRef.current?.reset();
    void onSuccess?.();
  }, [state.success, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border border-border bg-card p-0 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:max-w-xl">
        <DialogHeader className="border-b border-border bg-[linear-gradient(160deg,var(--background)_0%,var(--secondary)_55%,var(--card)_100%)] px-6 py-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("authRegister.badge")}
          </div>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            {t("authRegister.title")}
          </DialogTitle>
          <DialogDescription className="max-w-lg leading-6 text-muted-foreground">
            {t("authRegister.description")}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-5 px-6 py-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {t("authRegister.detailsEyebrow")}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("authRegister.detailsDescription")}
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-primary-soft/80 p-4 text-sm text-primary">
            <p className="font-semibold">{t("authRegister.defaultPasswordTitle")}</p>
            <p className="mt-1 leading-6">
              {t("authRegister.defaultPasswordDescription", {
                password: DEFAULT_ACCOUNT_PASSWORD,
              })}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                {t("authRegister.usernameLabel")}
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t("authRegister.usernamePlaceholder")}
                  defaultValue={values.name ?? ""}
                  autoComplete="name"
                  aria-invalid={Boolean(state.errors?.name)}
                  className="h-12 rounded-2xl border-border bg-background pl-11 pr-4 text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:border-ring focus-visible:ring-ring/30"
                />
              </div>
              {state.errors?.name ? (
                <p className="text-sm font-medium text-destructive">
                  {t(state.errors.name, { defaultValue: state.errors.name })}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                {t("authRegister.emailLabel")}
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("authRegister.emailPlaceholder")}
                  defaultValue={values.email ?? ""}
                  autoComplete="email"
                  aria-invalid={Boolean(state.errors?.email)}
                  className="h-12 rounded-2xl border-border bg-background pl-11 pr-4 text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:border-ring focus-visible:ring-ring/30"
                />
              </div>
              {state.errors?.email ? (
                <p className="text-sm font-medium text-destructive">
                  {t(state.errors.email, { defaultValue: state.errors.email })}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="tenant"
                  className="text-sm font-semibold text-foreground"
                >
                  {t("authRegister.tenantLabel")}
                </Label>
                <select
                  id="tenant"
                  name="tenant"
                  defaultValue={values.tenant ?? ""}
                  aria-invalid={Boolean(state.errors?.tenant)}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
                >
                  <option value="">{t("authRegister.notSet")}</option>
                  {tenantOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {state.errors?.tenant ? (
                  <p className="text-sm font-medium text-destructive">
                    {t(state.errors.tenant, { defaultValue: state.errors.tenant })}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="promotion"
                  className="text-sm font-semibold text-foreground"
                >
                  {t("authRegister.promotionLabel")}
                </Label>
                <select
                  id="promotion"
                  name="promotion"
                  defaultValue={values.promotion ?? ""}
                  aria-invalid={Boolean(state.errors?.promotion)}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
                >
                  <option value="">{t("authRegister.notSet")}</option>
                  {promotionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {state.errors?.promotion ? (
                  <p className="text-sm font-medium text-destructive">
                    {t(state.errors.promotion, { defaultValue: state.errors.promotion })}
                  </p>
                ) : null}
              </div>
            </div>

          </div>

          <div className="space-y-4">
            <SubmitButton
              text="authRegister.createAccount"
              isPending={isPending}
              className="h-12 rounded-2xl shadow-[0_14px_30px_rgba(15,23,42,0.14)]"
            />

            {state.errors?.general ? (
              <FormAlert
                variant="error"
                title="authRegister.failedTitle"
                message={state.errors.general}
              />
            ) : null}

            {state.success ? (
              <FormAlert
                variant="success"
                title="authRegister.successTitle"
                message={t("authRegister.successMessage", {
                  password: DEFAULT_ACCOUNT_PASSWORD,
                })}
              />
            ) : null}
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            {t("authRegister.footer")}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
