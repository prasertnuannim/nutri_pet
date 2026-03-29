export type TreatmentFormValues = {
  historyTaking: string;
  physicalExamNotes: string;
  bodyTemperature: string;
  heartRate: string;
  respiratoryRate: string;
  bodyConditionScore: string;
  diagnosis: "healthy" | "disease";
  crossSectionMethod: "minMostFit" | "minLowest" | "";
  aafcoStandard: "adultMaintenance" | "growthReproduction" | "seniorSupport" | "weightManagement" | "";
  additionalNutrientRequirement: string;
  nutritionalNeeds: string[];
  stomachSizePreset: "20" | "30" | "40" | "custom" | "";
  stomachSizeCustom: string;
  foodAllergies: string[];
  foodAvoidances: string[];
  currentRegularFoods: string[];
  snackTreats: string[];
  idealBodyConditionScore: string;
  rerWeightSource: "current" | "ideal";
  derFactor: string;
  currentDiet: string;
  appetiteLevel: string;
  dailyCalories: string;
  bodyWeightGoal: string;
  nutritionNotes: string;
  proteinTarget: string;
  fatTarget: string;
  fiberTarget: string;
  feedingFrequency: string;
  supplementPlan: string;
  foodType: "" | "homecooked" | "commercialFeed" | "mixed";
  recipeFormulaCategory: "all" | "chicken" | "beef" | "fish";
  selectedHomecookedRecipeId: string;
  selectedCommercialFormulaId: string;
  mealsPerDay: string;
  mixedCommercialPercentage: string;
  recommendedFormula: string;
  packageSize: string;
  dailyPortion: string;
  transitionPlan: string;
  productNotes: string;
  followUpDate: string;
  followUpNotes: string;
};

export const initialTreatmentValues: TreatmentFormValues = {
  historyTaking: "",
  physicalExamNotes: "",
  bodyTemperature: "101.5",
  heartRate: "100",
  respiratoryRate: "20",
  bodyConditionScore: "",
  diagnosis: "healthy",
  crossSectionMethod: "minMostFit",
  aafcoStandard: "",
  additionalNutrientRequirement: "",
  nutritionalNeeds: ["none"],
  stomachSizePreset: "20",
  stomachSizeCustom: "",
  foodAllergies: ["none"],
  foodAvoidances: ["none"],
  currentRegularFoods: [],
  snackTreats: [],
  idealBodyConditionScore: "",
  rerWeightSource: "current",
  derFactor: "",
  currentDiet: "",
  appetiteLevel: "",
  dailyCalories: "",
  bodyWeightGoal: "",
  nutritionNotes: "",
  proteinTarget: "",
  fatTarget: "",
  fiberTarget: "",
  feedingFrequency: "",
  supplementPlan: "",
  foodType: "",
  recipeFormulaCategory: "all",
  selectedHomecookedRecipeId: "",
  selectedCommercialFormulaId: "",
  mealsPerDay: "2",
  mixedCommercialPercentage: "50",
  recommendedFormula: "",
  packageSize: "",
  dailyPortion: "",
  transitionPlan: "",
  productNotes: "",
  followUpDate: "",
  followUpNotes: "",
};

export const treatmentTextareaClassName =
  "min-h-28 w-full rounded-xl border border-input bg-transparent px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
