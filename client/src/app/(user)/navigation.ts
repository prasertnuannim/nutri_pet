import {
  ClipboardList,
  Factory,
  LayoutDashboard,
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
    href: "/factory",
    labelKey: "userShell.navigation.factory",
    breadcrumbKey: "userShell.navigation.factory",
    icon: Factory,
  },
];

export function getCurrentUserNavItem(pathname: string): UserNavigationItem {
  return (
    userNavigationItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    ) ?? userNavigationItems[0]
  );
}
