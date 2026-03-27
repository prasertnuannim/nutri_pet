import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  points: string;
};

export function RadioCard({
  selected,
  onClick,
  icon,
  title,
  points,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[128px] w-full flex-col items-center justify-center rounded-xl border bg-card p-5 text-center transition",
        selected
          ? "border-primary ring-2 ring-primary/10"
          : "border-border hover:border-primary/30"
      )}
    >
      <div className="mb-3 text-primary">{icon}</div>
      <div className="font-semibold text-foreground">{title}</div>
      <div className="text-sm text-muted-foreground">{points}</div>
    </button>
  );
}
