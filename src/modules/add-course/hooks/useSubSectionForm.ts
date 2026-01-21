import { useEffect, useState } from "react";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { SubSectionModalFormData } from "../types";
import { SubSection } from "../../course/types";

interface UseSubSectionFormProps {
  modalData: string | SubSection | null;
  view: boolean;
  edit: boolean;
  setValue: UseFormSetValue<SubSectionModalFormData>;
  getValues: UseFormGetValues<SubSectionModalFormData>;
}

// Hook para manejar el formulario de subsección
export const useSubSectionForm = ({
  modalData,
  view,
  edit,
  setValue,
  getValues,
}: UseSubSectionFormProps) => {
  const [showTextContent, setShowTextContent] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [richTextContent, setRichTextContent] = useState("");

  // Inicializar formulario cuando se edita o visualiza
  useEffect(() => {
    if ((view || edit) && modalData && typeof modalData === "object") {
      const subSectionData = modalData as SubSection & { sectionId?: string };
      
      // Usar setTimeout para evitar llamadas sincrónicas de setState
      setTimeout(() => {
        setValue("lectureTitle", subSectionData.title);
        setValue("lectureVideo", subSectionData.videoUrl);
        
        const content = subSectionData.content || subSectionData.description || "";
        setRichTextContent(content);
        setValue("lectureContent", content);

        if (content) setShowTextContent(true);
        if (subSectionData.videoUrl) setShowVideo(true);
        if (subSectionData.attachments && subSectionData.attachments.length > 0) {
          setShowAttachments(true);
        }
      }, 0);
    }
  }, [view, edit, modalData, setValue]);

  // Verificar si el formulario ha sido actualizado
  const isFormUpdated = (): boolean => {
    if (!modalData || typeof modalData === "string") return false;
    const currentValues = getValues();
    const subSectionData = modalData as SubSection & { sectionId?: string };
    
    return (
      currentValues.lectureTitle !== subSectionData.title ||
      currentValues.lectureContent !== subSectionData.description ||
      currentValues.lectureVideo !== subSectionData.videoUrl
    );
  };

  return {
    showTextContent,
    setShowTextContent,
    showVideo,
    setShowVideo,
    showAttachments,
    setShowAttachments,
    richTextContent,
    setRichTextContent,
    isFormUpdated,
  };
};

