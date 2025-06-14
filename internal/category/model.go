package category

import (
	"time"
)

// Category represents a category for organizing listings.
type Category struct {
	ID          string    `json:"id"` // UUID
	Name        string    `json:"name"`
	Slug        string    `json:"slug"` // URL-friendly version of the name
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	// ParentCategoryID string `json:"parent_category_id,omitempty"` // For sub-categories, if needed later
	// ListingCount int `json:"listing_count,omitempty"` // Could be a derived field
}
