"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  LogOut,
  PawPrint,
  Settings,
  User,
} from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LogoutButton } from "@/components/auth/logoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/context/sidebar-context";

export type AppShellProfile = {
  name: string;
  email: string | null;
  role: string | null;
  image: string | null;
};

export default function Sidebar({
  profile,
}: {
  profile: AppShellProfile | null;
}) {
  const { open } = useSidebar();
  const pathname = usePathname() ?? "";
  const { t } = useTranslation();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const isStatisticsActive =
    pathname === "/statistics" || pathname.startsWith("/statistics");
  const avatarSrc =
    profile?.image && profile.image.trim().length > 0 ? profile.image : undefined;

  useEffect(() => {
    if (isStatisticsActive) {
      setSubmenuOpen(true);
    }
  }, [isStatisticsActive]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setSubmenuOpen(false);
      }
    }

    if (!open && submenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, submenuOpen]);

  return (
    <aside
      className={clsx(
        "sticky top-0 z-40 flex h-dvh flex-col border-r border-border bg-card transition-[width] duration-300",
        open ? "w-56" : "w-20",
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-3 border-b border-border py-5",
          open ? "px-4" : "justify-center px-2",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <PawPrint size={18} />
        </div>
        {open ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {t("adminShell.sidebarTitle")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("adminShell.sidebarSubtitle")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="relative flex-1 overflow-y-auto px-3 py-4">
        {open ? (
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t("adminShell.workspaceLabel")}
          </p>
        ) : null}

        <nav className="space-y-1">
          <MenuLink
            href="/account"
            icon={<User size={18} />}
            label={t("adminShell.accounts")}
            active={pathname.startsWith("/account")}
            open={open}
          />

          <MenuLink
            href="/settings"
            icon={<Settings size={18} />}
            label={t("adminShell.settings")}
            active={pathname.startsWith("/settings")}
            open={open}
          />

          <button
            type="button"
            onClick={() => setSubmenuOpen((prev) => !prev)}
            className={clsx(
              "flex w-full items-center rounded-xl py-2.5 text-sm font-medium transition",
              open ? "gap-3 px-3" : "justify-center px-0",
              isStatisticsActive || submenuOpen
                ? "bg-primary-soft text-primary ring-1 ring-inset ring-primary/10"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <BarChart3 size={18} />
            {open ? (
              <>
                <span className="truncate">{t("adminShell.statistics")}</span>
                <ChevronDown
                  size={16}
                  className={clsx(
                    "ml-auto transition-transform",
                    submenuOpen && "rotate-180",
                  )}
                />
              </>
            ) : null}
          </button>

          <AnimatePresence initial={false}>
            {open && submenuOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-4 space-y-1 overflow-hidden border-l border-border pl-4"
              >
                <SubMenu />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <MenuLink
            href="/audit"
            icon={<ClipboardList size={18} />}
            label={t("adminShell.audit")}
            active={pathname.startsWith("/audit")}
            open={open}
          />
        </nav>

        <AnimatePresence>
          {!open && submenuOpen ? (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-20 top-36 w-48 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/5"
            >
              <SubMenu onSelect={() => setSubmenuOpen(false)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="border-t border-border p-3">
        {open ? (
          <div className="rounded-2xl border border-border bg-background/70 p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border bg-card">
                {avatarSrc ? (
                  <AvatarImage
                    src={avatarSrc}
                    alt={profile?.name ?? t("adminShell.guest")}
                  />
                ) : null}
                <AvatarFallback className="bg-primary-soft text-primary">
                  {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {profile?.name ?? t("adminShell.guest")}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile?.role ?? profile?.email ?? t("adminShell.workspaceMember")}
                </p>
              </div>
            </div>

            <LogoutButton
              callbackUrl="/"
              icon={<LogOut size={16} />}
              showText
              text="common.actions.signOut"
              variant="unstyled"
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-10 w-10 border border-border bg-card">
              {avatarSrc ? (
                <AvatarImage
                  src={avatarSrc}
                  alt={profile?.name ?? t("adminShell.guest")}
                />
              ) : null}
              <AvatarFallback className="bg-primary-soft text-primary">
                {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>

            <LogoutButton
              callbackUrl="/"
              icon={<LogOut size={18} />}
              text="common.actions.signOut"
              variant="unstyled"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            />
          </div>
        )}
      </div>
    </aside>
  );
}

function MenuLink({
  href,
  icon,
  label,
  active,
  open,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  open: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center rounded-xl py-2.5 text-sm font-medium transition",
        open ? "gap-3 px-3" : "justify-center px-0",
        active
          ? "bg-primary-soft text-primary ring-1 ring-inset ring-primary/10"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
      {open ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}

function SubMenu({ onSelect }: { onSelect?: () => void }) {
  const pathname = usePathname() ?? "";
  const { t } = useTranslation();

  return (
    <>
      <SubMenuItem
        href="/statistics/daily"
        label={t("adminShell.dailyReport")}
        active={pathname === "/statistics/daily"}
        onClick={onSelect}
      />
      <SubMenuItem
        href="/statistics/monthly"
        label={t("adminShell.monthlyKpi")}
        active={pathname === "/statistics/monthly"}
        onClick={onSelect}
      />
      <SubMenuItem
        href="/statistics/yearly"
        label={t("adminShell.yearlySummary")}
        active={pathname === "/statistics/yearly"}
        onClick={onSelect}
      />
    </>
  );
}

function SubMenuItem({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "block rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-primary-soft text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
