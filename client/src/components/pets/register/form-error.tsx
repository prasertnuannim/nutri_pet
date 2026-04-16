import { useTranslation } from "react-i18next";
import { ErrorMessage } from "formik";

export function FormError({ name }: { name: string }) {
  const { t } = useTranslation();

  return (
    <ErrorMessage
      name={name}
      render={(msg) => (
        <p className="mt-1 text-sm text-red-600">
          {t(msg, { defaultValue: msg })}
        </p>
      )}
    />
  );
}
