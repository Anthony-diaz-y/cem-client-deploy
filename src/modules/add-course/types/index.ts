// Add Course Module Types

import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  FieldValues,
  Path,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Course, SubSection } from "../../course/types";

export interface ChipInputProps {
  label: string;
  name: string;
  placeholder: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

export interface CourseInformationFormData {
  courseTitle: string;
  courseShortDesc: string;
  coursePrice: number;
  courseTags: string[];
  courseBenefits: string;
  courseCategory: string; // El select guarda directamente el ID como string
  courseRequirements: string[];
  courseImage: string;
}

export interface CourseBuilderFormData {
  sectionName: string;
}

export interface CourseFormActionsProps {
  loading: boolean;
  editCourse: boolean;
}

export interface CourseFormFieldsProps {
  register: UseFormRegister<CourseInformationFormData>;
  setValue: UseFormSetValue<CourseInformationFormData>;
  errors: FieldErrors<CourseInformationFormData>;
  courseCategories: Array<{ id?: string; _id?: string; name: string }>;
  loading: boolean;
  editCourse: boolean;
  course?: Course | null;
}

export interface UploadProps {
  name: string;
  label: string;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  errors: FieldErrors<FieldValues>;
  video?: boolean;
  viewData?: string | null;
  editData?: string | null | undefined;
}

export interface NestedViewProps {
  handleChangeEditSectionName: (sectionId: string, sectionName: string) => void;
}

export interface PublishCourseFormData {
  public: boolean;
}

export interface RequirementFieldProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
}

export interface SectionFormProps {
  register: UseFormRegister<CourseBuilderFormData>;
  handleSubmit: UseFormHandleSubmit<CourseBuilderFormData>;
  errors: FieldErrors<CourseBuilderFormData>;
  loading: boolean;
  editSectionName: string | null;
  onSubmit: (data: CourseBuilderFormData) => void;
  onCancelEdit: () => void;
}

export interface SubSectionModalFormData {
  lectureTitle: string;
  lectureDesc: string;
  lectureVideo: string;
}

export interface SubSectionModalProps {
  modalData: string | (SubSection & { sectionId?: string }) | null;
  setModalData: React.Dispatch<
    React.SetStateAction<string | (SubSection & { sectionId?: string }) | null>
  >;
  add?: boolean;
  view?: boolean;
  edit?: boolean;
}
