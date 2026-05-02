import {
  ClipboardList,
  LayoutDashboard,
  SlidersHorizontal,
  type LucideIcon,
  Users,
} from "lucide-react";

export type UserNavigationItem = {
  href: string;
  labelKey: string;
  breadcrumbKey: string;
  icon: LucideIcon;
};

export const userWorkspace = {
  brandKey: "userShell.workspace.brand",
  shortNameKey: "userShell.workspace.shortName",
  subtitleKey: "userShell.workspace.subtitle",
  clinicKey: "userShell.workspace.clinic",
  departmentKey: "userShell.workspace.department",
};

export const userNavigationItems: UserNavigationItem[] = [
  {
    href: "/dashboard",
    labelKey: "userShell.navigation.dashboard",
    breadcrumbKey: "userShell.navigation.dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/pets",
    labelKey: "userShell.navigation.pets",
    breadcrumbKey: "userShell.navigation.pets",
    icon: Users,
  },
  {
    href: "/orders",
    labelKey: "userShell.navigation.orders",
    breadcrumbKey: "userShell.navigation.orders",
    icon: ClipboardList,
  },
  {
    href: "/formulas",
    labelKey: "userShell.navigation.formulaSettings",
    breadcrumbKey: "userShell.navigation.formulaSettings",
    icon: SlidersHorizontal,
  },
];

export function getCurrentUserNavItem(pathname: string): UserNavigationItem {
  return (
    userNavigationItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) ?? userNavigationItems[0]
  );
}
