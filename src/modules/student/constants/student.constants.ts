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
    title: "Cursos Inscritos",
    emptyState: "Aún no te has inscrito en ningún curso.",
    table: {
      courseName: "Nombre del Curso",
      duration: "Duración",
      progress: "Progreso",
      progressLabel: (percentage: number) => `Progreso: ${percentage}%`,
    },
    filters: {
      searchPlaceholder: "Buscar tus cursos...",
      all: "Todos",
      pending: "En Progreso",
      completed: "Completados",
    },
    sort: {
      label: "Ordenar por",
      newest: "Más recientes",
      oldest: "Más antiguos",
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
