"use client";

import { useTranslation } from "react-i18next";

type Props = {
  message?: string;
  title?: string;
  variant?: "error" | "success" | "info" | "warning";
  className?: string;
};

const styles = {
  error:
    "border-destructive/20 bg-destructive/10 text-destructive",
  success:
    "border-primary/20 bg-primary-soft text-primary",
  info: "border-primary/20 bg-primary-soft text-primary",
  warning:
    "border-warning/20 bg-warning-soft text-warning",
};

export default function FormAlert({
  message,
  title,
  variant = "error",
  className = "",
}: Props) {
  const { t } = useTranslation();

  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-md border px-3 py-2 text-sm shadow-sm ${styles[variant]} ${className}`}
    >
      <div className="flex flex-col items-center-safe">
        {title ? (
          <div className="mb-0.5 font-semibold">
            {t(title, { defaultValue: title })}
          </div>
        ) : null}
        <p>{t(message, { defaultValue: message })}</p>
      </div>
    </div>
  );
}
