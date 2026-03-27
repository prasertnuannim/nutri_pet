package model

import "time"

type Pet struct {
	ID                string  `gorm:"type:varchar(36);primaryKey"`
	HN                string  `gorm:"type:varchar(32);not null;uniqueIndex"`
	PatientName       string  `gorm:"type:varchar(191);not null;index"`
	Species           string  `gorm:"type:varchar(64);not null;index"`
	Sex               string  `gorm:"type:varchar(32);not null"`
	BreedType         string  `gorm:"type:varchar(32);not null"`
	MixedBreedNote    *string `gorm:"type:varchar(255)"`
	NeuteredStatus    string  `gorm:"type:varchar(32);not null"`
	HousingCondition  string  `gorm:"type:varchar(32);not null"`
	AgeType           string  `gorm:"type:varchar(32);not null"`
	Years             *int
	Months            *int
	BirthDate         *time.Time `gorm:"type:date"`
	Weight            float64    `gorm:"type:numeric(10,2);not null"`
	HealthStatus      string     `gorm:"type:varchar(32);not null"`
	ActiveScoreTab    string     `gorm:"type:varchar(32);not null"`
	VisualActiveScore *string    `gorm:"type:varchar(64)"`
	OwnerID           string     `gorm:"type:varchar(36);index;not null"`
	Owner             PetOwner   `gorm:"foreignKey:OwnerID;references:ID;constraint:OnDelete:RESTRICT"`
	CreatedByUserID   *string    `gorm:"type:varchar(36);index"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Pet) TableName() string { return "pets" }
