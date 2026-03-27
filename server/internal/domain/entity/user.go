package entity

import "time"

const (
	RoleAdmin = "admin"
	RoleUser  = "user"
)

type User struct {
	ID                 string
	Email              string
	PasswordHash       string
	Name               string
	Role               string
	Tenant             string
	Promotion          string
	MustChangePassword bool
	CreatedAt          time.Time
	UpdatedAt          time.Time
}
