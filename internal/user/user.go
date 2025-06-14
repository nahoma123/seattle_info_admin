package user

// This file can be used for user service logic in the future.
// For now, it just ensures the package is valid.

func GetMockUser(id string) *User {
	// This is a mock function. In a real application, you would fetch this from a database.
	return &User{
		ID: id,
		Email: "user_" + id + "@example.com",
		FirstName: "Mock",
		LastName: "User",
		Role: RoleUser,
		Status: StatusActive,
		// Populate other fields as necessary
	}
}
