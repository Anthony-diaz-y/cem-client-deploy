// Course Module - Constants
// Datos estáticos para componentes del módulo Course

export const COURSE_TEXTS = {
  hero: {
    createdBy: "Creado por",
    createdOn: "Creado el",
    language: "Español",
    review: {
      singular: "reseña",
      plural: "reseñas",
    },
    student: {
      singular: "estudiante inscrito",
      plural: "estudiantes inscritos",
    },
    actions: {
      buyNow: "Comprar Ahora",
      addToCart: "Agregar al Carrito",
      goToCourse: "Ir al Curso",
    },
    pricePrefix: "S/",
  },
  infoSection: {
    whatYouWillLearn: "Lo que aprenderás",
    tags: "Etiquetas",
  },
  contentSection: {
    title: "Contenido del curso",
    collapseAll: "Colapsar Todas las Secciones",
  },
  expertSection: {
    title: "Experto",
  },
  detailsCard: {
    pricePrefix: "S/",
    buyNow: "Comprar Ahora",
    goToCourse: "Ver Cursos",
    addToCart: "Agregar al Carrito",
    share: "Compartir",
    requirements: "Requisitos del curso",
    shareSuccess: "Enlace copiado al portapapeles",
    alreadyEnrolled: "Ya estás inscrito",
  },
  actions: {
    errors: {
      invalidCourseId: "ID de curso no válido",
      instructorCannotBuy: "Eres un Instructor. No puedes comprar un curso.",
      notAuthenticated: "¡No estás autenticado!",
      loginToBuy: "Por favor, inicia sesión para comprar el curso.",
      loginToAddToCart: "Por favor, inicia sesión para agregar al carrito",
    },
    modal: {
      login: "Iniciar Sesión",
      cancel: "Cancelar",
    },
    enrollment: {
      loading: "Inscribiendo al curso...",
      success: "¡Inscrito exitosamente! Redirigiendo...",
      alreadyEnrolled: "Ya estás inscrito en este curso. Redirigiendo...",
      error: "No se pudo inscribir al curso",
    },
    temporary: {
      warning: "⚠️ MODO TEMPORAL",
      description: "Esta compra no requiere pago real. Solo para pruebas y desarrollo.",
      note: "Esto será removido cuando se implemente la pasarela de pago.",
      confirm: "¿Deseas continuar?",
    },
    paymentModal: {
      title: "Pagar por:",
      paypal: "PayPal",
      izipay: "Izipay (Próximamente)",
      cancel: "Cancelar",
    },
  },
} as const;


