const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
  // ⚠️ TEMPORAL: Endpoint para comprar cursos sin pasarela de pago - REMOVER cuando se implemente la pasarela
  BUY_NOW_TEMPORARY_API: BASE_URL + "/payment/buyNowTemporary",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/category/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  UPDATE_RATING_API: BASE_URL + "/course/updateRating",
  GET_REVIEWS_API: BASE_URL + "/course/reviews",
  GET_USER_REVIEW_API: BASE_URL + "/course/review",
  GET_RATING_STATS_API: BASE_URL + "/course/rating",
}

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/category/showAllCategories",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/category/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/contact",
  GET_CONTACT_MESSAGES_API: BASE_URL + "/contact/messages",
  GET_CONTACT_MESSAGE_API: BASE_URL + "/contact/messages",
  GET_CONTACT_STATS_API: BASE_URL + "/contact/stats",
  MARK_MESSAGE_READ_API: BASE_URL + "/contact/messages",
  ARCHIVE_MESSAGE_API: BASE_URL + "/contact/messages",
  DELETE_MESSAGE_API: BASE_URL + "/contact/messages",
  REPLY_MESSAGE_API: BASE_URL + "/contact/messages",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateUserProfileImage",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// ADMIN ENDPOINTS
export const adminEndpoints = {
  ADMIN_DASHBOARD_API: BASE_URL + "/admin/dashboard",
  PENDING_INSTRUCTORS_API: BASE_URL + "/admin/pending-instructors",
  ALL_INSTRUCTORS_API: BASE_URL + "/admin/all-instructors",
  APPROVE_INSTRUCTOR_API: BASE_URL + "/admin/approve-instructor",
  REJECT_INSTRUCTOR_API: BASE_URL + "/admin/reject-instructor",
}