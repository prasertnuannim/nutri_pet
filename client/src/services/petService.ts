import { goApiFetch } from "@/lib/auth/goApi";
import type { PetOwnersListResponse, PetsListResponse, RegisteredPet } from "@/types/pets-register";

type AuthInput = {
  accessToken: string;
};

export type RegisterPetPayload = {
  hn: string;
  patientName: string;
  species: string;
  sex: "male" | "female";
  breedType: "mixed" | "purebred";
  mixedBreedNote: string;
  neuteredStatus: "intact" | "neutered";
  housingCondition: "indoor" | "outdoor" | "both";
  ageType: "age" | "birthDate";
  years?: number;
  months?: number;
  birthDate?: string;
  weight: number;
  ownerType: "new" | "existing";
  ownerId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  healthStatus: "healthy" | "diseaseHistory";
  activeScoreTab: "visual" | "assessment";
  visualActiveScore?: "veryActive" | "moderatelyActive" | "notVeryActive";
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

export const petService = {
  async register(data: RegisterPetPayload, auth: AuthInput) {
    const res = await goApiFetch("/pets/register", {
      method: "POST",
      body: JSON.stringify(data),
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to register pet"));
    }

    return res.json() as Promise<RegisteredPet>;
  },

  async getAll(params: { query?: string; limit?: number }, auth: AuthInput) {
    const query = new URLSearchParams();

    if (params.query) query.set("query", params.query);
    if (params.limit) query.set("limit", String(params.limit));

    const suffix = query.toString();
    const res = await goApiFetch(`/pets${suffix ? `?${suffix}` : ""}`, {
      method: "GET",
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to fetch pets"));
    }

    return res.json() as Promise<PetsListResponse>;
  },

  async getById(id: string, auth: AuthInput) {
    const res = await goApiFetch(`/pets/${id}`, {
      method: "GET",
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to fetch pet"));
    }

    return res.json() as Promise<RegisteredPet>;
  },

  async getOwners(params: { query?: string; limit?: number }, auth: AuthInput) {
    const query = new URLSearchParams();

    if (params.query) query.set("query", params.query);
    if (params.limit) query.set("limit", String(params.limit));

    const suffix = query.toString();
    const res = await goApiFetch(`/pets/owners${suffix ? `?${suffix}` : ""}`, {
      method: "GET",
      accessToken: auth.accessToken,
    });

    if (!res.ok) {
      throw new Error(await extractApiError(res, "Failed to fetch owners"));
    }

    return res.json() as Promise<PetOwnersListResponse>;
  },
};
