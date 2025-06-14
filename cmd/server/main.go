package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings" // For path parsing
	"time"

	"seattle-info-platform/internal/category" // For mock data generation
	"seattle-info-platform/internal/listing"
	"seattle-info-platform/internal/user" // Assuming go.mod is seattle-info-platform

	"github.com/google/uuid" // For generating new category IDs
)

// HealthCheckResponse defines the structure for the health check endpoint
type HealthCheckResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	response := HealthCheckResponse{
		Status:  "UP",
		Message: "Seattle Info API is healthy!",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding health check response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

// --- Mock Data Store ---
var mockUsers = []user.User{
	{ID: "user1", Email: "pending1@example.com", FirstName: "Pending", LastName: "UserOne", Role: user.RoleUser, Status: user.StatusPendingApproval, RegistrationDate: time.Now().Add(-24 * time.Hour), CreatedAt: time.Now().Add(-24 * time.Hour), UpdatedAt: time.Now().Add(-24 * time.Hour)},
	{ID: "user2", Email: "activeuser@example.com", FirstName: "Active", LastName: "UserTwo", Role: user.RoleUser, Status: user.StatusActive, RegistrationDate: time.Now().Add(-48 * time.Hour), CreatedAt: time.Now().Add(-48 * time.Hour), UpdatedAt: time.Now().Add(-48 * time.Hour)},
	{ID: "user3", Email: "pending2@example.com", FirstName: "Pending", LastName: "UserThree", Role: user.RoleUser, Status: user.StatusPendingApproval, RegistrationDate: time.Now().Add(-72 * time.Hour), CreatedAt: time.Now().Add(-72 * time.Hour), UpdatedAt: time.Now().Add(-72 * time.Hour)},
	{ID: "admin1", Email: "admin@example.com", FirstName: "Admin", LastName: "Super", Role: user.RoleAdmin, Status: user.StatusActive, RegistrationDate: time.Now().Add(-96 * time.Hour), CreatedAt: time.Now().Add(-96 * time.Hour), UpdatedAt: time.Now().Add(-96 * time.Hour)},
}

var mockCategories = []category.Category{
	{ID: "cat1", Name: "Electronics", Slug: "electronics", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	{ID: "cat2", Name: "Furniture", Slug: "furniture", CreatedAt: time.Now(), UpdatedAt: time.Now()},
}

var mockListings = []listing.Listing{
	{ID: "listing1", Title: "Pending Laptop", Description: "A great laptop, awaiting approval.", Status: listing.StatusPendingApproval, SubmitterID: "user1", CategoryID: "cat1", CreationDate: time.Now().Add(-5 * time.Hour), LastUpdatedDate: time.Now().Add(-5 * time.Hour), CreatedAt: time.Now().Add(-5 * time.Hour), UpdatedAt: time.Now().Add(-5 * time.Hour)},
	{ID: "listing2", Title: "Active Chair", Description: "A comfortable office chair.", Status: listing.StatusActive, SubmitterID: "user2", CategoryID: "cat2", CreationDate: time.Now().Add(-10 * time.Hour), LastUpdatedDate: time.Now().Add(-10 * time.Hour), CreatedAt: time.Now().Add(-10 * time.Hour), UpdatedAt: time.Now().Add(-10 * time.Hour)},
	{ID: "listing3", Title: "Another Pending Item", Description: "Something else to review.", Status: listing.StatusPendingApproval, SubmitterID: "user1", CategoryID: "cat1", CreationDate: time.Now().Add(-2 * time.Hour), LastUpdatedDate: time.Now().Add(-2 * time.Hour), CreatedAt: time.Now().Add(-2 * time.Hour), UpdatedAt: time.Now().Add(-2 * time.Hour)},
}
// --- End Mock Data Store ---

func adminListUsersHandler(w http.ResponseWriter, r *http.Request) {
	statusFilter := r.URL.Query().Get("status")
	var resultUsers []user.User

	log.Printf("GET /admin/users query_status: %s", statusFilter)

	for _, u := range mockUsers {
		if statusFilter != "" {
			// Ensure comparison is between strings
			if string(u.Status) == statusFilter {
				resultUsers = append(resultUsers, u)
			}
		} else {
			resultUsers = append(resultUsers, u)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resultUsers); err != nil {
		log.Printf("Error encoding user list: %v", err)
		http.Error(w, "Failed to encode users", http.StatusInternalServerError)
	}
}

func adminApproveUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

    // Path is expected to be like /admin/users/{userId}/approve
	// r.URL.Path will be passed from the main router, e.g. "/admin/users/user1/approve"
	parts := strings.Split(r.URL.Path, "/") // ["", "admin", "users", "userId", "approve"]
	if len(parts) < 5 {
		log.Printf("Invalid path for approve user: %s", r.URL.Path)
		http.Error(w, "Invalid URL path structure for approve user. Expected /admin/users/{userId}/approve", http.StatusBadRequest)
		return
	}
	userId := parts[len(parts)-2] // userId is the second to last part
	log.Printf("POST /admin/users/%s/approve", userId)

	for i := range mockUsers {
		if mockUsers[i].ID == userId {
			if mockUsers[i].Status == user.StatusPendingApproval {
				mockUsers[i].Status = user.StatusActive
				mockUsers[i].UpdatedAt = time.Now()
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(mockUsers[i])
				log.Printf("User %s approved successfully", userId)
				return
			}
			log.Printf("User %s is not in pending approval state. Current status: %s", userId, mockUsers[i].Status)
			http.Error(w, "User not in pending approval state or already active", http.StatusBadRequest)
			return
		}
	}
	log.Printf("User %s not found for approval", userId)
	http.Error(w, "User not found", http.StatusNotFound)
}

func adminRejectUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}
    // Path is expected to be like /admin/users/{userId}/reject
	parts := strings.Split(r.URL.Path, "/") // ["", "admin", "users", "userId", "reject"]
	if len(parts) < 5 {
		log.Printf("Invalid path for reject user: %s", r.URL.Path)
		http.Error(w, "Invalid URL path structure for reject user. Expected /admin/users/{userId}/reject", http.StatusBadRequest)
		return
	}
	userId := parts[len(parts)-2]
	log.Printf("POST /admin/users/%s/reject", userId)

	for i := range mockUsers {
		if mockUsers[i].ID == userId {
			if mockUsers[i].Status == user.StatusPendingApproval {
				// mockUsers[i].Status = user.StatusRejected // If we implement this status
				mockUsers[i].UpdatedAt = time.Now()
				log.Printf("User %s rejected (simulated)", userId)
				w.WriteHeader(http.StatusOK)
				responseMsg := map[string]string{"message": "User rejected (simulated)", "userId": userId}
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(responseMsg)
				return
			}
			log.Printf("User %s not in pending approval state for rejection. Current status: %s", userId, mockUsers[i].Status)
			http.Error(w, "User not in pending approval state", http.StatusBadRequest)
			return
		}
	}
	log.Printf("User %s not found for rejection", userId)
	http.Error(w, "User not found", http.StatusNotFound)
}

