"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/i18n/language-switcher";
import { useSidebar } from "@/context/sidebar-context";
import { getCurrentUserNavItem, userWorkspace } from "./navigation";

export default function Navbar() {
  const pathname = usePathname() ?? "/dashboard";
  const { toggle, open } = useSidebar();
  const currentItem = getCurrentUserNavItem(pathname);
  const { t } = useTranslation();
  const shortName = t(userWorkspace.shortNameKey);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-3">
        <button
          onClick={toggle}
          type="button"
          aria-label={
            open
              ? t("userShell.actions.collapseNavigation")
              : t("userShell.actions.expandNavigation")
          }
          aria-pressed={open}
          className="group inline-flex cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary active:bg-primary-soft"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              open ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {open ? (
              <PanelLeftClose className="h-4.5 w-4.5" />
            ) : (
              <PanelLeftOpen className="h-4.5 w-4.5" />
            )}
          </span>
        </button>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
                <span className="truncate text-muted-foreground">
                  {shortName}
                </span>
                <span className="text-border">/</span>
                <span className="truncate text-foreground">
                  {t(currentItem.breadcrumbKey)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher className="shrink-0" />
          {/* <span className="hidden items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            <Building2 className="h-3.5 w-3.5" />
            {t(userWorkspace.clinicKey)}
            {" · "}
            {t(userWorkspace.departmentKey)}
          </span> */}
        </div>
        
      </div>
    </header>
  );
}
