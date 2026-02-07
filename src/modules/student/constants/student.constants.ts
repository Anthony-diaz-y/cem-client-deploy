// Student Module - Constants
// Datos estáticos para componentes del módulo Student

export const STUDENT_TEXTS = {
  myCourses: {
    title: "My Courses",
    addCourse: "Add Course",
    links: {
      addCourse: "/dashboard/add-course",
    },
  },
  enrolledCourses: {
    title: "Enrolled Courses",
    emptyState: "You have not enrolled in any course yet.",
    table: {
      courseName: "Course Name",
      duration: "Duration",
      progress: "Progress",
      progressLabel: (percentage: number) => `Progress: ${percentage}%`,
    },
    filters: {
      searchPlaceholder: "Search your courses...",
      all: "All Courses",
      pending: "In Progress",
      completed: "Completed",
    },
    sort: {
      label: "Sort by",
      newest: "Newest first",
      oldest: "Oldest first",
    },
  },
  errors: {
    fetchCourses: "Error fetching courses:",
    fetchEnrolledCourses: "Could not fetch enrolled courses.",
    missingCourseId: "Missing course ID:",
    tokenRequired: "Token is required to load course details",
    loadCourseDetails: "Error loading course details:",
  },
  events: {
    coursePurchased: "coursePurchased",
    logPurchase: "Evento de compra detectado, recargando cursos...",
  },
} as const;

