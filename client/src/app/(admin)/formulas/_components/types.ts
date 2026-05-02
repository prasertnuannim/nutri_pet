import type { NutrientLimit } from "@/types/requirement.type";

export type NutrientLimitForm = {
  category: string;
  nutrient: string;
  min_value: string;
  max_value: string;
};

export function toLimitForm(limit?: NutrientLimit): NutrientLimitForm {
  return {
    category: limit?.category ?? "Energy",
    nutrient: limit?.nutrient ?? "",
    min_value: limit?.min_value?.toString() ?? "",
    max_value: limit?.max_value?.toString() ?? "",
  };
}
