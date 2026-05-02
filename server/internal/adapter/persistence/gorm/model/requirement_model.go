package model

type Requirement struct {
	RequirementID   uint            `gorm:"column:requirement_id;primaryKey" json:"requirement_id"`
	Type            string          `gorm:"column:type" json:"type"`
	Species         string          `gorm:"column:species" json:"species"`
	RequirementName string          `gorm:"column:requirement_name" json:"requirement_name"`
	NutrientLimits  []NutrientLimit `gorm:"foreignKey:RequirementID;references:RequirementID" json:"-"`
}

func (Requirement) TableName() string {
	return "requirements"
}

type NutrientLimit struct {
	LimitID       uint     `gorm:"column:limit_id;primaryKey" json:"limit_id"`
	RequirementID uint     `gorm:"column:requirement_id;index" json:"requirement_id"`
	Category      string   `gorm:"column:category" json:"category"`
	Nutrient      string   `gorm:"column:nutrient" json:"nutrient"`
	MinValue      *float64 `gorm:"column:min_value" json:"min_value"`
	MaxValue      *float64 `gorm:"column:max_value" json:"max_value"`
}

func (NutrientLimit) TableName() string {
	return "nutrient_limits"
}
