import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type SectionPlaceholderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function SectionPlaceholder({
  title,
  description,
  icon: Icon,
}: SectionPlaceholderProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm shadow-black/5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t(title, { defaultValue: title })}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t(description, { defaultValue: description })}
          </p>
        </div>
      </div>
    </section>
  );
}
