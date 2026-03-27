"use client";

import {
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/i18n/language-switcher";
import ColorThemeSwitcher from "@/components/theme/color-theme-switcher";
import { useSidebar } from "@/context/sidebar-context";

type PageMeta = {
  labelKey: string;
  badgeKey: string;
  sectionKey: string;
};

export default function Navbar() {
  const { open, toggle } = useSidebar();
  const pathname = usePathname() ?? "";
  const page = getPageMeta(pathname);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-5 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <span className="truncate text-sm font-medium text-muted-foreground">
            {t("adminShell.appName")}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-semibold text-foreground">
            {t(page.labelKey)}
          </span>
        </div>

        <span className="hidden items-center gap-2 rounded-lg bg-primary-soft px-3 py-1 text-xs font-medium text-primary md:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("adminShell.workspaceBadge", { badge: t(page.badgeKey) })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {page.sectionKey ? (
          <div className="hidden text-sm font-medium text-muted-foreground lg:block">
            {t(page.sectionKey)}
          </div>
        ) : null} 
        <LanguageSwitcher className="shrink-0" />
        <ColorThemeSwitcher className="shrink-0" />
      </div>
    </header>
  );
}

function getPageMeta(pathname: string): PageMeta {
  if (pathname.startsWith("/account")) {
    return {
      labelKey: "adminShell.pages.account.label",
      badgeKey: "adminShell.pages.account.badge",
      sectionKey: "adminShell.pages.account.section",
    };
  }

  if (pathname.startsWith("/settings")) {
    return {
      labelKey: "adminShell.pages.settings.label",
      badgeKey: "adminShell.pages.settings.badge",
      sectionKey: "adminShell.pages.settings.section",
    };
  }

  if (pathname === "/statistics/daily") {
    return {
      labelKey: "adminShell.pages.statisticsDaily.label",
      badgeKey: "adminShell.pages.statisticsDaily.badge",
      sectionKey: "adminShell.pages.statisticsDaily.section",
    };
  }

  if (pathname === "/statistics/monthly") {
    return {
      labelKey: "adminShell.pages.statisticsMonthly.label",
      badgeKey: "adminShell.pages.statisticsMonthly.badge",
      sectionKey: "adminShell.pages.statisticsMonthly.section",
    };
  }

  if (pathname === "/statistics/yearly") {
    return {
      labelKey: "adminShell.pages.statisticsYearly.label",
      badgeKey: "adminShell.pages.statisticsYearly.badge",
      sectionKey: "adminShell.pages.statisticsYearly.section",
    };
  }

  if (pathname.startsWith("/statistics")) {
    return {
      labelKey: "adminShell.pages.statistics.label",
      badgeKey: "adminShell.pages.statistics.badge",
      sectionKey: "adminShell.pages.statistics.section",
    };
  }

  if (pathname.startsWith("/audit")) {
    return {
      labelKey: "adminShell.pages.audit.label",
      badgeKey: "adminShell.pages.audit.badge",
      sectionKey: "adminShell.pages.audit.section",
    };
  }

  if (pathname.startsWith("/dashboard")) {
    return {
      labelKey: "adminShell.pages.dashboard.label",
      badgeKey: "adminShell.pages.dashboard.badge",
      sectionKey: "adminShell.pages.dashboard.section",
    };
  }

  return {
    labelKey: "adminShell.pages.default.label",
    badgeKey: "adminShell.pages.default.badge",
    sectionKey: "adminShell.pages.default.section",
  };
}
