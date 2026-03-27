"use server";

import { goApiFetch } from "@/lib/auth/goApi";
import { changePasswordSchema } from "@/lib/validators/auth";
import { getAuthSession } from "@/services/auth/session";
import { PasswordChangeFormState } from "@/types/auth.type";

const CHANGE_PASSWORD_FAILURE_MESSAGE =
  "errors.changePassword.failed";

export async function changePasswordAction(
  _prevState: unknown,
  formData: FormData,
): Promise<PasswordChangeFormState> {
  const session = await getAuthSession();

  if (!session?.user?.id || !session.accessToken) {
    return {
      errors: {
        general: "errors.shared.unauthorized",
      },
    };
  }

  const raw = {
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: PasswordChangeFormState["errors"] = {};

    parsed.error.issues.forEach((err) => {
      const field =
        err.path[0] as keyof NonNullable<PasswordChangeFormState["errors"]>;
      errors[field] = err.message;
    });

    return {
      errors,
      values: raw,
    };
  }

  try {
    const res = await goApiFetch("/auth/change-password", {
      method: "POST",
      accessToken: session.accessToken,
      body: JSON.stringify({
        new_password: parsed.data.newPassword,
      }),
    });

    if (!res.ok) {
      let message = CHANGE_PASSWORD_FAILURE_MESSAGE;
      const body = await res.text();
      const contentType = res.headers.get("content-type") ?? "";

      if (body) {
        if (contentType.includes("application/json")) {
          try {
            const data = JSON.parse(body) as {
              error?: string;
              message?: string;
            };
            message = data.message ?? data.error ?? CHANGE_PASSWORD_FAILURE_MESSAGE;
          } catch {
            message = body.trim() || CHANGE_PASSWORD_FAILURE_MESSAGE;
          }
        } else {
          message = body.trim() || CHANGE_PASSWORD_FAILURE_MESSAGE;
        }
      }

      return {
        errors: { general: message },
        values: raw,
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      errors: { general: "errors.shared.unableReachServer" },
      values: raw,
    };
  }
}
