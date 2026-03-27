import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { normalizeAccessRole, AccessRole } from "@/lib/auth/accessRole";
import { decodeSharedJwt } from "@/services/auth/jwtCodec";
import {
  ACCESS_RULES,
  matchProtectedPath,
  resolveAccessRedirectPath,
} from "@/services/auth/accessControl";

const COOKIE_CANDIDATES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
];

function getNumericClaim(token: unknown, key: string): number | undefined {
  if (!token || typeof token !== "object") return undefined;

  const claimValue = (token as Record<string, unknown>)[key];
  return typeof claimValue === "number" ? claimValue : undefined;
}

const THAI_TIME_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function toThaiTime(seconds?: number): string | undefined {
  if (typeof seconds !== "number") return undefined;
  return THAI_TIME_FORMATTER.format(new Date(seconds * 1000));
}

function isSessionExpired(token: unknown): boolean {
  const nowSeconds = Math.floor(Date.now() / 1000);

  const refreshTokenExp = getNumericClaim(token, "refreshTokenExp");
  if (typeof refreshTokenExp === "number" && nowSeconds >= refreshTokenExp) {
    return true;
  }

  const jwtSessionExp = getNumericClaim(token, "exp");
  if (typeof jwtSessionExp === "number" && nowSeconds >= jwtSessionExp) {
    return true;
  }

  return false;
}

function getRoleFromToken(token: unknown): string | undefined {
  if (!token || typeof token !== "object") return undefined;

  const directRole = (token as { role?: unknown }).role;
  if (typeof directRole === "string") return directRole;

  const nestedUser = (token as { user?: unknown }).user;
  if (!nestedUser || typeof nestedUser !== "object") return undefined;

  const nestedRole = (nestedUser as { role?: unknown }).role;
  return typeof nestedRole === "string" ? nestedRole : undefined;
}

function getMustChangePasswordFromToken(token: unknown): boolean {
  if (!token || typeof token !== "object") return false;

  const nestedUser = (token as { user?: unknown }).user;
  if (!nestedUser || typeof nestedUser !== "object") return false;

  const mustChangePassword = (nestedUser as { mustChangePassword?: unknown })
    .mustChangePassword;
  return mustChangePassword === true;
}

async function readToken(req: NextRequest, secret: string) {
  let token = await getToken({ req, secret, decode: decodeSharedJwt });
  if (token) return token;

  for (const cookieName of COOKIE_CANDIDATES) {
    token = await getToken({
      req,
      secret,
      decode: decodeSharedJwt,
      cookieName,
      secureCookie: cookieName.startsWith("__Secure-"),
    });
    if (token) return token;
  }
  return null;
}

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("Missing JWT_ACCESS_SECRET");

  const matched = matchProtectedPath(pathname);

  const token = await readToken(req, secret);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const accessTokenExp = getNumericClaim(token, "accessTokenExp");
  const jwtSessionExp = getNumericClaim(token, "exp");
  const refreshTokenExp = getNumericClaim(token, "refreshTokenExp");
  const accessTokenExpired =
    typeof accessTokenExp === "number" && nowSeconds >= accessTokenExp;
  const sessionExpired = token ? isSessionExpired(token) : false;
  if (token) {
    console.log("[proxy] token-exp", {
      pathname,
      nowSeconds,
      nowThai: toThaiTime(nowSeconds),
      accessTokenExpired,
      sessionExpired,
      accessTokenExp,
      accessTokenExpThai: toThaiTime(accessTokenExp),
      jwtSessionExp,
      jwtSessionExpThai: toThaiTime(jwtSessionExp),
      refreshTokenExp,
      refreshTokenExpThai: toThaiTime(refreshTokenExp),
    });
  }

  const tokenRole = sessionExpired ? undefined : getRoleFromToken(token);
  const role = normalizeAccessRole(tokenRole) ?? AccessRole.Guest;
  const mustChangePassword = !sessionExpired && getMustChangePasswordFromToken(token);
  const isChangePasswordPath =
    pathname === "/change-password" || pathname.startsWith("/change-password/");

  if (!matched) {
    if (token && mustChangePassword && !isChangePasswordPath) {
      return NextResponse.redirect(new URL("/change-password", nextUrl.origin));
    }

    if (isChangePasswordPath && role !== AccessRole.Guest && !mustChangePassword) {
      return NextResponse.redirect(
        new URL(resolveAccessRedirectPath(role), nextUrl.origin),
      );
    }

    if (pathname === "/" && role !== AccessRole.Guest) {
      const redirectPath = mustChangePassword
        ? "/change-password"
        : resolveAccessRedirectPath(role);
     
      if (redirectPath && redirectPath !== "/") {
        return NextResponse.redirect(new URL(redirectPath, nextUrl.origin));
      }
    }
    return NextResponse.next();
  }

  if (!token || sessionExpired) {
    if (token) {
      console.log("[proxy] token-expired", {
        pathname,
        nowSeconds,
        nowThai: toThaiTime(nowSeconds),
        accessTokenExpired,
        sessionExpired,
        accessTokenExp,
        accessTokenExpThai: toThaiTime(accessTokenExp),
        jwtSessionExp,
        jwtSessionExpThai: toThaiTime(jwtSessionExp),
        refreshTokenExp,
        refreshTokenExpThai: toThaiTime(refreshTokenExp),
      });
    }
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  const allowed = ACCESS_RULES[matched];
  if (!allowed.includes(role)) {
    const fallback = resolveAccessRedirectPath(role);
    return NextResponse.redirect(new URL(fallback ?? "/", nextUrl.origin));
  }

  if (mustChangePassword && !isChangePasswordPath) {
    return NextResponse.redirect(new URL("/change-password", nextUrl.origin));
  }

  if (isChangePasswordPath && !mustChangePassword) {
    return NextResponse.redirect(
      new URL(resolveAccessRedirectPath(role), nextUrl.origin),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