type UpdateRoleRequest struct {
	Role user.UserRole `json:"role"`
}

func adminChangeUserRoleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Only PUT method is allowed", http.StatusMethodNotAllowed)
		return
	}
    // Path is expected to be like /admin/users/{userId}/role
	parts := strings.Split(r.URL.Path, "/") // ["", "admin", "users", "userId", "role"]
	if len(parts) < 5 {
		log.Printf("Invalid path for change user role: %s", r.URL.Path)
		http.Error(w, "Invalid URL path structure for change user role. Expected /admin/users/{userId}/role", http.StatusBadRequest)
		return
	}
	userId := parts[len(parts)-2]
	log.Printf("PUT /admin/users/%s/role", userId)

	var req UpdateRoleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding change role request for user %s: %v", userId, err)
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Role != user.RoleAdmin && req.Role != user.RoleUser {
		log.Printf("Invalid role specified for user %s: %s", userId, req.Role)
		http.Error(w, "Invalid role specified. Must be 'user' or 'admin'.", http.StatusBadRequest)
		return
	}

	for i := range mockUsers {
		if mockUsers[i].ID == userId {
			mockUsers[i].Role = req.Role
			mockUsers[i].UpdatedAt = time.Now()
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(mockUsers[i])
			log.Printf("User %s role changed to %s successfully", userId, req.Role)
			return
		}
	}
	log.Printf("User %s not found for role change", userId)
	http.Error(w, "User not found", http.StatusNotFound)
}

