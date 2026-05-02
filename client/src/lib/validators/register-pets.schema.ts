import * as Yup from "yup";
import { RegisterPetsFormValues } from "@/types/pets-register.type";

export const registerPetsInitialValues: RegisterPetsFormValues = {
  hn: "",
  patientName: "",
  species: "dog",
  sex: "female",
  breedType: "mixed",
  mixedBreedNote: "",
  neuteredStatus: "intact",
  housingCondition: "indoor",
  ageType: "age",
  years: "",
  months: "",
  birthDate: "",
  weight: "",

  ownerType: "new",
  ownerId: "",
  existingOwnerSearch: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",

  healthStatus: "healthy",
  activeScoreTab: "visual",
  visualActiveScore: "veryActive",
};

export const registerPetsSchema = Yup.object({
  patientName: Yup.string().required("validation.pet.patientNameRequired"),
  species: Yup.string().required("validation.pet.speciesRequired"),
  sex: Yup.string().required("validation.pet.sexRequired"),
  breedType: Yup.string().required("validation.pet.breedRequired"),
  neuteredStatus: Yup.string().required("validation.pet.neuteredRequired"),
  housingCondition: Yup.string().required("validation.pet.housingRequired"),
  weight: Yup.number()
    .typeError("validation.pet.weightNumber")
    .positive("validation.pet.weightPositive")
    .required("validation.pet.weightRequired"),

  firstName: Yup.string().when("ownerType", {
    is: "new",
    then: (schema) => schema.required("validation.pet.firstNameRequired"),
    otherwise: (schema) => schema,
  }),
  lastName: Yup.string().when("ownerType", {
    is: "new",
    then: (schema) => schema.required("validation.pet.lastNameRequired"),
    otherwise: (schema) => schema,
  }),
  phoneNumber: Yup.string().when("ownerType", {
    is: "new",
    then: (schema) => schema.required("validation.pet.phoneRequired"),
    otherwise: (schema) => schema,
  }),
  ownerId: Yup.string().when("ownerType", {
    is: "existing",
    then: (schema) => schema.required("validation.pet.ownerSelectRequired"),
    otherwise: (schema) => schema,
  }),
  email: Yup.string().email("validation.pet.emailInvalid"),
  visualActiveScore: Yup.string().when("activeScoreTab", {
    is: "visual",
    then: (schema) => schema.required("validation.pet.visualScoreRequired"),
    otherwise: (schema) => schema,
  }),
});
