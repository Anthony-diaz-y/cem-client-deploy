// Cart Module - Constants
// Datos estáticos para componentes del módulo Cart

export const CART_TEXTS = {
  title: "Cart",
  emptyCart: "Your cart is empty",
  noCourses: "No hay cursos en el carrito",
  coursesInCart: (count: number) => `${count} ${count === 1 ? 'Course' : 'Courses'} in Cart`,
  buyNow: "Buy Now",
  buy: "Comprar",
  remove: "Remove",
  total: "Total:",
  buyingCourse: "Comprando curso...",
  courseBought: "¡Curso comprado exitosamente!",
  courseRemoved: "Curso eliminado del carrito",
  noLogin: "Por favor, inicia sesión para comprar",
  invalidCourseId: "ID de curso no válido",
  enrolling: "Inscribiendo a los cursos...",
  enrolled: "¡Inscrito exitosamente! Redirigiendo...",
  alreadyEnrolled: "Ya estás inscrito en uno o más cursos. Redirigiendo...",
  noCoursesInCart: "No hay cursos en el carrito",
  enrollmentError: "No se pudieron inscribir los cursos",
  buyError: "No se pudo comprar el curso",
  temporaryMode: {
    title: "⚠️ MODO TEMPORAL",
    message: "Esta compra no requiere pago real. Solo para pruebas y desarrollo.",
    note: "Esto será removido cuando se implemente la pasarela de pago.",
    question: "¿Deseas continuar?",
    singleCourse: "¿Deseas comprar este curso?",
  },
  placeholder: {
    noImage: "Sin imagen",
  },
} as const;


