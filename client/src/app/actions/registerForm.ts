"use server";

import { registerSchema } from "@/lib/validators/auth";
import { AuthFormState } from "@/types/auth.type";

const REGISTER_FAILURE_MESSAGE = "errors.register.failed";

export async function registerUser(
  _prevState: unknown,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    tenant: String(formData.get("tenant") ?? ""),
    promotion: String(formData.get("promotion") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: AuthFormState["errors"] = {};

    parsed.error.issues.forEach((err) => {
      const field = err.path[0] as keyof NonNullable<AuthFormState["errors"]>;
      errors[field] = err.message;
    });

    return {
      errors,
      values: {
        name: raw.name,
        email: raw.email,
        tenant: raw.tenant,
        promotion: raw.promotion,
      },
    };
  }

  try {
    const res = await fetch(`${process.env.GO_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        tenant: parsed.data.tenant,
        promotion: parsed.data.promotion,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      let message = REGISTER_FAILURE_MESSAGE;
      const body = await res.text();
      const contentType = res.headers.get("content-type") ?? "";

      if (body) {
        if (contentType.includes("application/json")) {
          try {
            const data = JSON.parse(body) as {
              error?: string;
              message?: string;
            };
            message = data.message ?? data.error ?? REGISTER_FAILURE_MESSAGE;
          } catch {
            message = body.trim() || REGISTER_FAILURE_MESSAGE;
          }
        } else {
          message = body.trim() || REGISTER_FAILURE_MESSAGE;
        }
      }

      return {
        errors: { general: message },
        values: {
          name: parsed.data.name,
          email: parsed.data.email,
          tenant: parsed.data.tenant,
          promotion: parsed.data.promotion,
        },
      };
    }

    return {
      success: true,
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
        tenant: parsed.data.tenant,
        promotion: parsed.data.promotion,
      },
    };
  } catch {
    return {
      errors: { general: "errors.shared.unableReachServer" },
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
        tenant: parsed.data.tenant,
        promotion: parsed.data.promotion,
      },
    };
  }
}
