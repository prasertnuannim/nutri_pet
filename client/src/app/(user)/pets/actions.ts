"use server";

import { revalidatePath } from "next/cache";
import { AccessRole } from "@/lib/auth/accessRole";
import { withAuthAction, type AuthContext } from "@/services/security/safeAction";
import { petService, type RegisterPetPayload } from "@/services/petService";
import type { PetOwnersListResponse, PetsListResponse, RegisterPetsFormValues, RegisteredPet } from "@/types/pets-register";

export type PetActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

type PetListInput = {
  query?: string;
  limit?: number;
};

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "errors.shared.unexpected";

function parsePositiveNumber(value: string, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("validation.pet.weightPositive");
  }
  return parsed;
}

function parseOptionalInteger(
  value: string,
  field: string,
  options?: { min?: number; max?: number },
): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed)) {
    throw new Error(
      field === "Years"
        ? "validation.pet.yearsInteger"
        : "validation.pet.monthsInteger",
    );
  }
  if (options?.min !== undefined && parsed < options.min) {
    throw new Error(
      field === "Years"
        ? "validation.pet.yearsMin"
        : "validation.pet.monthsMin",
    );
  }
  if (options?.max !== undefined && parsed > options.max) {
    throw new Error("validation.pet.monthsMax");
  }
  return parsed;
}

function toRegisterPetPayload(values: RegisterPetsFormValues): RegisterPetPayload {
  if (!values.sex) {
    throw new Error("validation.pet.sexRequired");
  }
  if (!values.breedType) {
    throw new Error("validation.pet.breedRequired");
  }
  if (!values.neuteredStatus) {
    throw new Error("validation.pet.neuteredRequired");
  }
  if (!values.housingCondition) {
    throw new Error("validation.pet.housingRequired");
  }

  const payload: RegisterPetPayload = {
    hn: values.hn.trim(),
    patientName: values.patientName.trim(),
    species: values.species.trim().toLowerCase(),
    sex: values.sex,
    breedType: values.breedType,
    mixedBreedNote: values.mixedBreedNote.trim(),
    neuteredStatus: values.neuteredStatus,
    housingCondition: values.housingCondition,
    ageType: values.ageType,
    weight: parsePositiveNumber(values.weight, "Weight"),
    ownerType: values.ownerType,
    healthStatus: values.healthStatus,
    activeScoreTab: values.activeScoreTab,
  };

  if (!payload.patientName) {
    throw new Error("validation.pet.patientNameRequired");
  }
  if (!payload.species) {
    throw new Error("validation.pet.speciesRequired");
  }

  if (values.ageType === "age") {
    payload.years = parseOptionalInteger(values.years, "Years", { min: 0 });
    payload.months = parseOptionalInteger(values.months, "Months", { min: 0, max: 11 });
  } else if (values.birthDate.trim()) {
    payload.birthDate = values.birthDate.trim();
  }

  if (values.ownerType === "existing") {
    if (!values.ownerId.trim()) {
      throw new Error("validation.pet.ownerSelectRequired");
    }
    payload.ownerId = values.ownerId.trim();
  } else {
    payload.firstName = values.firstName.trim();
    payload.lastName = values.lastName.trim();
    payload.phoneNumber = values.phoneNumber.trim();
    payload.email = values.email.trim();

    if (!payload.firstName) {
      throw new Error("validation.pet.firstNameRequired");
    }
    if (!payload.lastName) {
      throw new Error("validation.pet.lastNameRequired");
    }
    if (!payload.phoneNumber) {
      throw new Error("validation.pet.phoneRequired");
    }
  }

  if (values.activeScoreTab === "visual") {
    if (!values.visualActiveScore) {
      throw new Error("validation.pet.visualScoreRequired");
    }
    payload.visualActiveScore = values.visualActiveScore;
  }

  return payload;
}

const registerPet = async (
  auth: AuthContext,
  values: RegisterPetsFormValues,
): Promise<PetActionResult<RegisteredPet>> => {
  try {
    const registeredPet = await petService.register(toRegisterPetPayload(values), {
      accessToken: auth.accessToken,
    });
    revalidatePath("/pets");
    revalidatePath("/pets/register");
    return { success: true, data: registeredPet };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

const searchPetOwners = async (
  auth: AuthContext,
  query = "",
): Promise<PetActionResult<PetOwnersListResponse>> => {
  try {
    const owners = await petService.getOwners(
      {
        query: query.trim(),
        limit: 8,
      },
      { accessToken: auth.accessToken },
    );
    return { success: true, data: owners };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

const getPets = async (
  auth: AuthContext,
  input?: PetListInput,
): Promise<PetActionResult<PetsListResponse>> => {
  try {
    const pets = await petService.getAll(
      {
        query: input?.query?.trim(),
        limit: input?.limit ?? 100,
      },
      { accessToken: auth.accessToken },
    );
    return { success: true, data: pets };
  } catch (error: unknown) {
    return { success: false, error: toErrorMessage(error) };
  }
};

export const registerPetAction = withAuthAction(registerPet, {
  roles: [AccessRole.Admin, AccessRole.User],
});

export const searchPetOwnersAction = withAuthAction(searchPetOwners, {
  roles: [AccessRole.Admin, AccessRole.User],
});

export const getPetsAction = withAuthAction(getPets, {
  roles: [AccessRole.Admin, AccessRole.User],
});
