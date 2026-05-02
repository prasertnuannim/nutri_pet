"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/app/(admin)/sidebar";
import UserSidebar from "@/app/(user)/sidebar";
import { SidebarProvider } from "@/context/sidebar-context";
import { AccessRole } from "@/lib/auth/accessRole";

type AppShellProfile = {
  name: string;
  email: string | null;
  role: string | null;
  image: string | null;
};

type RootAppShellProps = {
  children: React.ReactNode;
  profile: AppShellProfile | null;
  role: AccessRole | null;
};

const ADMIN_SIDEBAR_PATHS = [
  "/admin",
  "/account",
  "/audit",
  "/settings",
  "/statistics",
] as const;

const USER_SIDEBAR_PATHS = [
  "/dashboard",
  "/pets",
  "/orders",
  "/formulas",
] as const;

function matchesSidebarPath(
  pathname: string,
  routes: readonly string[],
): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function resolveSidebarVariant(
  pathname: string,
  role: AccessRole | null,
): "admin" | "user" | null {
  if (!role) {
    return null;
  }

  if (
    pathname === "/change-password" || pathname.startsWith("/change-password/")
  ) {
    return null;
  }

  const isAdminRoute = matchesSidebarPath(pathname, ADMIN_SIDEBAR_PATHS);
  const isUserRoute = matchesSidebarPath(pathname, USER_SIDEBAR_PATHS);

  if (role === AccessRole.Admin) {
    if (isAdminRoute || isUserRoute) {
      return "admin";
    }
  }

  if (role === AccessRole.User) {
    if (isUserRoute) {
      return "user";
    }
  }

  return null;
}

export default function RootAppShell({
  children,
  profile,
  role,
}: RootAppShellProps) {
  const pathname = usePathname() ?? "/";
  const sidebarVariant = resolveSidebarVariant(pathname, role);

  if (!sidebarVariant) {
    return <>{children}</>;
  }

  const Sidebar = sidebarVariant === "admin" ? AdminSidebar : UserSidebar;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar profile={profile} />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}
