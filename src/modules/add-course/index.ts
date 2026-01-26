// Add Course Module - Public API
// Scream Modular Architecture: Feature-based organization

// Types
export type {
  ChipInputProps,
  CourseInformationFormData,
  CourseBuilderFormData,
  PublishCourseFormData,
} from "./types";

// Constants
export { COURSE_STEPS } from "./constants/addCourse.constants";
export type { CourseStep } from "./constants/addCourse.constants";

// Hooks
export { useScrollToTop } from "./hooks/useScrollToTop";
export { useNestedView } from "./hooks/useNestedView";
export type { UseNestedViewReturn } from "./hooks/useNestedView";
export { useNestedViewActions } from "./hooks/useNestedViewActions";

// Utils
export { normalizeCourseStructure } from "./utils/normalizeCourseStructure";

// Components
export { default as AddCourse } from "./containers/AddCourse";
export { default as RenderSteps } from "./components/navigation/RenderSteps";
export { default as CourseBuilderForm } from "./components/forms/CourseBuilderForm";
export { default as CourseInformationForm } from "./components/forms/CourseInformationForm";
export { default as PublishCourse } from "./components/publish/PublishCourse";
export { default as NestedView } from "./components/views/NestedView";
export { default as SubSectionModal } from "./components/modals/SubSectionModal";
export { default as ChipInput } from "./components/form-fields/ChipInput";
export { default as RequirementField } from "./components/form-fields/RequirementField";
export { default as Upload } from "./components/upload/Upload";
