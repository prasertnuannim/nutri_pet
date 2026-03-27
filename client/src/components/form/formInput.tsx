import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
};

const FormInput = ({
  name,
  type,
  label,
  defaultValue,
  placeholder,
  error,
}: FormInputProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-2">
      {label && (
        <Label htmlFor={name} className="p-1">
          {t(label, { defaultValue: label })}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder ? t(placeholder, { defaultValue: placeholder }) : undefined}
        defaultValue={defaultValue}
      />
      {error && (
        <p className="text-destructive text-sm">{t(error, { defaultValue: error })}</p>
      )}
    </div>
  );
};

export default FormInput;
