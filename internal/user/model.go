package user

import (
	"time"
)

// UserRole defines the roles a user can have
type UserRole string

const (
	RoleUser  UserRole = "user"
	RoleAdmin UserRole = "admin"
)

// UserStatus defines the possible statuses of a user account
type UserStatus string

const (
	StatusPendingApproval UserStatus = "Pending Approval"
	StatusActive          UserStatus = "Active"
	// Conceptual statuses for future use (not directly managed in MVP for approval workflow)
	// StatusSuspended UserStatus = "Suspended"
	// StatusInactive UserStatus = "Inactive"
	// StatusRejected UserStatus = "Rejected" // Or simply delete
)

// User represents a user in the system.
type User struct {
	ID                string     `json:"id"` // UUID
	Email             string     `json:"email"`
	FirstName         string     `json:"first_name,omitempty"`
	LastName          string     `json:"last_name,omitempty"`
	Role              UserRole   `json:"role"`
	Status            UserStatus `json:"status"`
	RegistrationDate  time.Time  `json:"registration_date"`
	LastLoginDate     time.Time  `json:"last_login_date,omitempty"`
	ProfilePictureURL string     `json:"profile_picture_url,omitempty"`
	AuthProvider      string     `json:"auth_provider,omitempty"` // e.g., "firebase"
	IsEmailVerified   bool       `json:"is_email_verified,omitempty"`
	// IsFirstPostApproved bool       `json:"is_first_post_approved,omitempty"` // specific to app logic, maybe not for generic user model
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}
