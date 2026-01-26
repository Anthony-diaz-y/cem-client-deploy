// Instructor Module - Constants
// Datos estáticos para componentes del módulo Instructor

export const INSTRUCTOR_TEXTS = {
  dashboard: {
    greeting: {
      hi: "Hii",
      emoji: "👋",
      subtitle: "Let's start something new",
    },
    chart: {
      title: "Visualize",
      noData: "Not Enough Data To Visualize",
    },
  },
  courses: {
    title: "My Courses",
    addCourse: "Add Course",
    yourCourses: "Your Courses",
    viewAll: "View All",
    emptyState: {
      message: "You have not created any courses yet",
      action: "Create a course",
    },
    grid: {
      noImage: "Sin imagen",
      status: {
        drafted: "Drafted",
        published: "Published",
      },
      students: "students",
    },
  },
  stats: {
    title: "Statistics",
    totalCourses: "Total Courses",
    totalStudents: "Total Students",
    totalIncome: "Total Income",
    currencyPrefix: "Rs.",
  },
  editCourse: {
    title: "Edit Course",
    notFound: "Course not found",
  },
  loading: {
    minLoadingTime: 300, // Tiempo mínimo en ms antes de mostrar skeleton
  },
  links: {
    addCourse: "/dashboard/add-course",
    myCourses: "/dashboard/my-courses",
  },
} as const;

