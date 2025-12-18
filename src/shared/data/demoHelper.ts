// Demo mode helper - Auto-setup user data for demo purposes
// NOTA: Este archivo solo se usa cuando MOCK_MODE está activado
// Cuando MOCK_MODE = false, estas funciones no se ejecutan
import { MOCK_MODE } from "../services/apiConnector";

/**
 * Initialize demo user data in localStorage
 * @param {string} userType - 'Student' or 'Instructor'
 */
export const initializeDemoUser = (userType = "Student") => {
  if (!MOCK_MODE || typeof window === "undefined") return;
  // Esta función solo funciona en modo demo/MOCK
  // Cuando MOCK_MODE = false, no hace nada
  console.log(`🎭 Demo mode disabled - use real backend login instead`);
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
