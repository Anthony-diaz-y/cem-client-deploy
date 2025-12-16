// Demo mode helper - Auto-setup user data for demo purposes
import { MOCK_MODE } from "../services/apiConnector";
import { mockUserData } from "./mockData";

/**
 * Initialize demo user data in localStorage
 * @param {string} userType - 'Student' or 'Instructor'
 */
export const initializeDemoUser = (userType = "Student") => {
  if (!MOCK_MODE || typeof window === "undefined") return;

  const userData =
    userType === "Instructor" ? mockUserData.instructor : mockUserData.student;

  // Set token
  localStorage.setItem("token", JSON.stringify("demo-token-" + Date.now()));

  // Set user data
  localStorage.setItem("user", JSON.stringify(userData));

  console.log(`🎭 Demo mode initialized as ${userType}:`, userData);
};

/**
 * Switch between Student and Instructor demo accounts
 */
export const switchDemoAccount = () => {
  if (!MOCK_MODE || typeof window === "undefined") return;

  const currentUser = localStorage.getItem("user");
  let newUserType = "Student";

  if (currentUser) {
    try {
      const parsed = JSON.parse(currentUser);
      newUserType = parsed.accountType === "Student" ? "Instructor" : "Student";
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }

  initializeDemoUser(newUserType);
  window.location.reload();
};

/**
 * Clear demo data
 */
export const clearDemoData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
};

/**
 * Check if demo mode is active and auto-initialize if needed
 */
export const checkAndInitializeDemo = () => {
  if (!MOCK_MODE || typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If no user data exists in demo mode, initialize as Student
  if (!token || !user) {
    initializeDemoUser("Student");
    return true;
  }

  return true;
};
