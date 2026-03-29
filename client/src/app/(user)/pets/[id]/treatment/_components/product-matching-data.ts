export type ProductFoodType = "" | "homecooked" | "commercialFeed" | "mixed";
export type RecipeCategory = "all" | "chicken" | "beef" | "fish";

export type HomecookedRecipeOption = {
  id: string;
  name: string;
  category: Exclude<RecipeCategory, "all">;
  match: number;
};

export type CommercialFormulaOption = {
  id: string;
  name: string;
  kcalDensity: number;
  match: number;
};

export const homecookedRecipeOptions: HomecookedRecipeOption[] = [
  {
    id: "premium-chicken-rice-core",
    name: "Premium Chicken & Rice Core",
    category: "chicken",
    match: 98,
  },
  {
    id: "hypoallergenic-beef-sweet-potato",
    name: "Hypoallergenic Beef & Sweet Potato",
    category: "beef",
    match: 85,
  },
  {
    id: "salmon-peas-sensitive-skin",
    name: "Salmon & Peas Sensitive Skin",
    category: "fish",
    match: 92,
  },
];

export const commercialFormulaOptions: CommercialFormulaOption[] = [
  {
    id: "royal-canin-hepatic",
    name: "Royal Canin Hepatic",
    kcalDensity: 3.9,
    match: 98,
  },
  {
    id: "hills-prescription-diet-id",
    name: "Hill's Prescription Diet I/d",
    kcalDensity: 4.1,
    match: 95,
  },
  {
    id: "purina-pro-plan-veterinary-diets-hp",
    name: "Purina Pro Plan Veterinary Diets HP",
    kcalDensity: 3.7,
    match: 88,
  },
];

export function getHomecookedRecipeById(id: string) {
  return homecookedRecipeOptions.find((recipe) => recipe.id === id) ?? null;
}

export function getCommercialFormulaById(id: string) {
  return commercialFormulaOptions.find((formula) => formula.id === id) ?? null;
}
