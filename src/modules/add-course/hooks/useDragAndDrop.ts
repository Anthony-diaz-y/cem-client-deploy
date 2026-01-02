import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { setCourse } from "../../course/store/courseSlice";
import { Course, Section, SubSection } from "../../course/types";
import { moveSubSection } from "@shared/services/courseDetailsAPI";

interface DragItem {
  type: "section" | "lecture";
  sectionId?: string;
  lectureId?: string;
  sourceSectionId?: string;
}

export const useDragAndDrop = () => {
  const dispatch = useDispatch();
  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const [showMoveWarning, setShowMoveWarning] = useState(false);
  const [pendingMove, setPendingMove] = useState<{
    lecture: SubSection;
    fromSectionId: string;
    toSectionId: string;
    fromSectionName: string;
    toSectionName: string;
    newPosition?: number;
  } | null>(null);

  const handleDragStart = useCallback(
    (type: "section" | "lecture", sectionId: string, lectureId?: string) => {
      const dragItem = {
        type,
        sectionId,
        lectureId,
        sourceSectionId: lectureId ? sectionId : undefined,
      };
      console.log("🔧 handleDragStart called with:", dragItem);
      setDraggedItem(dragItem);
      // Verificar que el estado se actualizó (en el siguiente render)
      setTimeout(() => {
        console.log("🔍 State after dragStart (checking):", dragItem);
      }, 0);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverSection(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    setDragOverSection(sectionId);
  }, []);

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      targetSectionId: string,
      targetLectureIndex?: number
    ) => {
      e.preventDefault();
      e.stopPropagation();

      // También intentar obtener el tipo del dataTransfer como respaldo
      const dataTransferType = e.dataTransfer.getData("type");
      const dataTransferSectionId = e.dataTransfer.getData("sectionId");
      const dataTransferLectureId = e.dataTransfer.getData("text/plain");

      console.log("📋 handleDrop called with draggedItem:", draggedItem);
      console.log("📋 dataTransfer data:", { type: dataTransferType, sectionId: dataTransferSectionId, lectureId: dataTransferLectureId });

      if (!draggedItem || !course) {
        console.error("❌ No draggedItem or course available");
        return;
      }

      const courseData = course as Course;
      const updatedCourseContent = [...courseData.courseContent];

      // Usar dataTransfer como respaldo si el estado no está actualizado
      const actualType = draggedItem.type === "lecture" && dataTransferType === "lecture" 
        ? "lecture" 
        : draggedItem.type === "section" && dataTransferType !== "lecture"
        ? "section"
        : dataTransferType || draggedItem.type;

      console.log("🔍 Actual type determined:", actualType, "from draggedItem:", draggedItem.type, "dataTransfer:", dataTransferType);

      if (actualType === "section") {
        // Reordenar secciones
        const sourceIndex = updatedCourseContent.findIndex(
          (s: Section) => ((s as any)?.id || s?._id) === draggedItem.sectionId
        );
        const targetIndex = updatedCourseContent.findIndex(
          (s: Section) => ((s as any)?.id || s?._id) === targetSectionId
        );

        if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
          const [movedSection] = updatedCourseContent.splice(sourceIndex, 1);
          updatedCourseContent.splice(targetIndex, 0, movedSection);

          const updatedCourse: Course = {
            ...courseData,
            courseContent: updatedCourseContent,
          };
          dispatch(setCourse(updatedCourse));
        }
      } else if (actualType === "lecture") {
        // Usar dataTransfer si el estado no tiene la información correcta
        const sourceSectionId = draggedItem.sourceSectionId || dataTransferSectionId;
        const lectureId = draggedItem.lectureId || dataTransferLectureId;

        if (!sourceSectionId || !lectureId) {
          console.error("❌ Missing sourceSectionId or lectureId:", { sourceSectionId, lectureId, draggedItem, dataTransfer: { sectionId: dataTransferSectionId, lectureId: dataTransferLectureId } });
          return;
        }

        console.log("📋 Processing lecture drop:", {
          sourceSectionId,
          targetSectionId,
          lectureId,
          targetLectureIndex,
          actualType
        });

        if (sourceSectionId === targetSectionId) {
          console.log("🔄 Reordering within same section");
          // Reordenar dentro de la misma sección
          const sectionIndex = updatedCourseContent.findIndex(
            (s: Section) => ((s as any)?.id || s?._id) === sourceSectionId
          );

          if (sectionIndex !== -1) {
            const section = updatedCourseContent[sectionIndex];
            // Manejar tanto subSection como subSections
            const subSections = [...(section.subSection || (section as any).subSections || [])];
            const sourceLectureIndex = subSections.findIndex(
              (sub: SubSection) => ((sub as any)?.id || sub?._id) === lectureId
            );

            if (sourceLectureIndex !== -1) {
              // Si no se proporciona targetLectureIndex, usar el índice de la última posición
              let finalTargetIndex = targetLectureIndex !== undefined
                ? targetLectureIndex
                : subSections.length - 1;
              
              // Asegurar que el índice esté dentro del rango válido
              finalTargetIndex = Math.max(0, Math.min(finalTargetIndex, subSections.length - 1));

              // Solo mover si la posición es diferente
              if (sourceLectureIndex !== finalTargetIndex) {
                const [movedLecture] = subSections.splice(sourceLectureIndex, 1);
                // Ajustar el índice si estamos moviendo hacia abajo
                const insertIndex = finalTargetIndex > sourceLectureIndex ? finalTargetIndex - 1 : finalTargetIndex;
                subSections.splice(insertIndex, 0, movedLecture);

                updatedCourseContent[sectionIndex] = {
                  ...section,
                  subSection: subSections,
                };

                const updatedCourse: Course = {
                  ...courseData,
                  courseContent: updatedCourseContent,
                };
                dispatch(setCourse(updatedCourse));
              }
            }
          }
        } else {
          // Mover a otra sección - mostrar advertencia
          console.log("🔄 Moving lecture between DIFFERENT sections:", {
            sourceSectionId,
            targetSectionId,
            lectureId
          });
          
          const sourceSection = updatedCourseContent.find(
            (s: Section) => ((s as any)?.id || s?._id) === sourceSectionId
          );
          const targetSection = updatedCourseContent.find(
            (s: Section) => ((s as any)?.id || s?._id) === targetSectionId
          );
          
          console.log("📂 Sections found:", {
            sourceSection: sourceSection ? sourceSection.sectionName : "NOT FOUND",
            targetSection: targetSection ? targetSection.sectionName : "NOT FOUND"
          });
          
          // Manejar tanto subSection como subSections
          const sourceSubSections = sourceSection?.subSection || (sourceSection as any)?.subSections || [];
          const lecture = sourceSubSections.find(
            (sub: SubSection) => ((sub as any)?.id || sub?._id) === lectureId
          );

          console.log("📚 Lecture found:", {
            lecture: lecture ? lecture.title : "NOT FOUND",
            sourceSubSectionsCount: sourceSubSections.length,
            lectureId
          });

          if (lecture && sourceSection && targetSection) {
            console.log("✅ All data found - Showing warning modal");
            setPendingMove({
              lecture,
              fromSectionId: sourceSectionId,
              toSectionId: targetSectionId,
              fromSectionName: sourceSection.sectionName,
              toSectionName: targetSection.sectionName,
            });
            setShowMoveWarning(true);
          } else {
            console.error("❌ Cannot show warning modal - missing data:", {
              hasLecture: !!lecture,
              hasSourceSection: !!sourceSection,
              hasTargetSection: !!targetSection,
              sourceSubSections: sourceSubSections.length
            });
          }
        }
      }

      setDragOverSection(null);
    },
    [draggedItem, course, dispatch, setShowMoveWarning, setPendingMove]
  );

  const confirmMoveLecture = useCallback(async () => {
    if (!pendingMove || !course || !token) return;

    const courseData = course as Course;
    const lectureId = (pendingMove.lecture as any)?.id || pendingMove.lecture?._id;

    if (!lectureId) {
      console.error("❌ No se pudo obtener el ID de la lección");
      setShowMoveWarning(false);
      setPendingMove(null);
      return;
    }

    try {
      // Llamar al endpoint del backend para mover la subsección
      console.log("💾 Moviendo subsección al backend:", {
        subSectionId: lectureId,
        fromSectionId: pendingMove.fromSectionId,
        toSectionId: pendingMove.toSectionId,
        newPosition: pendingMove.newPosition
      });

      const result = await moveSubSection(
        {
          subSectionId: lectureId,
          fromSectionId: pendingMove.fromSectionId,
          toSectionId: pendingMove.toSectionId,
          ...(pendingMove.newPosition !== undefined && { newPosition: pendingMove.newPosition }),
        },
        token
      );

      if (result) {
        // Actualizar el estado local con el resultado del backend
        const updatedCourseContent = [...courseData.courseContent];

        const sourceSectionIndex = updatedCourseContent.findIndex(
          (s: Section) => ((s as any)?.id || s?._id) === pendingMove.fromSectionId
        );
        const targetSectionIndex = updatedCourseContent.findIndex(
          (s: Section) => ((s as any)?.id || s?._id) === pendingMove.toSectionId
        );

        if (sourceSectionIndex !== -1 && targetSectionIndex !== -1) {
          const sourceSection = updatedCourseContent[sourceSectionIndex];
          const targetSection = updatedCourseContent[targetSectionIndex];

          // Manejar tanto subSection como subSections
          const sourceSubSections = [...(sourceSection.subSection || (sourceSection as any).subSections || [])];
          const lectureIndex = sourceSubSections.findIndex(
            (sub: SubSection) =>
              ((sub as any)?.id || sub?._id) === lectureId
          );

          if (lectureIndex !== -1) {
            const [movedLecture] = sourceSubSections.splice(lectureIndex, 1);
            const targetSubSections = [...(targetSection.subSection || (targetSection as any).subSections || [])];
            
            // Insertar en la posición correcta si se especificó
            if (pendingMove.newPosition !== undefined && pendingMove.newPosition < targetSubSections.length) {
              targetSubSections.splice(pendingMove.newPosition, 0, movedLecture);
            } else {
              targetSubSections.push(movedLecture);
            }

            updatedCourseContent[sourceSectionIndex] = {
              ...sourceSection,
              subSection: sourceSubSections,
            };
            updatedCourseContent[targetSectionIndex] = {
              ...targetSection,
              subSection: targetSubSections,
            };

            const updatedCourse: Course = {
              ...courseData,
              courseContent: updatedCourseContent,
            };
            dispatch(setCourse(updatedCourse));
          }
        }
      }
    } catch (error) {
      console.error("Error al mover subsección:", error);
      // El error ya se maneja en moveSubSection con toast
    }

    setShowMoveWarning(false);
    setPendingMove(null);
  }, [pendingMove, course, token, dispatch]);

  const cancelMoveLecture = useCallback(() => {
    setShowMoveWarning(false);
    setPendingMove(null);
  }, []);

  return {
    draggedItem,
    dragOverSection,
    showMoveWarning,
    pendingMove,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    confirmMoveLecture,
    cancelMoveLecture,
  };
};

