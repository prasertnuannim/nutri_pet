type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  name: string;
  value: T | "";
  options: Option<T>[];
  setFieldValue: (field: string, value: unknown) => void;
};

export function RadioGroupInline<T extends string>({
  name,
  value,
  options,
  setFieldValue,
}: Props<T>) {
  return (
    <div className="flex flex-wrap gap-6 pt-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => setFieldValue(name, option.value)}
            className="h-4 w-4 accent-primary"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
