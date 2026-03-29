package handler

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"

	dbm "github.com/prasertnuannim/sert_v3/internal/adapter/persistence/gorm/model"
)

type PetHandler struct {
	db *gorm.DB
}

func NewPetHandler(db *gorm.DB) *PetHandler {
	return &PetHandler{db: db}
}

type petOwnerResponse struct {
	ID          string `json:"id"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	FullName    string `json:"fullName"`
	PhoneNumber string `json:"phoneNumber"`
	Email       string `json:"email"`
	PetsCount   int    `json:"petsCount"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

type petResponse struct {
	ID                string           `json:"id"`
	HN                string           `json:"hn"`
	PatientName       string           `json:"patientName"`
	Species           string           `json:"species"`
	Sex               string           `json:"sex"`
	BreedType         string           `json:"breedType"`
	MixedBreedNote    string           `json:"mixedBreedNote"`
	NeuteredStatus    string           `json:"neuteredStatus"`
	HousingCondition  string           `json:"housingCondition"`
	AgeType           string           `json:"ageType"`
	Years             *int             `json:"years,omitempty"`
	Months            *int             `json:"months,omitempty"`
	BirthDate         string           `json:"birthDate"`
	Weight            float64          `json:"weight"`
	HealthStatus      string           `json:"healthStatus"`
	ActiveScoreTab    string           `json:"activeScoreTab"`
	VisualActiveScore string           `json:"visualActiveScore"`
	Owner             petOwnerResponse `json:"owner"`
	CreatedAt         string           `json:"createdAt"`
	UpdatedAt         string           `json:"updatedAt"`
}

type registerPetRequest struct {
	HN               string  `json:"hn"`
	PatientName      string  `json:"patientName"`
	Species          string  `json:"species"`
	Sex              string  `json:"sex"`
	BreedType        string  `json:"breedType"`
	MixedBreedNote   string  `json:"mixedBreedNote"`
	NeuteredStatus   string  `json:"neuteredStatus"`
	HousingCondition string  `json:"housingCondition"`
	AgeType          string  `json:"ageType"`
	Years            *int    `json:"years"`
	Months           *int    `json:"months"`
	BirthDate        *string `json:"birthDate"`
	Weight           float64 `json:"weight"`

	OwnerType   string `json:"ownerType"`
	OwnerID     string `json:"ownerId"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	PhoneNumber string `json:"phoneNumber"`
	Email       string `json:"email"`

	HealthStatus      string `json:"healthStatus"`
	ActiveScoreTab    string `json:"activeScoreTab"`
	VisualActiveScore string `json:"visualActiveScore"`
}

func toPetOwnerResponse(owner dbm.PetOwner) petOwnerResponse {
	email := ""
	if owner.Email != nil {
		email = *owner.Email
	}

	return petOwnerResponse{
		ID:          owner.ID,
		FirstName:   owner.FirstName,
		LastName:    owner.LastName,
		FullName:    strings.TrimSpace(owner.FirstName + " " + owner.LastName),
		PhoneNumber: owner.PhoneNumber,
		Email:       email,
		PetsCount:   len(owner.Pets),
		CreatedAt:   owner.CreatedAt.UTC().Format(time.RFC3339),
		UpdatedAt:   owner.UpdatedAt.UTC().Format(time.RFC3339),
	}
}

func toPetResponse(pet dbm.Pet) petResponse {
	mixedBreedNote := ""
	if pet.MixedBreedNote != nil {
		mixedBreedNote = *pet.MixedBreedNote
	}

	visualActiveScore := ""
	if pet.VisualActiveScore != nil {
		visualActiveScore = *pet.VisualActiveScore
	}

	birthDate := ""
	if pet.BirthDate != nil {
		birthDate = pet.BirthDate.Format("2006-01-02")
	}

	return petResponse{
		ID:                pet.ID,
		HN:                pet.HN,
		PatientName:       pet.PatientName,
		Species:           pet.Species,
		Sex:               pet.Sex,
		BreedType:         pet.BreedType,
		MixedBreedNote:    mixedBreedNote,
		NeuteredStatus:    pet.NeuteredStatus,
		HousingCondition:  pet.HousingCondition,
		AgeType:           pet.AgeType,
		Years:             pet.Years,
		Months:            pet.Months,
		BirthDate:         birthDate,
		Weight:            pet.Weight,
		HealthStatus:      pet.HealthStatus,
		ActiveScoreTab:    pet.ActiveScoreTab,
		VisualActiveScore: visualActiveScore,
		Owner:             toPetOwnerResponse(pet.Owner),
		CreatedAt:         pet.CreatedAt.UTC().Format(time.RFC3339),
		UpdatedAt:         pet.UpdatedAt.UTC().Format(time.RFC3339),
	}
}

func normalizePhoneSearch(value string) string {
	var digits strings.Builder
	for _, r := range value {
		if r >= '0' && r <= '9' {
			digits.WriteRune(r)
		}
	}
	return digits.String()
}

func normalizeLower(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func canonicalChoice(value string, mapping map[string]string) string {
	normalized := normalizeLower(value)
	return mapping[normalized]
}

func normalizeHN(value string) string {
	return strings.ToUpper(strings.TrimSpace(value))
}

func generateHN() string {
	raw := strings.ToUpper(strings.ReplaceAll(uuid.NewString(), "-", ""))
	return "HN-" + raw[:8]
}

func parseBirthDate(raw *string) (*time.Time, error) {
	if raw == nil {
		return nil, nil
	}

	trimmed := strings.TrimSpace(*raw)
	if trimmed == "" {
		return nil, nil
	}

	parsed, err := time.Parse("2006-01-02", trimmed)
	if err != nil {
		return nil, fmt.Errorf("birth date must be in YYYY-MM-DD format")
	}
	return &parsed, nil
}

func isAllowed(value string, options ...string) bool {
	for _, option := range options {
		if value == option {
			return true
		}
	}
	return false
}

func (h *PetHandler) Register(c *fiber.Ctx) error {
	var req registerPetRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	patientName := strings.TrimSpace(req.PatientName)
	species := normalizeLower(req.Species)
	sex := canonicalChoice(req.Sex, map[string]string{
		"male":   "male",
		"female": "female",
	})
	breedType := canonicalChoice(req.BreedType, map[string]string{
		"mixed":    "mixed",
		"purebred": "purebred",
	})
	neuteredStatus := canonicalChoice(req.NeuteredStatus, map[string]string{
		"intact":   "intact",
		"neutered": "neutered",
	})
	housingCondition := canonicalChoice(req.HousingCondition, map[string]string{
		"indoor":  "indoor",
		"outdoor": "outdoor",
		"both":    "both",
	})
	ageType := canonicalChoice(req.AgeType, map[string]string{
		"age":       "age",
		"birthdate": "birthDate",
	})
	ownerType := canonicalChoice(req.OwnerType, map[string]string{
		"new":      "new",
		"existing": "existing",
	})
	healthStatus := canonicalChoice(req.HealthStatus, map[string]string{
		"healthy":        "healthy",
		"diseasehistory": "diseaseHistory",
	})
	activeScoreTab := canonicalChoice(req.ActiveScoreTab, map[string]string{
		"visual":     "visual",
		"assessment": "assessment",
	})
	visualActiveScore := canonicalChoice(req.VisualActiveScore, map[string]string{
		"veryactive":       "veryActive",
		"moderatelyactive": "moderatelyActive",
		"notveryactive":    "notVeryActive",
	})

	if patientName == "" {
		return fiber.NewError(fiber.StatusBadRequest, "patient name is required")
	}
	if species == "" {
		return fiber.NewError(fiber.StatusBadRequest, "species is required")
	}
	if !isAllowed(sex, "male", "female") {
		return fiber.NewError(fiber.StatusBadRequest, "sex is invalid")
	}
	if !isAllowed(breedType, "mixed", "purebred") {
		return fiber.NewError(fiber.StatusBadRequest, "breed type is invalid")
	}
	if !isAllowed(neuteredStatus, "intact", "neutered") {
		return fiber.NewError(fiber.StatusBadRequest, "neutered status is invalid")
	}
	if !isAllowed(housingCondition, "indoor", "outdoor", "both") {
		return fiber.NewError(fiber.StatusBadRequest, "housing condition is invalid")
	}
	if !isAllowed(ageType, "age", "birthDate") {
		return fiber.NewError(fiber.StatusBadRequest, "age type is invalid")
	}
	if req.Weight <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "weight must be greater than 0")
	}
	if !isAllowed(ownerType, "new", "existing") {
		return fiber.NewError(fiber.StatusBadRequest, "owner type is invalid")
	}
	if !isAllowed(healthStatus, "healthy", "diseaseHistory") {
		return fiber.NewError(fiber.StatusBadRequest, "health status is invalid")
	}
	if !isAllowed(activeScoreTab, "visual", "assessment") {
		return fiber.NewError(fiber.StatusBadRequest, "active score tab is invalid")
	}
	if activeScoreTab == "visual" && !isAllowed(visualActiveScore, "veryActive", "moderatelyActive", "notVeryActive") {
		return fiber.NewError(fiber.StatusBadRequest, "visual active score is invalid")
	}
	if req.Years != nil && *req.Years < 0 {
		return fiber.NewError(fiber.StatusBadRequest, "years must be 0 or greater")
	}
	if req.Months != nil && (*req.Months < 0 || *req.Months > 11) {
		return fiber.NewError(fiber.StatusBadRequest, "months must be between 0 and 11")
	}

	birthDate, err := parseBirthDate(req.BirthDate)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if ageType == "age" {
		birthDate = nil
	} else {
		req.Years = nil
		req.Months = nil
	}

	ownerID := strings.TrimSpace(req.OwnerID)
	firstName := strings.TrimSpace(req.FirstName)
	lastName := strings.TrimSpace(req.LastName)
	phoneNumber := strings.TrimSpace(req.PhoneNumber)
	email := strings.TrimSpace(req.Email)

	if ownerType == "existing" && ownerID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "owner id is required")
	}
	if ownerType == "new" {
		if firstName == "" {
			return fiber.NewError(fiber.StatusBadRequest, "first name is required")
		}
		if lastName == "" {
			return fiber.NewError(fiber.StatusBadRequest, "last name is required")
		}
		if phoneNumber == "" {
			return fiber.NewError(fiber.StatusBadRequest, "phone number is required")
		}
	}

	hn := normalizeHN(req.HN)
	if hn == "" {
		hn = generateHN()
	}

	userID, _ := c.Locals("user_id").(string)

	var createdPet dbm.Pet
	var createdOwner dbm.PetOwner

	txErr := h.db.WithContext(c.Context()).Transaction(func(tx *gorm.DB) error {
		if ownerType == "existing" {
			if err := tx.Preload("Pets").Where("id = ?", ownerID).First(&createdOwner).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return fiber.NewError(fiber.StatusNotFound, "owner not found")
				}
				return err
			}
		} else {
			createdOwner = dbm.PetOwner{
				ID:                uuid.NewString(),
				FirstName:         firstName,
				LastName:          lastName,
				PhoneNumber:       phoneNumber,
				PhoneNumberSearch: normalizePhoneSearch(phoneNumber),
				Email:             toOptionalString(email),
				CreatedByUserID:   toOptionalString(userID),
			}

			if err := tx.Create(&createdOwner).Error; err != nil {
				return err
			}
			createdOwner.Pets = nil
		}

		createdPet = dbm.Pet{
			ID:                uuid.NewString(),
			HN:                hn,
			PatientName:       patientName,
			Species:           species,
			Sex:               sex,
			BreedType:         breedType,
			MixedBreedNote:    toOptionalString(req.MixedBreedNote),
			NeuteredStatus:    neuteredStatus,
			HousingCondition:  housingCondition,
			AgeType:           ageType,
			Years:             req.Years,
			Months:            req.Months,
			BirthDate:         birthDate,
			Weight:            req.Weight,
			HealthStatus:      healthStatus,
			ActiveScoreTab:    activeScoreTab,
			VisualActiveScore: toOptionalString(visualActiveScore),
			OwnerID:           createdOwner.ID,
			CreatedByUserID:   toOptionalString(userID),
		}

		if breedType != "mixed" {
			createdPet.MixedBreedNote = nil
		}
		if activeScoreTab != "visual" {
			createdPet.VisualActiveScore = nil
		}

		if err := tx.Create(&createdPet).Error; err != nil {
			return err
		}

		return tx.Preload("Owner.Pets").Where("id = ?", createdPet.ID).First(&createdPet).Error
	})
	if txErr != nil {
		var fiberErr *fiber.Error
		if errors.As(txErr, &fiberErr) {
			return fiberErr
		}
		if isUniqueConstraintError(txErr) {
			return fiber.NewError(fiber.StatusConflict, "hn already exists")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "failed to register pet")
	}

	return c.Status(fiber.StatusCreated).JSON(toPetResponse(createdPet))
}

func (h *PetHandler) List(c *fiber.Ctx) error {
	query := strings.TrimSpace(c.Query("query"))
	limit := c.QueryInt("limit", 100)
	if limit < 1 {
		limit = 100
	}
	if limit > 200 {
		limit = 200
	}

	base := h.db.WithContext(c.Context()).Model(&dbm.Pet{})
	if query != "" {
		like := "%" + strings.ToLower(query) + "%"
		phoneQuery := normalizePhoneSearch(query)
		base = base.Joins("LEFT JOIN pet_owners ON pet_owners.id = pets.owner_id")
		if phoneQuery != "" {
			base = base.Where(
				`LOWER(pets.hn) LIKE ?
				OR LOWER(pets.patient_name) LIKE ?
				OR LOWER(pets.species) LIKE ?
				OR LOWER(COALESCE(pet_owners.first_name, '') || ' ' || COALESCE(pet_owners.last_name, '')) LIKE ?
				OR pet_owners.phone_number_search LIKE ?`,
				like,
				like,
				like,
				like,
				"%"+phoneQuery+"%",
			)
		} else {
			base = base.Where(
				`LOWER(pets.hn) LIKE ?
				OR LOWER(pets.patient_name) LIKE ?
				OR LOWER(pets.species) LIKE ?
				OR LOWER(COALESCE(pet_owners.first_name, '') || ' ' || COALESCE(pet_owners.last_name, '')) LIKE ?`,
				like,
				like,
				like,
				like,
			)
		}
	}

	countQuery := base.Session(&gorm.Session{})
	var total int64
	if err := countQuery.Distinct("pets.id").Count(&total).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to count pets")
	}

	var pets []dbm.Pet
	listQuery := base.Session(&gorm.Session{})
	if err := listQuery.
		Preload("Owner.Pets").
		Order("pets.created_at desc").
		Limit(limit).
		Find(&pets).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to fetch pets")
	}

	out := make([]petResponse, 0, len(pets))
	for _, pet := range pets {
		out = append(out, toPetResponse(pet))
	}

	return c.JSON(fiber.Map{
		"data":  out,
		"total": total,
		"limit": limit,
		"query": query,
	})
}

func (h *PetHandler) GetByID(c *fiber.Ctx) error {
	petID := strings.TrimSpace(c.Params("id"))
	if petID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "pet id is required")
	}

	var pet dbm.Pet
	if err := h.db.WithContext(c.Context()).
		Preload("Owner.Pets").
		Where("id = ?", petID).
		First(&pet).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "pet not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "failed to fetch pet")
	}

	return c.JSON(toPetResponse(pet))
}

func (h *PetHandler) SearchOwners(c *fiber.Ctx) error {
	query := strings.TrimSpace(c.Query("query"))
	limit := c.QueryInt("limit", 8)
	if limit < 1 {
		limit = 8
	}
	if limit > 20 {
		limit = 20
	}

	db := h.db.WithContext(c.Context()).Model(&dbm.PetOwner{})
	if query != "" {
		like := "%" + strings.ToLower(query) + "%"
		phoneQuery := normalizePhoneSearch(query)
		if phoneQuery != "" {
			db = db.Where(
				`LOWER(first_name) LIKE ?
				OR LOWER(last_name) LIKE ?
				OR LOWER(first_name || ' ' || last_name) LIKE ?
				OR LOWER(COALESCE(email, '')) LIKE ?
				OR phone_number_search LIKE ?`,
				like,
				like,
				like,
				like,
				"%"+phoneQuery+"%",
			)
		} else {
			db = db.Where(
				`LOWER(first_name) LIKE ?
				OR LOWER(last_name) LIKE ?
				OR LOWER(first_name || ' ' || last_name) LIKE ?
				OR LOWER(COALESCE(email, '')) LIKE ?`,
				like,
				like,
				like,
				like,
			)
		}
	}

	countQuery := db.Session(&gorm.Session{})
	var total int64
	if err := countQuery.Count(&total).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to count owners")
	}

	var owners []dbm.PetOwner
	listQuery := db.Session(&gorm.Session{})
	if err := listQuery.
		Preload("Pets").
		Order("updated_at desc").
		Limit(limit).
		Find(&owners).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to fetch owners")
	}

	out := make([]petOwnerResponse, 0, len(owners))
	for _, owner := range owners {
		out = append(out, toPetOwnerResponse(owner))
	}

	return c.JSON(fiber.Map{
		"data":  out,
		"total": total,
		"limit": limit,
		"query": query,
	})
}
