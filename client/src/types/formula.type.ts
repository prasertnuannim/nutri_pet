export type NutrientLimit = {
  limit_id: number
  requirement_id: number
  category: string
  nutrient: string
  min_value: number | null
  max_value: number | null
}

export type Requirement = {
  requirement_id: number
  type: string | null
  species: string
  requirement_name: string
  nutrient_limits?: NutrientLimit[]
}