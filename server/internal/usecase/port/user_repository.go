package port

import (
	"context"

	"github.com/prasertnuannim/sert_v3/internal/domain/entity"
)

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*entity.User, error)
	GetByID(ctx context.Context, id string) (*entity.User, error)
	Create(ctx context.Context, user *entity.User) error
	UpdatePassword(ctx context.Context, userID string, passwordHash string, mustChangePassword bool) error
	EnsureSeedUser(ctx context.Context, email, passwordHash, name, role string) error
}
