"use client";

import { type FormEvent, useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { SubmitButton } from "@/components/form/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormState } from "@/types/auth.type";
import FormAlert from "@/components/form/formAlert";
import { loginSchema } from "@/lib/validators/auth";

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const initialState: LoginFormState = {
    errors: {},
    values: { email: "user@example.com", password: "user123" },
    //values: { email: "admin@example.com", password: "Admin1234" },
  };

  const [state, setState] = useState<LoginFormState>(initialState);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const raw = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      const errors: LoginFormState["errors"] = {};
      parsed.error.issues.forEach((err) => {
        const field = err.path[0] as keyof NonNullable<LoginFormState["errors"]>;
        errors[field] = err.message;
      });

      setState({
        errors,
        values: {
          email: raw.email,
          password: raw.password,
        },
      });
      return;
    }

    try {
      setIsPending(true);
      setState((prev) => ({
        ...prev,
        errors: {},
      }));

      const result = await signIn("credentials", {
        redirect: false,
        email: parsed.data.email,
        password: parsed.data.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        setState({
          errors: { general: "loginForm.invalidCredentials" },
          values: { email: parsed.data.email },
        });
        return;
      }

      router.push(result?.url ?? "/");
      router.refresh();
    } catch {
      setState({
        errors: { general: "loginForm.unableLogin" },
        values: { email: parsed.data.email },
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          {t("loginForm.eyebrow")}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("loginForm.description")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
            {t("loginForm.emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("loginForm.emailPlaceholder")}
              defaultValue={state.values?.email}
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

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-foreground">
            {t("loginForm.passwordLabel")}
          </Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("loginForm.passwordPlaceholder")}
              defaultValue={state.values?.password}
              autoComplete="current-password"
              aria-invalid={Boolean(state.errors?.password)}
              className="h-12 rounded-2xl border-border bg-background pl-11 pr-4 text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
          {state.errors?.password ? (
            <p className="text-sm font-medium text-destructive">
              {t(state.errors.password, { defaultValue: state.errors.password })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <SubmitButton
          text="loginForm.signIn"
          isPending={isPending}
          className="h-12 rounded-2xl shadow-[0_14px_30px_rgba(15,23,42,0.14)]"
        />

        {state.errors?.general && (
          <FormAlert
            variant="error"
            title="loginForm.failedTitle"
            message={state.errors?.general}
          />
        )}
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        {t("loginForm.footer")}
      </p>
    </form>
  );
}
