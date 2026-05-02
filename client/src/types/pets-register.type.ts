export type RegisterPetsFormValues = {
  hn: string;
  patientName: string;
  species: string;
  sex: "male" | "female" | "";
  breedType: "mixed" | "purebred" | "";
  mixedBreedNote: string;
  neuteredStatus: "intact" | "neutered" | "";
  housingCondition: "indoor" | "outdoor" | "both" | "";
  ageType: "age" | "birthDate";
  years: string;
  months: string;
  birthDate: string;
  weight: string;

  ownerType: "new" | "existing";
  ownerId: string;
  existingOwnerSearch: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;

  healthStatus: "healthy" | "diseaseHistory";
  activeScoreTab: "visual" | "assessment";
  visualActiveScore: "veryActive" | "moderatelyActive" | "notVeryActive" | "";
};

export type PetOwnerSummary = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  petsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type RegisteredPet = {
  id: string;
  hn: string;
  patientName: string;
  species: string;
  sex: "male" | "female";
  breedType: "mixed" | "purebred";
  mixedBreedNote: string;
  neuteredStatus: "intact" | "neutered";
  housingCondition: "indoor" | "outdoor" | "both";
  ageType: "age" | "birthDate";
  years?: number | null;
  months?: number | null;
  birthDate: string;
  weight: number;
  healthStatus: "healthy" | "diseaseHistory";
  activeScoreTab: "visual" | "assessment";
  visualActiveScore: "veryActive" | "moderatelyActive" | "notVeryActive" | "";
  owner: PetOwnerSummary;
  createdAt: string;
  updatedAt: string;
};

export type PetsListResponse = {
  data: RegisteredPet[];
  total: number;
  limit: number;
  query: string;
};

export type PetOwnersListResponse = {
  data: PetOwnerSummary[];
  total: number;
  limit: number;
  query: string;
};
