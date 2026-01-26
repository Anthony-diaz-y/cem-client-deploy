// Scheduled Classes Module - Constants
// Datos estáticos para componentes del módulo Scheduled Classes

import { Platform } from "@/types/scheduledClasses.types";

// Plataformas disponibles
export const PLATAFORMAS: { value: Platform; label: string; icon: string }[] = [
  { value: 'Zoom', label: 'Zoom', icon: '📹' },
  { value: 'Teams', label: 'Microsoft Teams', icon: '💼' },
  { value: 'Discord', label: 'Discord', icon: '🎮' },
  { value: 'Google Meet', label: 'Google Meet', icon: '📞' },
  { value: 'Otro', label: 'Otro', icon: '🔗' },
];

// Colores de plataformas
export const COLORES_PLATAFORMA: Record<Platform, string> = {
  'Zoom': 'bg-blue-500',
  'Teams': 'bg-purple-600',
  'Discord': 'bg-indigo-600',
  'Google Meet': 'bg-teal-600',
  'Otro': 'bg-gray-600',
};

export const COLORES_PLATAFORMA_TEXTO: Record<Platform, string> = {
  'Zoom': 'text-blue-600',
  'Teams': 'text-purple-600',
  'Discord': 'text-indigo-600',
  'Google Meet': 'text-teal-600',
  'Otro': 'text-gray-600',
};

// Configuración de paginación
export const PAGINACION_DEFAULT = {
  page: 1,
  limit: 20,
};

// Configuración de duración
export const DURACION_MINIMA_MINUTOS = 15;

// Formatos de fecha
export const FORMATO_FECHA_COMPLETA = {
  weekday: 'long' as const,
  year: 'numeric' as const,
  month: 'long' as const,
  day: 'numeric' as const,
  hour: '2-digit' as const,
  minute: '2-digit' as const,
};

export const FORMATO_FECHA_CORTA = {
  year: 'numeric' as const,
  month: 'short' as const,
  day: 'numeric' as const,
};

export const FORMATO_HORA = {
  hour: '2-digit' as const,
  minute: '2-digit' as const,
};

