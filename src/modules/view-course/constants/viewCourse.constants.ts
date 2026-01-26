// View Course Module - Constants
// Datos estáticos para componentes del módulo View Course

export const VIEW_COURSE_TEXTS = {
  videoDetails: {
    loading: "Cargando...",
    noTitle: "Sin título",
    completed: "Completado",
    loadingVideo: "Cargando información del video...",
    attachments: {
      title: "Recursos Descargables",
      fileType: "Archivo",
    },
  },
  sidebarHeader: {
    back: "Volver",
    addReview: "Agregar Reseña",
    defaultCourseName: "Curso",
    links: {
      enrolledCourses: "/dashboard/enrolled-courses",
    },
  },
  videoPlayer: {
    errors: {
      invalidVideo: "Esta lección no contiene un video válido.",
      unknown: "Error desconocido al cargar el video",
      aborted: "La carga del video fue cancelada",
      network: "Error de red al cargar el video. Verifica tu conexión a internet.",
      decode: "Error al decodificar el video. El formato podría no ser compatible.",
      notSupported: "El formato de video no es compatible o la URL no es válida.",
      loadError: (code: number) => `Error al cargar el video (código: ${code})`,
      default: "No se pudo cargar el video. Por favor, verifica la URL o tu conexión a internet.",
      noValidVideo: "No hay un video válido para reintentar.",
    },
    errorTitle: "Error al cargar el video",
    retry: "🔄 Reintentar",
    videoCompleted: "¡Video Completado!",
    markComplete: "✓ Marcar como Completado",
    loading: "Cargando...",
    rewatch: "🔄 Volver a Ver",
    previous: "← Anterior",
    next: "Siguiente →",
    nextSection: "Continúa en la siguiente sección:",
    defaultNextSection: "Siguiente Sección",
    nextLecture: "Siguiente lecture:",
  },
  reviewModal: {
    title: "Agregar Reseña",
    publishing: "Publicando públicamente",
    rating: {
      label: "Calificación con estrellas",
      star: "estrella",
      stars: "estrellas",
    },
    experience: {
      label: "Agrega tu Experiencia",
      placeholder: "Comparte tu experiencia con este curso...",
      minLength: 10,
      characterCount: (count: number) => `${count} caracteres (mínimo 10)`,
    },
    buttons: {
      cancel: "Cancelar",
      save: "Guardar",
      saving: "Guardando...",
    },
    validation: {
      notAuthenticated: "No estás autenticado. Por favor, inicia sesión.",
      courseNotFound: "No se pudo identificar el curso. Por favor, recarga la página.",
      ratingRequired: "Por favor, selecciona una calificación con estrellas",
      experienceRequired: "Por favor, escribe tu experiencia",
      experienceMinLength: "La reseña debe tener al menos 10 caracteres",
      saveError: "No se pudo guardar la reseña. Por favor, intenta nuevamente.",
      defaultError: "Error al guardar la reseña. Por favor, intenta nuevamente.",
    },
    events: {
      reviewUpdated: "reviewUpdated",
    },
  },
  discussions: {
    button: {
      label: "Abrir discusiones",
      discussions: "Discusiones",
    },
    sidebar: {
      discussion: "Discusión",
      createNew: "Crear Nueva Pregunta",
      discussions: (count: number) => `${count} Discusiones`,
      close: "Cerrar",
      createPost: "CREAR NUEVO POST",
      loading: "Cargando discusiones...",
      empty: "No hay discusiones aún. Sé el primero en preguntar.",
    },
    createForm: {
      title: "Nueva Pregunta",
      question: "Pregunta",
      placeholder: "Escribir una respuesta...",
      minLength: 10,
      characterCount: (count: number) => `${count} / 10 caracteres mínimos`,
      buttons: {
        cancel: "Cancelar",
        publish: "Publicar Pregunta",
        publishing: "Publicando...",
      },
      validation: {
        minLength: "La pregunta debe tener al menos 10 caracteres",
        createError: "Error al crear la pregunta. Inténtalo de nuevo.",
      },
    },
    detail: {
      back: "Volver",
      edit: "Editar pregunta",
      delete: "Eliminar pregunta",
      replies: (count: number) => count === 1 ? 'RESPUESTA' : 'RESPUESTAS',
      empty: "No hay respuestas aún. Sé el primero en responder.",
      deleteConfirm: "¿Estás seguro de que quieres eliminar esta pregunta?",
      deleteReplyConfirm: "¿Estás seguro de que quieres eliminar esta respuesta?",
    },
    reply: {
      placeholder: "Escribir una respuesta...",
      send: "Enviar respuesta",
      minLength: 5,
      validation: {
        minLength: "La respuesta debe tener al menos 5 caracteres",
        createError: "Error al crear la respuesta. Inténtalo de nuevo.",
      },
    },
    replyItem: {
      edited: "(EDITADO)",
      edit: "Editar respuesta",
      delete: "Eliminar respuesta",
    },
    errors: {
      loadDiscussions: "Error loading discussions:",
      loadCount: "Error loading discussion count:",
    },
  },
  sidebarSectionList: {
    empty: "No hay secciones disponibles",
    defaultSection: (index: number) => `Sección ${index + 1}`,
    lecture: "lecture",
    lectures: "lectures",
    emptyLectures: "No hay lectures disponibles en esta sección",
    completion: {
      mark: "Clic para marcar como completada",
      unmark: "Clic para desmarcar como completada",
    },
    defaultLecture: (index: number) => `Lecture ${index + 1}`,
    errors: {
      tokenOrCourseId: "Token o courseId no disponible",
    },
  },
  errors: {
    loadCourseDetails: "Error loading course details:",
  },
} as const;


