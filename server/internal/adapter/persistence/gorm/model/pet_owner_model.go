package model

import "time"

type PetOwner struct {
	ID                string  `gorm:"type:varchar(36);primaryKey"`
	FirstName         string  `gorm:"type:varchar(120);not null;index:idx_pet_owners_name"`
	LastName          string  `gorm:"type:varchar(120);not null;index:idx_pet_owners_name"`
	PhoneNumber       string  `gorm:"type:varchar(64);not null"`
	PhoneNumberSearch string  `gorm:"type:varchar(32);index"`
	Email             *string `gorm:"type:varchar(191);index"`
	CreatedByUserID   *string `gorm:"type:varchar(36);index"`

	Pets []Pet `gorm:"foreignKey:OwnerID;constraint:OnDelete:RESTRICT"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (PetOwner) TableName() string { return "pet_owners" }
