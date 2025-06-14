package listing

import "time"

// This file can be used for listing service logic in the future.
// For now, it just ensures the package is valid.

func GetMockListing(id string, userID string, categoryID string) *Listing {
	// This is a mock function. In a real application, you would fetch this from a database.
	now := time.Now()
	return &Listing{
		ID:              id,
		Title:           "Mock Listing " + id,
		Description:     "This is a detailed description for mock listing " + id + ".",
		Status:          StatusPendingApproval,
		SubmitterID:     userID,
		CategoryID:      categoryID,
		CreationDate:    now,
		LastUpdatedDate: now,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
}
