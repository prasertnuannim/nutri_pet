"use client";

import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { FaSignOutAlt } from "react-icons/fa";
import clsx from "clsx";
import type { ReactNode } from "react";

type LogoutButtonProps = {
  callbackUrl?: string;
  className?: string;
  showText?: boolean;
  text?: string;
  icon?: ReactNode;
  iconClassName?: string;
  variant?: "danger" | "ghost" | "unstyled";
};

export function LogoutButton({
  callbackUrl = "/",
  className,
  showText = false,
  text = "common.actions.signOut",
  icon,
  iconClassName,
  variant = "danger",
}: LogoutButtonProps) {
  const { t } = useTranslation();
  const handleClick = async () => {
    await signOut({ callbackUrl });
  };

  const variantClassName =
    variant === "danger"
      ? "bg-destructive text-white hover:bg-destructive/90"
      : variant === "ghost"
        ? "bg-transparent text-foreground/80 hover:bg-muted hover:text-foreground"
        : "";

  return (
    <TooltipButton
      label={t(text, { defaultValue: text })}
      onClick={handleClick}
      className={clsx(
        "px-2 py-1 rounded flex items-center gap-2",
        variantClassName,
        className
      )}
    >
      {icon ?? <FaSignOutAlt className={iconClassName} />}
      {showText ? (
        <span className="text-sm">{t(text, { defaultValue: text })}</span>
      ) : null}
    </TooltipButton>
  );
}
