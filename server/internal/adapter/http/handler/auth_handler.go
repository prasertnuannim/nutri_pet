package handler

import (
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/prasertnuannim/sert_v3/internal/domain/errorx"
	"github.com/prasertnuannim/sert_v3/internal/usecase/auth"
	"github.com/prasertnuannim/sert_v3/internal/usecase/dto"
)

type AuthHandler struct {
	svc *auth.Service
}

func NewAuthHandler(svc *auth.Service) *AuthHandler { return &AuthHandler{svc: svc} }

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req struct {
		Name      string `json:"name"`
		Email     string `json:"email"`
		Tenant    string `json:"tenant"`
		Promotion string `json:"promotion"`
	}
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	out, err := h.svc.Register(c.Context(), dto.RegisterInput{
		Name:      req.Name,
		Email:     req.Email,
		Tenant:    req.Tenant,
		Promotion: req.Promotion,
	})
	if err != nil {
		switch {
		case errors.Is(err, errorx.ErrNameRequired),
			errors.Is(err, errorx.ErrEmailRequired):
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		case errors.Is(err, errorx.ErrEmailAlreadyExists):
			return fiber.NewError(fiber.StatusConflict, err.Error())
		default:
			return fiber.NewError(fiber.StatusInternalServerError, "internal error")
		}
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"user": fiber.Map{
			"id":                 out.UserID,
			"email":              out.Email,
			"name":               out.Name,
			"role":               out.Role,
			"tenant":             out.Tenant,
			"promotion":          out.Promotion,
			"mustChangePassword": out.MustChangePassword,
		},
	})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	out, err := h.svc.Login(c.Context(), dto.LoginInput{Email: req.Email, Password: req.Password})
	if err != nil {
		switch {
		case errors.Is(err, errorx.ErrEmailRequired):
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		case errors.Is(err, errorx.ErrEmailNotFound):
			return fiber.NewError(fiber.StatusNotFound, err.Error())
		case errors.Is(err, errorx.ErrPasswordIncorrect):
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		case errors.Is(err, errorx.ErrInvalidCredentials):
			return fiber.NewError(fiber.StatusUnauthorized, "invalid credentials")
		default:
			return fiber.NewError(fiber.StatusInternalServerError, "internal error")
		}
	}

	return c.JSON(fiber.Map{
		"user": fiber.Map{
			"id":                 out.UserID,
			"email":              out.Email,
			"name":               out.Name,
			"role":               out.Role,
			"tenant":             out.Tenant,
			"promotion":          out.Promotion,
			"mustChangePassword": out.MustChangePassword,
		},
		"access_token":  out.AccessToken,
		"access_exp":    out.AccessExp.Unix(),
		"refresh_token": out.RefreshToken,
		"refresh_exp":   out.RefreshExp.Unix(),
	})
}

func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	out, err := h.svc.Refresh(c.Context(), dto.RefreshInput{RefreshToken: req.RefreshToken})
	if err != nil {
		switch {
		case errors.Is(err, errorx.ErrTokenExpired), errors.Is(err, errorx.ErrTokenRevoked):
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		default:
			return fiber.NewError(fiber.StatusInternalServerError, "internal error")
		}
	}

	return c.JSON(fiber.Map{
		"user_id":            out.UserID,
		"email":              out.Email,
		"role":               out.Role,
		"tenant":             out.Tenant,
		"promotion":          out.Promotion,
		"mustChangePassword": out.MustChangePassword,
		"access_token":       out.AccessToken,
		"access_exp":         out.AccessExp.Unix(),
		"refresh_token":      out.RefreshToken,
		"refresh_exp":        out.RefreshExp.Unix(),
	})
}

func (h *AuthHandler) ChangePassword(c *fiber.Ctx) error {
	var req struct {
		NewPassword string `json:"new_password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	userID, _ := c.Locals("user_id").(string)
	err := h.svc.ChangePassword(c.Context(), userID, dto.ChangePasswordInput{
		NewPassword: req.NewPassword,
	})
	if err != nil {
		switch {
		case errors.Is(err, errorx.ErrPasswordRequired),
			errors.Is(err, errorx.ErrPasswordTooShort):
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		case errors.Is(err, errorx.ErrUserNotFound):
			return fiber.NewError(fiber.StatusNotFound, err.Error())
		default:
			return fiber.NewError(fiber.StatusInternalServerError, "internal error")
		}
	}

	return c.JSON(fiber.Map{"ok": true})
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}
	if strings.TrimSpace(req.RefreshToken) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "refresh token is required")
	}

	if err := h.svc.Logout(c.Context(), dto.LogoutInput{RefreshToken: req.RefreshToken}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AuthHandler) Me(c *fiber.Ctx) error {
	uid, _ := c.Locals("user_id").(string)

	out, err := h.svc.Me(c.Context(), uid)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "internal error")
	}
	return c.JSON(fiber.Map{
		"id":                 out.UserID,
		"email":              out.Email,
		"name":               out.Name,
		"role":               out.Role,
		"tenant":             out.Tenant,
		"promotion":          out.Promotion,
		"mustChangePassword": out.MustChangePassword,
	})
}

func (h *AuthHandler) AdminOnly(c *fiber.Ctx) error {
	userID, _ := c.Locals("user_id").(string)
	role, _ := c.Locals("user_role").(string)
	return c.JSON(fiber.Map{
		"ok":      true,
		"message": "admin access granted",
		"user_id": userID,
		"role":    role,
	})
}
