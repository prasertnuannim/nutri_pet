import { goApiFetch } from "@/lib/auth/goApi";
import type { NutrientLimit, Requirement } from "@/types/requirement.type";

type AuthInput = {
  accessToken: string;
};

export type NutrientLimitPayload = {
  category: string;
  nutrient: string;
  min_value: number | null;
  max_value: number | null;
};

async function extractApiError(res: Response, fallback: string) {
  try {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const payload = (await res.json()) as {
        error?: string;
        message?: string;
      };
      return payload.message ?? payload.error ?? fallback;
    }

    const text = await res.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

export const requirementService = {
  async getRequirements(auth: AuthInput) {
    const res = await goApiFetch("/requirements", {
      method: "GET",
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to fetch requirements"));
    }

    return res.json() as Promise<Requirement[]>;
  },

  async getNutrientLimits(requirementId: number, auth: AuthInput) {
    const res = await goApiFetch(`/requirements/${requirementId}/limits`, {
      method: "GET",
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to fetch nutrient limits"));
    }

    return res.json() as Promise<NutrientLimit[]>;
  },

  async createNutrientLimit(
    requirementId: number,
    data: NutrientLimitPayload,
    auth: AuthInput,
  ) {
    const res = await goApiFetch(`/requirements/${requirementId}/limits`, {
      method: "POST",
      body: JSON.stringify(data),
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to create nutrient limit"));
    }

    return res.json() as Promise<NutrientLimit>;
  },

  async updateNutrientLimit(
    requirementId: number,
    limitId: number,
    data: NutrientLimitPayload,
    auth: AuthInput,
  ) {
    const res = await goApiFetch(`/requirements/${requirementId}/limits/${limitId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to update nutrient limit"));
    }

    return res.json() as Promise<NutrientLimit>;
  },

  async deleteNutrientLimit(requirementId: number, limitId: number, auth: AuthInput) {
    const res = await goApiFetch(`/requirements/${requirementId}/limits/${limitId}`, {
      method: "DELETE",
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to delete nutrient limit"));
    }

    return null;
  },
};
