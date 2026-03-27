"use client";

import { useActionState, useEffect } from "react";
import { LockKeyhole } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { changePasswordAction } from "./actions";
import FormAlert from "@/components/form/formAlert";
import { SubmitButton } from "@/components/form/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordChangeFormState } from "@/types/auth.type";

const initialState: PasswordChangeFormState = {
  errors: {},
  values: {
    newPassword: "",
    confirmPassword: "",
  },
};

export default function ChangePasswordForm() {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState,
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }

    const timer = setTimeout(() => {
      void signOut({ callbackUrl: "/login" });
    }, 900);

    return () => clearTimeout(timer);
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          {t("changePasswordForm.eyebrow")}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("changePasswordForm.description")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            className="text-sm font-semibold text-foreground"
          >
            {t("changePasswordForm.newPasswordLabel")}
          </Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder={t("changePasswordForm.newPasswordPlaceholder")}
              defaultValue={state.values?.newPassword ?? ""}
              autoComplete="new-password"
              aria-invalid={Boolean(state.errors?.newPassword)}
              className="h-12 rounded-2xl border-border bg-background pl-11 pr-4 text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
          {state.errors?.newPassword ? (
            <p className="text-sm font-medium text-destructive">
              {t(state.errors.newPassword, { defaultValue: state.errors.newPassword })}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-foreground"
          >
            {t("changePasswordForm.confirmPasswordLabel")}
          </Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t("changePasswordForm.confirmPasswordPlaceholder")}
              defaultValue={state.values?.confirmPassword ?? ""}
              autoComplete="new-password"
              aria-invalid={Boolean(state.errors?.confirmPassword)}
              className="h-12 rounded-2xl border-border bg-background pl-11 pr-4 text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
          {state.errors?.confirmPassword ? (
            <p className="text-sm font-medium text-destructive">
              {t(state.errors.confirmPassword, {
                defaultValue: state.errors.confirmPassword,
              })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <SubmitButton
          text="changePasswordForm.submit"
          isPending={isPending}
          className="h-12 rounded-2xl shadow-[0_14px_30px_rgba(15,23,42,0.14)]"
        />

        {state.errors?.general ? (
          <FormAlert
            variant="error"
            title="changePasswordForm.failedTitle"
            message={state.errors.general}
          />
        ) : null}

        {state.success ? (
          <FormAlert
            variant="success"
            title="changePasswordForm.successTitle"
            message="changePasswordForm.successMessage"
          />
        ) : null}
      </div>
    </form>
  );
}
