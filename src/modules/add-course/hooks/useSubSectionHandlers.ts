import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { Course, Section, SubSection } from "../../course/types";
import { SubSectionModalFormData } from "../types";
import { createSubSection, updateSubSection } from "@shared/services/courseDetailsAPI";
import { setCourse } from "../../course/store/courseSlice";
import { updateCourseWithSubSections, getSectionId, getSubSectionId } from "../utils/subSectionHelpers";

interface UseSubSectionHandlersProps {
  modalData: string | SubSection | null;
  setModalData: (data: string | SubSection | null) => void;
  setLoading: (loading: boolean) => void;
  getValues: () => SubSectionModalFormData;
  isFormUpdated: () => boolean;
}

// Hook para manejar las acciones de crear y editar subsecciones
export const useSubSectionHandlers = ({
  modalData,
  setModalData,
  setLoading,
  getValues,
  isFormUpdated,
}: UseSubSectionHandlersProps) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { course } = useSelector((state: RootState) => state.course);

  // Crear nueva subsección
  const handleCreate = async (data: SubSectionModalFormData) => {
    if (!modalData || typeof modalData !== "string" || !token || !course) {
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(modalData)) {
      toast.error("ID de sección inválido");
      return;
    }

    const courseData = course as Course;
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureContent || "");

    if (data.lectureVideo) {
      formData.append("video", data.lectureVideo);
    }

    if (data.lectureAttachments && data.lectureAttachments.length > 0) {
      data.lectureAttachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const createPromise = async () => {
      const result = await createSubSection(formData, token, true);

      if (!result) {
        throw new Error("No se pudo crear la lección");
      }

      const updatedCourse = updateCourseWithSubSections(courseData, modalData, result);
      dispatch(setCourse(updatedCourse));
      setModalData(null);
      return "Lección creada correctamente";
    };

    setLoading(true);
    toast.promise(
      createPromise(),
      {
        loading: 'Creando lección...',
        success: (msg) => msg,
        error: (err) => err?.message || 'Error al crear la lección',
      },
      {
        style: { minWidth: '250px' },
        success: { duration: 3000 },
      }
    ).finally(() => {
      setLoading(false);
    });
  };

  // Editar subsección existente
  const handleEdit = async () => {
    if (!modalData || typeof modalData === "string" || !token || !course) {
      return;
    }

    if (!isFormUpdated()) {
      toast.error("No changes made to the form");
      return;
    }

    const currentValues = getValues();
    const subSectionData = modalData as SubSection & { sectionId?: string };
    const courseData = course as Course;

    const sectionId = subSectionData.sectionId;
    const subSectionId = getSubSectionId(subSectionData);

    if (!sectionId || !subSectionId) {
      toast.error("IDs inválidos");
      return;
    }

    const formData = new FormData();
    formData.append("sectionId", String(sectionId));
    formData.append("subSectionId", String(subSectionId));

    const title = currentValues.lectureTitle?.trim() || subSectionData.title || '';
    const description = currentValues.lectureContent?.trim() || subSectionData.description || '';

    if (title) formData.append("title", title);
    if (description) formData.append("description", description);

    const lectureVideo = currentValues.lectureVideo;
    if (lectureVideo && lectureVideo !== subSectionData.videoUrl) {
      if (lectureVideo instanceof File) {
        formData.append("video", lectureVideo);
      } else if (typeof lectureVideo === 'string' && lectureVideo.trim()) {
        formData.append("video", lectureVideo.trim());
      }
    }

    if (currentValues.lectureAttachments && currentValues.lectureAttachments.length > 0) {
      currentValues.lectureAttachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const updatePromise = async () => {
      const result = await updateSubSection(formData, token, true);

      if (!result) {
        throw new Error("No se pudo actualizar la lección");
      }

      const updatedCourse = updateCourseWithSubSections(courseData, sectionId, result);
      dispatch(setCourse(updatedCourse));
      setModalData(null);
      return "Lección actualizada correctamente";
    };

    setLoading(true);
    toast.promise(
      updatePromise(),
      {
        loading: 'Actualizando lección...',
        success: (msg) => msg,
        error: (err) => err?.message || 'Error al actualizar la lección',
      },
      {
        style: { minWidth: '250px' },
        success: { duration: 3000 },
      }
    ).finally(() => {
      setLoading(false);
    });
  };

  return {
    handleCreate,
    handleEdit,
  };
};

