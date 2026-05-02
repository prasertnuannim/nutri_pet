export type Requirement = {
  requirement_id: number;
  type: string;
  species: string;
  requirement_name: string;
};

export type NutrientLimit = {
  limit_id: number;
  requirement_id: number;
  category: string;
  nutrient: string;
  min_value: number | null;
  max_value: number | null;
};

export const NUTRIENT_CATEGORY_ORDER = [
  "Energy",
  "Proximate Analysis",
  "Amino Acids",
  "Fatty Acids",
  "Minerals",
  "Vitamins",
  "Others",
] as const;

export type NutrientCategory = (typeof NUTRIENT_CATEGORY_ORDER)[number];
