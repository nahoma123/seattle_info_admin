import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOutInternal, // Alias to avoid naming conflict if we export signOut
  onAuthStateChanged as firebaseOnAuthStateChanged // Alias for clarity
} from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig'; // Import the configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("Firebase Auth initialized in authService.js");

/**
 * Signs in a user with email and password using Firebase.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} A promise that resolves to the Firebase ID token.
 */
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    console.log("Firebase ID Token (after sign-in in authService):", idToken);
    return { token: idToken, user: { email: user.email, uid: user.uid } }; // Return token and basic user info
  } catch (error) {
    console.error("Firebase Sign In Error in authService:", error);
    // Transform Firebase error to a more generic error message if desired
    throw new Error(error.message || 'Failed to sign in.');
  }
};

/**
 * Signs out the current Firebase user.
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await firebaseSignOutInternal(auth);
    console.log("User signed out from Firebase in authService.");
  } catch (error) {
    console.error("Firebase Sign Out Error in authService:", error);
    throw new Error(error.message || 'Failed to sign out.');
  }
};

/**
 * Registers a callback to be invoked when the Firebase auth state changes.
 * @param {function} callback - The function to call with the user object (or null).
 * @returns {import('firebase/auth').Unsubscribe} The unsubscribe function.
 */
export const onAuthUserChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};


// Placeholder for verifyTokenAndGetUser which might call your backend's /api/v1/auth/me
// This is important if the Firebase token itself doesn't contain all necessary admin claims/roles
// and you need your backend to confirm the user's admin status.
export const verifyTokenAndGetAdminDetails = async (token) => {
  // For now, assume token is enough or backend handles admin role verification on each protected route.
  // If your /api/v1/auth/me endpoint exists and returns admin-specific details:
  /*
  try {
    const response = await axios.get('/api/v1/auth/me', { // Assuming proxy is set up
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data; // e.g., { id, email, role, ... }
  } catch (error) {
    console.error('Error verifying token with backend /auth/me', error);
    throw error;
  }
  */
  // Mocking for now if the token itself is considered as admin proof
  if (token) {
    // In a real scenario, you might decode the token here (if not done by Firebase)
    // or simply pass it to the context. The backend will do the ultimate validation.
    // For admin dashboard, usually the user object from Firebase (email, uid) is enough for client-side,
    // and backend API calls using this token will determine if user has admin rights.
    return Promise.resolve({ role: 'admin' }); // Placeholder
  }
  return Promise.reject("No token to verify.");
};


const authService = {
  signInUser,
  signOutUser,
  onAuthUserChanged,
  verifyTokenAndGetAdminDetails,
  // getAuth, // Expose auth instance if needed elsewhere, though usually encapsulated.
};

export default authService;
