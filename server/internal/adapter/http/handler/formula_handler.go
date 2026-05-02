package handler

import (
	"errors"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	dbm "github.com/prasertnuannim/sert_v3/internal/adapter/persistence/gorm/model"
)

type FormulaHandler struct {
	db *gorm.DB
}

type nutrientLimitPayload struct {
	Category string   `json:"category"`
	Nutrient string   `json:"nutrient"`
	MinValue *float64 `json:"min_value"`
	MaxValue *float64 `json:"max_value"`
}

func NewFormulaHandler(db *gorm.DB) *FormulaHandler {
	return &FormulaHandler{db: db}
}

func parseUintParam(c *fiber.Ctx, name string) (uint, error) {
	raw := strings.TrimSpace(c.Params(name))
	if raw == "" {
		return 0, fiber.NewError(fiber.StatusBadRequest, name+" is required")
	}

	parsed, err := strconv.ParseUint(raw, 10, 64)
	if err != nil || parsed == 0 {
		return 0, fiber.NewError(fiber.StatusBadRequest, name+" is invalid")
	}

	return uint(parsed), nil
}

func normalizeNutrientLimitPayload(payload nutrientLimitPayload) (nutrientLimitPayload, error) {
	payload.Category = strings.TrimSpace(payload.Category)
	payload.Nutrient = strings.TrimSpace(payload.Nutrient)

	if payload.Category == "" {
		return payload, fiber.NewError(fiber.StatusBadRequest, "category is required")
	}

	if payload.Nutrient == "" {
		return payload, fiber.NewError(fiber.StatusBadRequest, "nutrient is required")
	}

	return payload, nil
}

func (h *FormulaHandler) ListRequirements(c *fiber.Ctx) error {
	var requirements []dbm.Requirement
	if err := h.db.Order("requirement_id ASC").Find(&requirements).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to fetch requirements")
	}

	return c.JSON(requirements)
}

func (h *FormulaHandler) ListNutrientLimits(c *fiber.Ctx) error {
	requirementID, err := parseUintParam(c, "requirementId")
	if err != nil {
		return err
	}

	var limits []dbm.NutrientLimit
	if err := h.db.
		Where("requirement_id = ?", requirementID).
		Order("category ASC, nutrient ASC, limit_id ASC").
		Find(&limits).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to fetch nutrient limits")
	}

	return c.JSON(limits)
}

func (h *FormulaHandler) CreateNutrientLimit(c *fiber.Ctx) error {
	requirementID, err := parseUintParam(c, "requirementId")
	if err != nil {
		return err
	}

	var payload nutrientLimitPayload
	if err := c.BodyParser(&payload); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	payload, err = normalizeNutrientLimitPayload(payload)
	if err != nil {
		return err
	}

	limit := dbm.NutrientLimit{
		RequirementID: requirementID,
		Category:      payload.Category,
		Nutrient:      payload.Nutrient,
		MinValue:      payload.MinValue,
		MaxValue:      payload.MaxValue,
	}

	if err := h.db.Create(&limit).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to create nutrient limit")
	}

	return c.Status(fiber.StatusCreated).JSON(limit)
}

func (h *FormulaHandler) UpdateNutrientLimit(c *fiber.Ctx) error {
	requirementID, err := parseUintParam(c, "requirementId")
	if err != nil {
		return err
	}

	limitID, err := parseUintParam(c, "limitId")
	if err != nil {
		return err
	}

	var payload nutrientLimitPayload
	if err := c.BodyParser(&payload); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	payload, err = normalizeNutrientLimitPayload(payload)
	if err != nil {
		return err
	}

	var limit dbm.NutrientLimit
	if err := h.db.
		Where("requirement_id = ? AND limit_id = ?", requirementID, limitID).
		First(&limit).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "nutrient limit not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "failed to fetch nutrient limit")
	}

	limit.Category = payload.Category
	limit.Nutrient = payload.Nutrient
	limit.MinValue = payload.MinValue
	limit.MaxValue = payload.MaxValue

	if err := h.db.Save(&limit).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to update nutrient limit")
	}

	return c.JSON(limit)
}

func (h *FormulaHandler) DeleteNutrientLimit(c *fiber.Ctx) error {
	requirementID, err := parseUintParam(c, "requirementId")
	if err != nil {
		return err
	}

	limitID, err := parseUintParam(c, "limitId")
	if err != nil {
		return err
	}

	result := h.db.
		Where("requirement_id = ? AND limit_id = ?", requirementID, limitID).
		Delete(&dbm.NutrientLimit{})
	if result.Error != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to delete nutrient limit")
	}

	if result.RowsAffected == 0 {
		return fiber.NewError(fiber.StatusNotFound, "nutrient limit not found")
	}

	return c.JSON(fiber.Map{"success": true})
}
