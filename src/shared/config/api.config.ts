/**
 * Configuración centralizada de la API
 *
 * Esta configuración permite cambiar fácilmente la URL del backend
 * usando variables de entorno para diferentes ambientes (desarrollo, producción).
 *
 * Para Next.js, las variables de entorno deben comenzar con NEXT_PUBLIC_
 * para que sean accesibles en el cliente.
 */

// URL base del backend
// En desarrollo: http://localhost:5000/api/v1
// En producción: https://cem-backend-production.up.railway.app/api/v1
const getApiUrl = (): string => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // Log en desarrollo para debug
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 API_URL configurada:", apiUrl);
  }

  // Advertencia si estamos en producción y usando localhost
  if (
    typeof window !== "undefined" &&
    apiUrl.includes("localhost") &&
    window.location.hostname !== "localhost"
  ) {
    console.error(
      "⚠️ ADVERTENCIA: Estás usando localhost en producción. Configura NEXT_PUBLIC_API_URL en Vercel."
    );
  }

  return apiUrl;
};

export const API_URL = getApiUrl();

/**
 * Endpoints de la API organizados por categoría
 */
export const API_ENDPOINTS = {
  // AUTH ENDPOINTS
  AUTH: {
    SENDOTP: `${API_URL}/auth/sendotp`,
    SIGNUP: `${API_URL}/auth/signup`,
    LOGIN: `${API_URL}/auth/login`,
    RESETPASSTOKEN: `${API_URL}/auth/reset-password-token`,
    RESETPASSWORD: `${API_URL}/auth/reset-password`,
    CHANGEPASSWORD: `${API_URL}/auth/changepassword`,
  },

  // PROFILE ENDPOINTS
  PROFILE: {
    GET_USER_DETAILS: `${API_URL}/profile/getUserDetails`,
    GET_USER_ENROLLED_COURSES: `${API_URL}/profile/getEnrolledCourses`,
    GET_INSTRUCTOR_DATA: `${API_URL}/profile/instructorDashboard`,
    UPDATE_DISPLAY_PICTURE: `${API_URL}/profile/updateUserProfileImage`,
    UPDATE_PROFILE: `${API_URL}/profile/updateProfile`,
    DELETE_PROFILE: `${API_URL}/profile/deleteProfile`,
  },

  // STUDENTS ENDPOINTS
  STUDENT: {
    COURSE_PAYMENT: `${API_URL}/payment/capturePayment`,
    COURSE_VERIFY: `${API_URL}/payment/verifyPayment`,
    SEND_PAYMENT_SUCCESS_EMAIL: `${API_URL}/payment/sendPaymentSuccessEmail`,
    BUY_NOW_TEMPORARY: `${API_URL}/payment/buyNowTemporary`,
  },

  // COURSE ENDPOINTS
  COURSE: {
    GET_ALL: `${API_URL}/course/getAllCourses`,
    GET_DETAILS: `${API_URL}/course/getCourseDetails`,
    GET_FULL_DETAILS_AUTHENTICATED: `${API_URL}/course/getFullCourseDetails`,
    EDIT: `${API_URL}/course/editCourse`,
    CREATE: `${API_URL}/course/createCourse`,
    DELETE: `${API_URL}/course/deleteCourse`,
    CREATE_SECTION: `${API_URL}/course/addSection`,
    UPDATE_SECTION: `${API_URL}/course/updateSection`,
    DELETE_SECTION: `${API_URL}/course/deleteSection`,
    CREATE_SUBSECTION: `${API_URL}/subsection/addSubSection`,
    UPDATE_SUBSECTION: `${API_URL}/subsection/updateSubSection`,
    DELETE_SUBSECTION: `${API_URL}/subsection/`, // Se le añadirá el ID en el servicio
    GET_SUBSECTION: `${API_URL}/subsection/`, // Se le añadirá el ID en el servicio
    GET_INSTRUCTOR_COURSES: `${API_URL}/course/getInstructorCourses`,
    UPDATE_COURSE_PROGRESS: `${API_URL}/course/updateCourseProgress`,
    CREATE_RATING: `${API_URL}/course/createRating`,
  },

  // RATINGS AND REVIEWS
  RATINGS: {
    GET_REVIEWS: `${API_URL}/course/getReviews`,
    CREATE_RATING: `${API_URL}/course/createRating`,
    UPDATE_RATING: `${API_URL}/course/updateRating`,
    GET_REVIEWS_API: `${API_URL}/course/reviews`,
    GET_USER_REVIEW: `${API_URL}/course/review`,
    GET_RATING_STATS: `${API_URL}/course/rating`,
  },

  // CATEGORIES
  CATEGORIES: {
    GET_ALL: `${API_URL}/category/showAllCategories`,
    GET_CATEGORY_PAGE_DETAILS: `${API_URL}/category/getCategoryPageDetails`,
  },

  // CONTACT-US
  CONTACT: {
    SEND_MESSAGE: `${API_URL}/contact`,
    GET_MESSAGES: `${API_URL}/contact/messages`,
    GET_MESSAGE: `${API_URL}/contact/messages`,
    GET_STATS: `${API_URL}/contact/stats`,
    MARK_MESSAGE_READ: `${API_URL}/contact/messages`,
    ARCHIVE_MESSAGE: `${API_URL}/contact/messages`,
    DELETE_MESSAGE: `${API_URL}/contact/messages`,
    REPLY_MESSAGE: `${API_URL}/contact/messages`,
  },

  // ADMIN ENDPOINTS
  ADMIN: {
    DASHBOARD: `${API_URL}/admin/dashboard`,
    PENDING_INSTRUCTORS: `${API_URL}/admin/pending-instructors`,
    ALL_INSTRUCTORS: `${API_URL}/admin/all-instructors`,
    APPROVE_INSTRUCTOR: `${API_URL}/admin/approve-instructor`,
    REJECT_INSTRUCTOR: `${API_URL}/admin/reject-instructor`,
  },

  // SUBSECTION DISCUSSIONS ENDPOINTS
  SUBSECTION_DISCUSSIONS: {
    CREATE_DISCUSSION: `${API_URL}/discussion/subsection-discussion/create`,
    GET_DISCUSSIONS: `${API_URL}/discussion/subsection-discussion`,
    UPDATE_DISCUSSION: `${API_URL}/discussion/subsection-discussion`,
    DELETE_DISCUSSION: `${API_URL}/discussion/subsection-discussion`,
    CREATE_REPLY: `${API_URL}/discussion/subsection-discussion/reply/create`,
    UPDATE_REPLY: `${API_URL}/discussion/subsection-discussion/reply`,
    DELETE_REPLY: `${API_URL}/discussion/subsection-discussion/reply`,
  },
};

// Exportar también la URL base para uso directo si es necesario
export default API_URL;
