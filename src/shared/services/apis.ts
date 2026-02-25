import { API_URL } from "@/shared/config/api.config";

const BASE_URL = API_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp", //usando
  SIGNUP_API: BASE_URL + "/auth/signup", //usando
  LOGIN_API: BASE_URL + "/auth/login", //usando
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
  BUY_NOW_TEMPORARY_API: BASE_URL + "/payment/buyNowTemporary",
  // PayPal Endpoints
  CREATE_PAYPAL_ORDER_API: BASE_URL + "/payment/create-order",
  CAPTURE_PAYPAL_ORDER_API: BASE_URL + "/payment/capture-order",
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses", //usando
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails", //usando
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/subsection/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/subsection/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/subsection/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  REORDER_SECTIONS_API: BASE_URL + "/course/reorderSections",
  REORDER_SUBSECTIONS_API: BASE_URL + "/subsection/reorderSubSections",
  MOVE_SUBSECTION_API: BASE_URL + "/subsection/moveSubSection",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  UPDATE_RATING_API: BASE_URL + "/course/updateRating",
  GET_REVIEWS_API: BASE_URL + "/course/reviews",
  GET_USER_REVIEW_API: BASE_URL + "/course/review",
  GET_RATING_STATS_API: BASE_URL + "/course/rating",
};

// CATAGORIES API
export const categories = {
  GET_ALL_CATEGORIES_API: BASE_URL + "/category/showAllCategories",
  GET_PUBLIC_CATEGORIES_API: BASE_URL + "/category/getPublicCategories",
  CREATE_CATEGORY_API: BASE_URL + "/category/createCategory",
  UPDATE_CATEGORY_API: BASE_URL + "/category/updateCategory",
  DELETE_CATEGORY_API: BASE_URL + "/category/deleteCategory",
  GET_CATEGORY_COURSES_API: BASE_URL + "/category/getCategoryCourses",
  CHANGE_COURSE_CATEGORY_API: BASE_URL + "/category/changeCourseCategory",
  CHANGE_MULTIPLE_COURSES_CATEGORY_API:
    BASE_URL + "/category/changeMultipleCoursesCategory",
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/category/getCategoryCourses",
};

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
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateUserProfileImage",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

// ADMIN ENDPOINTS
export const adminEndpoints = {
  ADMIN_DASHBOARD_API: BASE_URL + "/admin/dashboard",
  PENDING_INSTRUCTORS_API: BASE_URL + "/admin/pending-instructors",
  ALL_INSTRUCTORS_API: BASE_URL + "/admin/all-instructors",
  APPROVE_INSTRUCTOR_API: BASE_URL + "/admin/approve-instructor",
  REJECT_INSTRUCTOR_API: BASE_URL + "/admin/reject-instructor",
  GET_INSTRUCTOR_DETAILS_API: BASE_URL + "/admin/instructor",
  TOGGLE_INSTRUCTOR_STATUS_API: BASE_URL + "/admin/instructor",
  UPDATE_INSTRUCTOR_API: BASE_URL + "/admin/instructor",
  CREATE_INSTRUCTOR_API: BASE_URL + "/admin/instructor",
  PENDING_COURSES_API: BASE_URL + "/admin/pending-courses",
  ALL_COURSES_API: BASE_URL + "/admin/all-courses",
  PUBLISH_COURSE_API: BASE_URL + "/admin/publish-course",
  EDIT_COURSE_ADMIN_API: BASE_URL + "/admin/edit-course",
  DELETE_COURSE_ADMIN_API: BASE_URL + "/admin/delete-course",
  GET_COURSE_DETAILS_ADMIN_API: BASE_URL + "/admin/course-details",
  CREATE_REVIEW_ADMIN_API: BASE_URL + "/admin/review/create",
  UPDATE_REVIEW_ADMIN_API: BASE_URL + "/admin/review",
  DELETE_REVIEW_ADMIN_API: BASE_URL + "/admin/review",
  GLOBAL_SEARCH_API: BASE_URL + "/admin/global-search",
};

// SCHEDULED CLASSES ENDPOINTS
export const scheduledClassesEndpoints = {
  CREATE_CLASS_API: BASE_URL + "/scheduled-classes",
  GET_CLASSES_API: BASE_URL + "/scheduled-classes",
  GET_ADMIN_LIST_API: BASE_URL + "/scheduled-classes/admin/list",
  GET_CALENDAR_API: BASE_URL + "/scheduled-classes/calendar",
  GET_CLASS_DETAILS_API: BASE_URL + "/scheduled-classes",
  UPDATE_CLASS_API: BASE_URL + "/scheduled-classes",
  DELETE_CLASS_API: BASE_URL + "/scheduled-classes",
  ENROLL_API: BASE_URL + "/scheduled-classes",
  UNENROLL_API: BASE_URL + "/scheduled-classes",
  CHECK_ENROLLMENT_API: BASE_URL + "/scheduled-classes",
  GET_ENROLLMENTS_API: BASE_URL + "/scheduled-classes",
};

// SUBSECTION DISCUSSIONS ENDPOINTS
export const subsectionDiscussionsEndpoints = {
  CREATE_DISCUSSION: `${API_URL}/discussion/subsection-discussion/create`,
  GET_DISCUSSIONS: `${API_URL}/discussion/subsection-discussion`,
  UPDATE_DISCUSSION: `${API_URL}/discussion/subsection-discussion`,
  DELETE_DISCUSSION: `${API_URL}/discussion/subsection-discussion`,
  CREATE_REPLY: `${API_URL}/discussion/subsection-discussion/reply/create`,
  UPDATE_REPLY: `${API_URL}/discussion/subsection-discussion/reply`,
  DELETE_REPLY: `${API_URL}/discussion/subsection-discussion/reply`,
};

//crear payments
export const paymentsEndpoints = {
  CREATE_PAYMENT_INTENT_API: BASE_URL + "",
};

// LEARNING PATHS ENDPOINTS
export const learningPathsEndpoints = {
  GET_ALL_LEARNING_PATHS_API: BASE_URL + "/learning-paths",
  GET_LEARNING_PATH_DETAILS_API: BASE_URL + "/learning-paths",
  CREATE_LEARNING_PATH_API: BASE_URL + "/learning-paths",
  UPDATE_LEARNING_PATH_API: BASE_URL + "/learning-paths",
  DELETE_LEARNING_PATH_API: BASE_URL + "/learning-paths",
};
