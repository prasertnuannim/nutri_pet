"use client";

import clsx from "clsx";
import { LogOut, ShieldPlus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LogoutButton } from "@/components/auth/logoutButton";
import { useSidebar } from "@/context/sidebar-context";
import {
  getCurrentUserNavItem,
  userNavigationItems,
  userWorkspace,
} from "./navigation";

type SidebarProfile = {
  name: string;
  email: string | null;
  role: string | null;
  image: string | null;
};

export default function Sidebar({ profile }: { profile: SidebarProfile | null }) {
  const { open } = useSidebar();
  const pathname = usePathname() ?? "/dashboard";
  const activeItem = getCurrentUserNavItem(pathname);
  const { t } = useTranslation();
  const brand = t(userWorkspace.brandKey);
  const displayName = profile?.name ?? t("userShell.profile.defaultName");
  const profileMeta =
    profile?.email ??
    (profile?.role === "admin"
      ? t("accountForm.roleAdmin")
      : profile?.role === "user"
        ? t("accountForm.roleUser")
        : profile?.role) ??
    t("userShell.profile.defaultMeta");

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
          href="/dashboard"
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
        <div className="space-y-1.5">
          {userNavigationItems.map((item) => {
            const isActive = activeItem.href === item.href;
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
