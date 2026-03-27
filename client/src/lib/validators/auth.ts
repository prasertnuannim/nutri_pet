import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "validation.auth.nameRequired"),
    email: z.string().email("validation.auth.emailInvalid"),
    tenant: z.string().trim().optional().default(""),
    promotion: z.string().trim().optional().default(""),
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "validation.auth.passwordMin"),
    confirmPassword: z
      .string()
      .min(1, "validation.auth.confirmPasswordRequired"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "validation.auth.passwordMismatch",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "validation.auth.emailRequired")
    .email("validation.auth.emailInvalid"),
  password: z.string().min(1, "validation.auth.passwordRequired"),
});