// Textos de UI
export const SCHEDULED_CLASSES_TEXTS = {
  containers: {
    scheduledClasses: {
      title: "📅 Clases Programadas",
      descriptions: {
        student: "Visualiza e inscríbete a las clases disponibles",
        other: "Visualiza y gestiona las clases en línea",
      },
      buttons: {
        cancel: "✕ Cancelar",
        createNew: "➕ Crear Nueva Clase",
      },
      formTitle: "Nueva Clase Programada",
    },
    instructorClasses: {
      title: "🎓 Mis Clases Programadas",
      description: "Gestiona las clases que has creado",
      buttons: {
        cancel: "✕ Cancelar",
        createNew: "➕ Crear Nueva Clase",
      },
      formTitle: "Nueva Clase Programada",
      editTitle: "Editar Clase",
      listTitle: "📋 Lista de Clases",
      showing: "Mostrando",
      of: "de",
      classes: "clases",
      searching: "Buscando clases...",
      noResults: {
        message: "No se encontraron clases con los filtros seleccionados",
        suggestion: "Intenta ajustar los filtros o limpiarlos para ver más resultados",
      },
      unauthorized: "No autorizado. Por favor, inicia sesión.",
    },
  },
  forms: {
    create: {
      fields: {
        title: "Título de la clase *",
        description: "Descripción *",
        platform: "Plataforma *",
        duration: "Duración (minutos) *",
        meetingLink: "Enlace de la reunión *",
        date: "Día *",
        time: "Hora *",
      },
      placeholders: {
        title: "Ej: Introducción a Node.js",
        description: "Describe el contenido de la clase...",
        platform: "Selecciona una plataforma",
        meetingLink: "https://zoom.us/j/123456789",
      },
      buttons: {
        cancel: "Cancelar",
        create: "Crear Clase Programada",
        creating: "Creando...",
      },
      validation: {
        titleRequired: "El título es requerido",
        titleMaxLength: "Máximo 255 caracteres",
        descriptionRequired: "La descripción es requerida",
        platformRequired: "Selecciona una plataforma",
        durationRequired: "La duración es requerida",
        durationMin: (min: number) => `Mínimo ${min} minutos` as string,
        meetingLinkRequired: "El enlace es requerido",
        meetingLinkPattern: "Debe ser una URL válida (http:// o https://)",
        dateRequired: "El día es requerido",
        dateFuture: "El día debe ser hoy o futuro",
        timeRequired: "La hora es requerida",
        timeFuture: "La hora debe ser futura",
      },
      success: {
        instructor: "🎉 Clase creada exitosamente. Está pendiente de aprobación del administrador.",
        admin: "🎉 Clase creada exitosamente. Se notificará a los usuarios al inscribirse.",
      },
      error: "Error al crear la clase",
    },
    edit: {
      fields: {
        title: "Título de la clase *",
        description: "Descripción *",
        platform: "Plataforma *",
        duration: "Duración (minutos) *",
        meetingLink: "Enlace de la reunión *",
        date: "Día *",
        time: "Hora *",
        isActive: "Clase activa (visible para todos)",
      },
      buttons: {
        cancel: "Cancelar",
        save: "Guardar Cambios",
        saving: "Guardando...",
      },
      validation: {
        titleRequired: "El título es requerido",
        titleMaxLength: "Máximo 255 caracteres",
        descriptionRequired: "La descripción es requerida",
        platformRequired: "Selecciona una plataforma",
        durationRequired: "La duración es requerida",
        durationMin: (min: number) => `Mínimo ${min}` as string,
        meetingLinkRequired: "El enlace es requerido",
        meetingLinkPattern: "Debe ser una URL válida",
        dateRequired: "El día es requerido",
        timeRequired: "La hora es requerida",
      },
      success: "✅ Clase actualizada exitosamente",
      error: "Error al actualizar la clase",
    },
  },
  components: {
    enrollButton: {
      enrolled: "YA INSCRITO",
      cancelEnrollment: "Cancelar inscripción",
      canceling: "Cancelando...",
      enroll: "📝 Inscribirse",
      processing: "Procesando...",
      success: {
        enrolled: "✅ Te has inscrito exitosamente",
        unenrolled: "Te has desinscrito de la clase",
      },
      error: "Error al procesar la solicitud",
    },
    classDetailsModal: {
      labels: {
        description: "Descripción",
        dateTime: "Fecha y Hora",
        duration: "Duración",
        instructor: "Instructor",
        enrolled: "Inscritos",
      },
      durationUnit: "minutos",
      enrolledUnit: "personas",
      buttons: {
        viewEnrolled: "Ver Inscritos",
        edit: "Editar clase",
        delete: "Eliminar clase",
        activate: "✅ Activar",
        deactivate: "👁️ Desactivar",
        processing: "⏳",
        openZoom: "Abrir Zoom App",
        goToClass: "Ir a la Clase",
      },
      error: "Error al cambiar el estado de la clase",
    },
    filters: {
      student: {
        platform: "Plataforma:",
        allPlatforms: "Todas las plataformas",
        enrollment: "Inscripción:",
        allClasses: "Todas las clases",
        myEnrolled: "Solo mis clases inscritas",
        available: "Solo clases disponibles",
        clearFilters: "Limpiar filtros",
      },
    },
  },
  modals: {
    delete: {
      title: "¿Estás seguro de que deseas eliminar esta clase?",
      message: "Esta acción no se puede deshacer. Todos los datos de la clase se perderán permanentemente.",
      confirm: "Eliminar",
      cancel: "Cancelar",
    },
  },
  hooks: {
    useClassModals: {
      errors: {
        editOwnOnly: "Solo puedes editar las clases que has creado",
        toggleActiveAdminOnly: "Solo los administradores pueden activar/desactivar clases",
        deleteAdminOnly: "Solo los administradores pueden eliminar clases",
        toggleActiveError: "Error al cambiar el estado de la clase",
        deleteError: "Error al eliminar la clase",
      },
      success: {
        activated: "Clase activada exitosamente",
        deactivated: "Clase desactivada exitosamente",
        deleted: "Clase eliminada exitosamente",
      },
    },
    useInstructorClasses: {
      errors: {
        timeout: "La solicitud está tardando demasiado. Por favor, intenta nuevamente.",
        default: "Error al cargar las clases",
      },
    },
  },
} as const;
