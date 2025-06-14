package listing

import (
	"time"
)

// ListingStatus defines the possible statuses of a listing.
type ListingStatus string

const (
	StatusPendingApproval ListingStatus = "pending_approval"
	StatusActive          ListingStatus = "active"
	StatusRejected        ListingStatus = "rejected"
	StatusExpired         ListingStatus = "expired"
	StatusAdminRemoved    ListingStatus = "admin_removed"
)

// Listing represents an item or piece of information on the platform.
type Listing struct {
	ID              string        `json:"id"` // UUID
	Title           string        `json:"title"`
	Description     string        `json:"description"`
	Status          ListingStatus `json:"status"`
	SubmitterID     string        `json:"submitter_id"`      // Foreign key to User model
	CategoryID      string        `json:"category_id"`       // Foreign key to Category model
	CreationDate    time.Time     `json:"creation_date"`     // Alias for CreatedAt for consistency with docs
	LastUpdatedDate time.Time     `json:"last_updated_date"` // Alias for UpdatedAt
	RejectionReason string        `json:"rejection_reason,omitempty"`

	// Optional fields from documentation (can be expanded later)
	// Price           *float64  `json:"price,omitempty"` // Use pointer for optional
	// Latitude        *float64  `json:"latitude,omitempty"`
	// Longitude       *float64  `json:"longitude,omitempty"`
	// ContactName     string    `json:"contact_name,omitempty"`
	// ContactEmail    string    `json:"contact_email,omitempty"`
	// ContactPhone    string    `json:"contact_phone,omitempty"`
	// AddressLine1    string    `json:"address_line1,omitempty"`
	// City            string    `json:"city,omitempty"`
	// State           string    `json:"state,omitempty"`
	// ZipCode         string    `json:"zip_code,omitempty"`
	// ExpiresAt       *time.Time `json:"expires_at,omitempty"` // For listings that can expire

	// Timestamps
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// User and Category details (can be populated by a service)
	// User     *user.User         `json:"user,omitempty"`
	// Category *category.Category `json:"category,omitempty"`
}
