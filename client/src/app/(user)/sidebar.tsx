"use client";

import clsx from "clsx";
import {
  BarChart3,
  ClipboardList,
  LogOut,
  Settings,
  ShieldPlus,
  type LucideIcon,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LogoutButton } from "@/components/auth/logoutButton";
import { useSidebar } from "@/context/sidebar-context";
import { userNavigationItems, userWorkspace } from "./navigation";

type SidebarProfile = {
  name: string;
  email: string | null;
  role: string | null;
  image: string | null;
};

type SidebarSectionKey = "user" | "owner" | "admin";

type SidebarNavigationItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
};

const OWNER_NAVIGATION_PATHS = new Set(["/formulas"]);

const adminNavigationItems: SidebarNavigationItem[] = [
  {
    href: "/account",
    labelKey: "adminShell.accounts",
    icon: Users,
  },
  {
    href: "/settings",
    labelKey: "adminShell.settings",
    icon: Settings,
  },
  {
    href: "/statistics",
    labelKey: "adminShell.statistics",
    icon: BarChart3,
  },
  {
    href: "/audit",
    labelKey: "adminShell.audit",
    icon: ClipboardList,
  },
];

export default function Sidebar({ profile }: { profile: SidebarProfile | null }) {
  const { open } = useSidebar();
  const { t } = useTranslation();
  const brand = t(userWorkspace.brandKey);
  const displayName = profile?.name ?? t("userShell.profile.defaultName");
  const normalizedRole = profile?.role?.trim().toLowerCase() ?? null;
  const isAdmin = normalizedRole === "admin";
  const isOwner = normalizedRole === "owner";
  const homeHref = isOwner ? "/formulas" : "/dashboard";
  const pathname = usePathname() ?? homeHref;
  const profileMeta =
    profile?.email ??
    (normalizedRole === "admin"
      ? t("accountForm.roleAdmin")
      : normalizedRole === "user"
        ? t("accountForm.roleUser")
        : normalizedRole === "owner"
          ? t("accountForm.roleOwner")
        : profile?.role) ??
    t("userShell.profile.defaultMeta");
  const userSectionItems = userNavigationItems.filter(
    (item) => !OWNER_NAVIGATION_PATHS.has(item.href)
  );
  const ownerSectionItems = userNavigationItems.filter((item) =>
    OWNER_NAVIGATION_PATHS.has(item.href)
  );
  const navigationSections: Array<{
    key: SidebarSectionKey;
    label: string;
    items: SidebarNavigationItem[];
  }> = [
    {
      key: "user",
      label: t("accountForm.roleUser"),
      items: userSectionItems,
    },
    {
      key: "owner",
      label: t("accountForm.roleOwner"),
      items: ownerSectionItems,
    },
    {
      key: "admin",
      label: t("accountForm.roleAdmin"),
      items: adminNavigationItems,
    },
  ].filter((section) => {
    if (section.key === "admin") {
      return isAdmin;
    }

    if (section.key === "user") {
      return !isOwner;
    }

    return section.items.length > 0;
  });

  return (
    <aside
      className={clsx(
        "sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300",
        open ? "w-[228px]" : "w-[88px]"
      )}
    >
      <div
        className={clsx(
          "flex h-16 shrink-0 items-center border-b border-border px-4",
          open ? "gap-3" : "justify-center px-3"
        )}
      >
        <Link
          href={homeHref}
          aria-label={brand}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm"
        >
          <ShieldPlus className="h-5 w-5" />
        </Link>

        {open ? (
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-foreground">
              {brand}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {t(userWorkspace.subtitleKey)}
            </p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="divide-y divide-border">
          {navigationSections.map((section) => (
            <div key={section.key} className="space-y-1.5 py-4 first:pt-0 last:pb-0">
              {open ? (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {section.label}
                </p>
              ) : null}

              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={t(item.labelKey)}
                    className={clsx(
                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      open ? "gap-3" : "justify-center",
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {open ? (
                      <span className="truncate">{t(item.labelKey)}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-3">
        {open ? (
          <div className="mb-3 rounded-2xl border border-border bg-background/70 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profileMeta}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <LogoutButton
          callbackUrl="/"
          icon={<LogOut className="h-[18px] w-[18px]" />}
          showText={open}
          text={t("userShell.actions.signOut")}
          variant="unstyled"
          className={clsx(
            "flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            open ? "justify-start gap-2" : "justify-center"
          )}
        />
      </div>
    </aside>
  );
}