func adminListListingsHandler(w http.ResponseWriter, r *http.Request) {
	statusFilter := r.URL.Query().Get("status")
	var resultListings []listing.Listing
	log.Printf("GET /admin/listings query_status: %s", statusFilter)

	for _, l := range mockListings {
		if statusFilter != "" {
			if string(l.Status) == statusFilter {
				resultListings = append(resultListings, l)
			}
		} else {
			resultListings = append(resultListings, l)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resultListings); err != nil {
		log.Printf("Error encoding listing list: %v", err)
		http.Error(w, "Failed to encode listings", http.StatusInternalServerError)
	}
}

// AdminUpdateListingStatusRequest defines the expected body for updating listing status
type AdminUpdateListingStatusRequest struct {
	Status          listing.ListingStatus `json:"status"`
	RejectionReason string                `json:"rejectionReason,omitempty"`
}

func adminUpdateListingStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Only PUT method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// Path is expected to be like /admin/listings/{listingId}/status
	parts := strings.Split(r.URL.Path, "/") // ["", "admin", "listings", "listingId", "status"]
	if len(parts) < 5 {
		log.Printf("Invalid path for update listing status: %s", r.URL.Path)
		http.Error(w, "Invalid URL path structure. Expected /admin/listings/{listingId}/status", http.StatusBadRequest)
		return
	}
	listingId := parts[len(parts)-2] // listingId is the second to last part
	log.Printf("PUT /admin/listings/%s/status", listingId)

	var req AdminUpdateListingStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding update listing status request for listing %s: %v", listingId, err)
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate status
	isValidStatus := false
	validStatuses := []listing.ListingStatus{
		listing.StatusActive,
		listing.StatusRejected,
		listing.StatusExpired,
		listing.StatusAdminRemoved,
		listing.StatusPendingApproval, // Though admin usually moves it out of pending
	}
	for _, s := range validStatuses {
		if req.Status == s {
			isValidStatus = true
			break
		}
	}
	if !isValidStatus {
		log.Printf("Invalid status value provided for listing %s: %s", listingId, req.Status)
		http.Error(w, "Invalid status value provided", http.StatusBadRequest)
		return
	}

	for i := range mockListings {
		if mockListings[i].ID == listingId {
			mockListings[i].Status = req.Status
			mockListings[i].LastUpdatedDate = time.Now()
			mockListings[i].UpdatedAt = time.Now()
			if req.Status == listing.StatusRejected && req.RejectionReason != "" {
				mockListings[i].RejectionReason = req.RejectionReason
			} else if req.Status != listing.StatusRejected {
				mockListings[i].RejectionReason = "" // Clear rejection reason if not rejected
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(mockListings[i])
			log.Printf("Listing %s status updated to %s", listingId, req.Status)
			return
		}
	}

	log.Printf("Listing %s not found for status update", listingId)
	http.Error(w, "Listing not found", http.StatusNotFound)
}

// Add new handlers
func adminListCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Only GET method is allowed", http.StatusMethodNotAllowed)
		return
	}
	log.Printf("GET /admin/categories")

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(mockCategories); err != nil {
		log.Printf("Error encoding category list: %v", err)
		http.Error(w, "Failed to encode categories", http.StatusInternalServerError)
	}
}

