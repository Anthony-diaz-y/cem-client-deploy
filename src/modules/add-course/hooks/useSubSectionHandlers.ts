import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { Course, SubSection } from "../../course/types";
import { SubSectionModalFormData } from "../types";
import { createSubSection, updateSubSection } from "@shared/services/courseDetailsAPI";
import { setCourse } from "../../course/store/courseSlice";
import { updateCourseWithSubSections, getSubSectionId } from "../utils/subSectionHelpers";

interface UseSubSectionHandlersProps {
  modalData: string | SubSection | null;
  setModalData: (data: string | SubSection | null) => void;
  setLoading: (loading: boolean) => void;
  getValues: () => SubSectionModalFormData;
  isFormUpdated: () => boolean;
}

type SubSectionActionData = Partial<SubSectionModalFormData> & {
  lectureTitle?: string;
  quizTitle?: string;
  questions?: unknown[];
};

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
  const handleCreate = async (data: SubSectionActionData, isQuiz = false) => {
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
    formData.append("title", data.lectureTitle || "");
    formData.append("description", data.lectureDescription || "");
    formData.append("content", data.lectureContent || "");

    if (isQuiz && data.quizTitle) {
      formData.append("quizTitle", data.quizTitle);
    }

    if (data.lectureVideo) {
      if (data.lectureVideo instanceof File) {
        formData.append("video", data.lectureVideo);
      } else if (typeof data.lectureVideo === 'string' && data.lectureVideo.trim()) {
        formData.append("videoUrl", data.lectureVideo.trim());
      }
    }

    if (data.lectureAttachments && data.lectureAttachments.length > 0) {
      data.lectureAttachments.forEach((file: File) => {
        formData.append("attachments", file);
      });
    }

    if (isQuiz) {
      formData.append("type", "quiz");
      if (data.questions) {
        formData.append("questions", JSON.stringify(data.questions));
      }
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
        loading: isQuiz ? 'Creando quiz...' : 'Creando lección...',
        success: (msg) => msg,
        error: (err) => err?.message || (isQuiz ? 'Error al crear el quiz' : 'Error al crear la lección'),
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
  const handleEdit = async (quizData?: SubSectionActionData, isQuiz = false) => {
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

    // El título principal siempre es el de la lección
    const title = currentValues.lectureTitle?.trim() || subSectionData.title || "";
    const description = currentValues.lectureDescription?.trim() || "";
    const content = currentValues.lectureContent?.trim() || "";

    if (title) formData.append("title", title);
    if (description !== undefined) formData.append("description", description);
    if (content !== undefined) formData.append("content", content);

    // Manejar video
    const lectureVideo = currentValues.lectureVideo;
    if (lectureVideo && lectureVideo !== subSectionData.videoUrl) {
      if (lectureVideo instanceof File) {
        formData.append("video", lectureVideo);
      } else if (typeof lectureVideo === 'string' && lectureVideo.trim()) {
        formData.append("videoUrl", lectureVideo.trim());
      }
    }

    // Manejar adjuntos
    if (currentValues.lectureAttachments && currentValues.lectureAttachments.length > 0) {
      currentValues.lectureAttachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    if (currentValues.deletedAttachments && currentValues.deletedAttachments.length > 0) {
      currentValues.deletedAttachments.forEach((url) => {
        formData.append("deletedAttachments", url);
      });
    }

    // Campos específicos de Quiz
    if (isQuiz && quizData) {
      formData.append("type", "quiz");
      if (quizData.quizTitle) {
        formData.append("quizTitle", quizData.quizTitle.trim());
      }
      if (quizData.questions) {
        formData.append("questions", JSON.stringify(quizData.questions));
      }
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
        loading: isQuiz ? 'Actualizando quiz...' : 'Actualizando lección...',
        success: (msg) => msg,
        error: (err) => err?.message || (isQuiz ? 'Error al actualizar el quiz' : 'Error al actualizar la lección'),
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

