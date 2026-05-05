"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AccessRole } from "@/lib/auth/accessRole";
import { requirementService, type NutrientLimitPayload } from "@/services/requirementService";
import { withAuthAction, type AuthContext } from "@/services/security/safeAction";
import type { NutrientLimit, Requirement } from "@/types/requirement.type";

export type RequirementActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

const requirementIdSchema = z.object({
  requirementId: z.coerce.number().int().positive("Requirement id is invalid"),
});

const nutrientLimitIdSchema = requirementIdSchema.extend({
  limitId: z.coerce.number().int().positive("Limit id is invalid"),
});

const nutrientLimitPayloadSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  nutrient: z.string().trim().min(1, "Nutrient is required"),
  min_value: z.number().finite().nullable(),
  max_value: z.number().finite().nullable(),
});

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "errors.shared.unexpected";

const getRequirements = async (
  auth: AuthContext,
): Promise<RequirementActionResult<Requirement[]>> => {
  try {
    const requirements = await requirementService.getRequirements({
      accessToken: auth.accessToken,
    });
    return { success: true, data: requirements };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

const getNutrientLimits = async (
  auth: AuthContext,
  input: unknown,
): Promise<RequirementActionResult<NutrientLimit[]>> => {
  const parsed = requirementIdSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid requirement id",
    };
  }

  try {
    const limits = await requirementService.getNutrientLimits(parsed.data.requirementId, {
      accessToken: auth.accessToken,
    });
    return { success: true, data: limits };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

const createNutrientLimit = async (
  auth: AuthContext,
  input: unknown,
  payload: NutrientLimitPayload,
): Promise<RequirementActionResult<NutrientLimit>> => {
  const parsedId = requirementIdSchema.safeParse(input);
  if (!parsedId.success) {
    return {
      success: false,
      error: parsedId.error.issues[0]?.message ?? "Invalid requirement id",
    };
  }

  const parsedPayload = nutrientLimitPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return {
      success: false,
      error: parsedPayload.error.issues[0]?.message ?? "Invalid nutrient limit payload",
    };
  }

  try {
    const limit = await requirementService.createNutrientLimit(
      parsedId.data.requirementId,
      parsedPayload.data,
      { accessToken: auth.accessToken },
    );
    revalidatePath("/formulas");
    return { success: true, data: limit };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

const updateNutrientLimit = async (
  auth: AuthContext,
  input: unknown,
  payload: NutrientLimitPayload,
): Promise<RequirementActionResult<NutrientLimit>> => {
  const parsedId = nutrientLimitIdSchema.safeParse(input);
  if (!parsedId.success) {
    return {
      success: false,
      error: parsedId.error.issues[0]?.message ?? "Invalid nutrient limit id",
    };
  }

  const parsedPayload = nutrientLimitPayloadSchema.safeParse(payload);
  if (!parsedPayload.success) {
    return {
      success: false,
      error: parsedPayload.error.issues[0]?.message ?? "Invalid nutrient limit payload",
    };
  }

  try {
    const limit = await requirementService.updateNutrientLimit(
      parsedId.data.requirementId,
      parsedId.data.limitId,
      parsedPayload.data,
      { accessToken: auth.accessToken },
    );
    revalidatePath("/formulas");
    return { success: true, data: limit };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

const deleteNutrientLimit = async (
  auth: AuthContext,
  input: unknown,
): Promise<RequirementActionResult<null>> => {
  const parsed = nutrientLimitIdSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid nutrient limit id",
    };
  }

  try {
    await requirementService.deleteNutrientLimit(
      parsed.data.requirementId,
      parsed.data.limitId,
      { accessToken: auth.accessToken },
    );
    revalidatePath("/formulas");
    return { success: true, data: null };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

export const getRequirementsAction = withAuthAction(getRequirements, {
  roles: [AccessRole.Admin, AccessRole.User],
});

export const getNutrientLimitsAction = withAuthAction(getNutrientLimits, {
  roles: [AccessRole.Admin, AccessRole.User],
});

export const createNutrientLimitAction = withAuthAction(createNutrientLimit, {
  roles: [AccessRole.Admin, AccessRole.User],
});

export const updateNutrientLimitAction = withAuthAction(updateNutrientLimit, {
  roles: [AccessRole.Admin, AccessRole.User],
});

export const deleteNutrientLimitAction = withAuthAction(deleteNutrientLimit, {
  roles: [AccessRole.Admin, AccessRole.User],
});
