// Add Course Module - Public API

// Types
export type {
  ChipInputProps,
  CourseInformationFormData,
  CourseBuilderFormData,
  PublishCourseFormData,
} from "./types";

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

// Container (to be created)
// export { default as AddCourseContainer } from './containers/AddCourseContainer';
