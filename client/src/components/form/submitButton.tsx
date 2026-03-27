"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type SubmitButtonProps = {
  text: string;
  className?: string;
  isPending: boolean;
};

export function SubmitButton({
  text,
  className,
  isPending = false,
}: SubmitButtonProps) {
  const { t } = useTranslation();
  const busy = !!isPending;

  return (
    <Button
      type="submit"
      disabled={busy}
      aria-busy={busy}
      className={[
        "w-full rounded-md py-2 font-semibold transition duration-300",
        busy
          ? "cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted"
          : "",
        className ?? "",
      ].join(" ")}
    >
      {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {busy ? t("common.status.processing") : t(text, { defaultValue: text })}
    </Button>
  );
}