// AdminCreateCategoryRequest defines the expected body for creating a category
type AdminCreateCategoryRequest struct {
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

func adminCreateCategoryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AdminCreateCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding create category request: %v", err)
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		log.Printf("Category name is required")
		http.Error(w, "Category name is required", http.StatusBadRequest)
		return
	}

	// Generate slug (simple version for now)
	slug := strings.ToLower(strings.ReplaceAll(req.Name, " ", "-"))

	newCategory := category.Category{
		ID:          uuid.New().String(), // Generate new UUID for ID
		Name:        req.Name,
		Slug:        slug,
		Description: req.Description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	mockCategories = append(mockCategories, newCategory)
	log.Printf("POST /admin/categories - Created category: %s (ID: %s)", newCategory.Name, newCategory.ID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(newCategory); err != nil {
		log.Printf("Error encoding new category: %v", err)
		// Already sent 201, so can't send new error header easily.
	}
}

func main() {
	mux := http.NewServeMux()

	apiV1 := http.NewServeMux()
	apiV1.HandleFunc("/health", healthCheckHandler) // Path seen by handler: /health

	// Admin User Management API Endpoints
	// Path seen by adminListUsersHandler: /admin/users
	apiV1.HandleFunc("/admin/users", adminListUsersHandler)

	// Path seen by this dispatcher: /admin/users/....
	apiV1.HandleFunc("/admin/users/", func(w http.ResponseWriter, r *http.Request) {
		// r.URL.Path here will be the full path relative to apiV1, e.g., "/admin/users/user1/approve"
		log.Printf("Routing admin user action for path: %s", r.URL.Path)
        if strings.HasSuffix(r.URL.Path, "/approve") {
            adminApproveUserHandler(w, r)
        } else if strings.HasSuffix(r.URL.Path, "/reject") {
            adminRejectUserHandler(w, r)
        } else if strings.HasSuffix(r.URL.Path, "/role") {
            adminChangeUserRoleHandler(w, r)
        } else {
            log.Printf("Path %s did not match any user action sub-routes.", r.URL.Path)
			http.NotFound(w, r)
		}
	})

	// Admin Listing Management API Endpoints
	apiV1.HandleFunc("/admin/listings", adminListListingsHandler) // GET /api/v1/admin/listings
	apiV1.HandleFunc("/admin/listings/", func(w http.ResponseWriter, r *http.Request) {
		// r.URL.Path here will be e.g., "/admin/listings/listing123/status"
		log.Printf("Routing admin listing action for path: %s", r.URL.Path)
		if strings.HasSuffix(r.URL.Path, "/status") && r.Method == http.MethodPut {
			adminUpdateListingStatusHandler(w, r)
		} else {
			log.Printf("Path %s did not match any listing action sub-routes.", r.URL.Path)
			http.NotFound(w, r)
		}
	})

	// Admin Category Management API Endpoints
	apiV1.HandleFunc("/admin/categories", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Routing admin category action for path: %s, method: %s", r.URL.Path, r.Method)
		if r.URL.Path == "/admin/categories" { // Ensure it matches exactly for the collection endpoint
			if r.Method == http.MethodGet {
				adminListCategoriesHandler(w, r)
			} else if r.Method == http.MethodPost {
				adminCreateCategoryHandler(w, r)
			} else {
				http.Error(w, "Method not allowed for /admin/categories", http.StatusMethodNotAllowed)
			}
		} else {
			// Handle specific category actions like /admin/categories/{id} if added later
			http.NotFound(w, r)
		}
	})

	// Prefix /api/v1 to all routes in apiV1
	mux.Handle("/api/v1/", http.StripPrefix("/api/v1", apiV1))

	// Admin frontend static files
	adminFS := http.FileServer(http.Dir("./web/admin"))
	mux.Handle("/admin/", http.StripPrefix("/admin/", adminFS)) // Serves index.html from /admin/

	// Root path
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Welcome to Seattle Info Platform API"))
	})

	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux, // Using the custom mux
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Println("Starting server on :8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
