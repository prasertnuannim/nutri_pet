import { cache } from "react";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/services/auth";
import { decodeSharedJwt } from "@/services/auth/jwtCodec";

const SESSION_COOKIE_CANDIDATES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
  "__Secure-authjs.session-token",
  "authjs.session-token",
] as const;

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function resolveAuthSecret(): string {
  if (typeof authOptions.secret === "string" && authOptions.secret.length > 0) {
    return authOptions.secret;
  }

  const envSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (envSecret) {
    return envSecret;
  }

  throw new Error("Missing NextAuth secret");
}

function readChunkedCookieValue(cookieStore: CookieStore, baseName: string): string | null {
  const chunkedCookies = cookieStore
    .getAll()
    .filter((cookie) => {
      if (!cookie.name.startsWith(`${baseName}.`)) {
        return false;
      }

      const chunkIndex = Number.parseInt(cookie.name.slice(baseName.length + 1), 10);
      return Number.isInteger(chunkIndex);
    })
    .sort((a, b) => {
      const aIndex = Number.parseInt(a.name.slice(baseName.length + 1), 10);
      const bIndex = Number.parseInt(b.name.slice(baseName.length + 1), 10);
      return aIndex - bIndex;
    });

  if (chunkedCookies.length > 0) {
    return chunkedCookies.map((cookie) => cookie.value).join("");
  }

  return cookieStore.get(baseName)?.value ?? null;
}

async function hasValidSessionCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const secret = resolveAuthSecret();

  for (const cookieName of SESSION_COOKIE_CANDIDATES) {
    const sessionToken = readChunkedCookieValue(cookieStore, cookieName);
    if (!sessionToken) {
      continue;
    }

    const decodedToken = await decodeSharedJwt({
      token: sessionToken,
      secret,
    });

    if (decodedToken) {
      return true;
    }
  }

  return false;
}

export const getAuthSession = cache(async () => {
  if (authOptions.session?.strategy !== "jwt") {
    return getServerSession(authOptions);
  }

  // In RSC, next-auth cannot reliably clear an invalid session cookie after decode
  // failure, so avoid calling into that error path when the raw JWT is already invalid.
  if (!(await hasValidSessionCookie())) {
    return null;
  }

  return getServerSession(authOptions);
});
