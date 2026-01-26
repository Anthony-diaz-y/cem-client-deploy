// Scheduled Classes Module - Public API
// Scream Modular Architecture: Feature-based organization

// Constants
export {
  PLATAFORMAS,
  COLORES_PLATAFORMA,
  COLORES_PLATAFORMA_TEXTO,
  PAGINACION_DEFAULT,
  DURACION_MINIMA_MINUTOS,
  FORMATO_FECHA_COMPLETA,
  FORMATO_FECHA_CORTA,
  FORMATO_HORA,
  SCHEDULED_CLASSES_TEXTS,
} from "./constants/scheduledClasses.constants";

// Hooks
export { useClassModals } from "./hooks/useClassModals";
export { useInstructorClasses } from "./hooks/useInstructorClasses";

// Components
export { default as ClassCard } from "./components/ClassCard";
export { default as ClassDetailsModal } from "./components/ClassDetailsModal";
export { default as EnrollButton } from "./components/EnrollButton";
export { default as PlatformBadge } from "./components/PlatformBadge";
export { default as StatusBadge } from "./components/StatusBadge";
export { default as CalendarView } from "./components/calendar/CalendarView";
export { default as CalendarGrid } from "./components/calendar/CalendarGrid";
export { default as CalendarHeader } from "./components/calendar/CalendarHeader";
export { default as DayCell } from "./components/calendar/DayCell";
export { default as CalendarFilters } from "./components/filters/CalendarFilters";
export { default as InstructorClassFilters } from "./components/filters/InstructorClassFilters";
export { default as StudentClassFilters } from "./components/filters/StudentClassFilters";
export { default as CreateClassForm } from "./components/forms/CreateClassForm";
export { default as EditClassForm } from "./components/forms/EditClassForm";
export { default as ClassListView } from "./components/list/ClassListView";
export { default as ClassListItem } from "./components/list/ClassListItem";
export { default as EnrolledUsersList } from "./components/admin/EnrolledUsersList";

// Containers
export { default as ScheduledClassesContainer } from "./containers/ScheduledClassesContainer";
export { default as InstructorClassesManagementContainer } from "./containers/InstructorClassesManagementContainer";


