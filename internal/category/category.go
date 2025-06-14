package category

// This file can be used for category service logic in the future.
// For now, it just ensures the package is valid.

func GetMockCategory(id string) *Category {
	// This is a mock function. In a real application, you would fetch this from a database.
	return &Category{
		ID: id,
		Name: "Mock Category " + id,
		Slug: "mock-category-" + id,
		Description: "This is a mock category.",
	}
}
