package gormrepo

import (
	"context"
	"errors"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"

	dbm "github.com/prasertnuannim/sert_v3/internal/adapter/persistence/gorm/model"
	"github.com/prasertnuannim/sert_v3/internal/domain/entity"
	"github.com/prasertnuannim/sert_v3/internal/domain/errorx"
)

type UserRepo struct{ db *gorm.DB }

func NewUserRepo(db *gorm.DB) *UserRepo { return &UserRepo{db: db} }

func isUniqueConstraintError(err error) bool {
	if err == nil {
		return false
	}
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "duplicate key value") || strings.Contains(msg, "unique constraint")
}

func toOptionalString(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}

func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*entity.User, error) {
	var m dbm.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&m).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errorx.ErrUserNotFound
		}
		return nil, err
	}
	return mapUser(m), nil
}

func (r *UserRepo) Create(ctx context.Context, user *entity.User) error {
	email := user.Email
	passwordHash := user.PasswordHash
	name := user.Name
	tenant := strings.TrimSpace(user.Tenant)
	promotion := strings.TrimSpace(user.Promotion)

	m := dbm.User{
		ID:                 user.ID,
		Email:              &email,
		PasswordHash:       &passwordHash,
		Name:               &name,
		Role:               user.Role,
		Tenant:             toOptionalString(tenant),
		Promotion:          toOptionalString(promotion),
		MustChangePassword: user.MustChangePassword,
	}

	if err := r.db.WithContext(ctx).Create(&m).Error; err != nil {
		if isUniqueConstraintError(err) {
			return errorx.ErrEmailAlreadyExists
		}
		return err
	}

	return nil
}

func (r *UserRepo) UpdatePassword(
	ctx context.Context,
	userID string,
	passwordHash string,
	mustChangePassword bool,
) error {
	result := r.db.WithContext(ctx).
		Model(&dbm.User{}).
		Where("id = ?", userID).
		Updates(map[string]any{
			"password_hash":        passwordHash,
			"must_change_password": mustChangePassword,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errorx.ErrUserNotFound
	}

	return nil
}

func (r *UserRepo) GetByID(ctx context.Context, id string) (*entity.User, error) {
	var m dbm.User
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&m).Error
	if err != nil {
		return nil, err
	}
	return mapUser(m), nil
}

func (r *UserRepo) EnsureSeedUser(ctx context.Context, email, passwordHash, name, role string) error {
	var m dbm.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&m).Error
	if err == nil {
		updates := map[string]any{}
		if m.PasswordHash == nil || *m.PasswordHash == "" {
			updates["password_hash"] = passwordHash
		}
		if m.Name == nil || *m.Name == "" {
			updates["name"] = name
		}
		if m.Role == "" {
			updates["role"] = role
		}
		if len(updates) > 0 {
			return r.db.WithContext(ctx).Model(&m).Updates(updates).Error
		}
		return nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	return r.db.WithContext(ctx).Create(&dbm.User{
		ID:           uuid.NewString(),
		Email:        &email,
		PasswordHash: &passwordHash,
		Name:         &name,
		Role:         role,
	}).Error
}

func mapUser(m dbm.User) *entity.User {
	email := ""
	if m.Email != nil {
		email = *m.Email
	}

	name := ""
	if m.Name != nil {
		name = *m.Name
	}

	passwordHash := ""
	if m.PasswordHash != nil {
		passwordHash = *m.PasswordHash
	}

	tenant := ""
	if m.Tenant != nil {
		tenant = *m.Tenant
	}

	promotion := ""
	if m.Promotion != nil {
		promotion = *m.Promotion
	}

	role := m.Role
	if role == "" {
		role = entity.RoleUser
	}

	return &entity.User{
		ID:                 m.ID,
		Email:              email,
		PasswordHash:       passwordHash,
		Name:               name,
		Role:               role,
		Tenant:             tenant,
		Promotion:          promotion,
		MustChangePassword: m.MustChangePassword,
		CreatedAt:          m.CreatedAt,
		UpdatedAt:          m.UpdatedAt,
	}
}
