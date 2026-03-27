"use client";

import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  confirmClassName?: string;
  onConfirm?: () => Promise<void> | void;
};

export function ConfirmDialog({
  trigger,
  title = "dialog.confirm.title",
  description = "dialog.confirm.description",
  confirmText = "common.actions.confirm",
  confirmClassName,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsPending(true);
      await onConfirm?.();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(title, { defaultValue: title })}</DialogTitle>
          <DialogDescription>
            {t(description, { defaultValue: description })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("common.actions.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={confirmClassName}
          >
            {isPending
              ? t("common.status.processing")
              : t(confirmText, { defaultValue: confirmText })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
