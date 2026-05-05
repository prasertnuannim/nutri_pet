import { AccessRole } from "@/lib/auth/accessRole";

export const ACCESS_RULES: Record<string, AccessRole[]> = {
  "/account": [AccessRole.Admin],
  "/admin": [AccessRole.Admin],
  "/audit": [AccessRole.Admin],
  "/change-password": [
    AccessRole.Admin,
    AccessRole.User,
    AccessRole.Doctor,
    AccessRole.Nurse,
  ],
  "/dashboard": [AccessRole.Admin, AccessRole.User],
  "/pets": [AccessRole.Admin, AccessRole.User],
  "/orders": [AccessRole.Admin, AccessRole.User],
  "/formulas": [AccessRole.Admin, AccessRole.User],
  "/food-stock": [AccessRole.Admin],
  "/settings": [AccessRole.Admin],
  "/statistics": [AccessRole.Admin],
  "/doctor": [AccessRole.Doctor],
  "/nurse": [AccessRole.Nurse],
};

const ROLE_REDIRECT_RULES: Record<AccessRole, string> = {
  [AccessRole.Admin]: "/dashboard",
  [AccessRole.User]: "/dashboard",
  [AccessRole.Doctor]: "/doctor",
  [AccessRole.Nurse]: "/schedule",
  [AccessRole.Guest]: "/",
};

export function matchProtectedPath(pathname: string): string | undefined {
  return Object.keys(ACCESS_RULES)
    .sort((a, b) => b.length - a.length) // กัน route ซ้อน
    .find(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );
}

export function resolveAccessRedirectPath(role?: AccessRole | null): string {
  return ROLE_REDIRECT_RULES[role ?? AccessRole.Guest] ?? "/";
}
