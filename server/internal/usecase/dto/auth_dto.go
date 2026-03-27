package dto

import "time"

type LoginInput struct {
	Email    string
	Password string
}

type RegisterInput struct {
	Name      string
	Email     string
	Tenant    string
	Promotion string
}

type RegisterOutput struct {
	UserID             string
	Email              string
	Name               string
	Role               string
	Tenant             string
	Promotion          string
	MustChangePassword bool
}

type LoginOutput struct {
	UserID             string
	Email              string
	Name               string
	Role               string
	Tenant             string
	Promotion          string
	MustChangePassword bool
	AccessToken        string
	AccessExp          time.Time
	RefreshToken       string
	RefreshExp         time.Time
}

type RefreshInput struct {
	RefreshToken string
}

type LogoutInput struct {
	RefreshToken string
}

type RefreshOutput struct {
	UserID             string
	Email              string
	Role               string
	Tenant             string
	Promotion          string
	MustChangePassword bool
	AccessToken        string
	AccessExp          time.Time
	RefreshToken       string
	RefreshExp         time.Time
}

type MeOutput struct {
	UserID             string
	Email              string
	Name               string
	Role               string
	Tenant             string
	Promotion          string
	MustChangePassword bool
}

type ChangePasswordInput struct {
	NewPassword string
}
