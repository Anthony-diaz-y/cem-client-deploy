import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteSection,
  deleteSubSection,
} from "@shared/services/courseDetailsAPI";
import { setCourse } from "../../course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { Course, Section, SubSection } from "../../course/types";
import { ConfirmationModalData } from "@shared/components/ConfirmationModal";
import { NestedViewProps } from "../types/index";

import ConfirmationModal from "@shared/components/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";
import MoveLectureWarningModal from "./MoveLectureWarningModal";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { HiMenu } from "react-icons/hi";

// Función para normalizar la estructura del curso (subSections -> subSection)
const normalizeCourseStructure = (course: any): Course => {
  if (!course || !course.courseContent) return course;
  
  const normalizedContent = course.courseContent.map((section: any) => {
    // Si tiene subSections (con S mayúscula), convertir a subSection
    if (section.subSections && Array.isArray(section.subSections)) {
      return {
        ...section,
        subSection: section.subSections,
      };
    }
    // Si no tiene subSection, asegurar que sea un array vacío
    if (!section.subSection) {
      return {
        ...section,
        subSection: [],
      };
    }
    return section;
  });
  
  return {
    ...course,
    courseContent: normalizedContent,
  };
};

export default function NestedView({
  handleChangeEditSectionName,
}: NestedViewProps) {
  const { course } = useSelector((state: RootState) => state.course);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState<string | null>(null);
  const [viewSubSection, setViewSubSection] = useState<SubSection | null>(null);
  const [editSubSection, setEditSubSection] = useState<
    (SubSection & { sectionId: string }) | null
  >(null);
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);

  // Drag and Drop hook
  const {
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
  } = useDragAndDrop();

  // Estado para rastrear si se acaba de hacer un drag (para prevenir onClick)
  const [wasJustDragged, setWasJustDragged] = useState(false);

  // Delele Section
  const handleDeleleSection = async (sectionId: string) => {
    if (!course || !token) return;
    const courseData = course as Course;
    // Obtener el ID del curso (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
    const courseId = (courseData as any)?.id || courseData?._id;
    
    if (!courseId) {
      console.error('Course ID is missing');
      return;
    }
    
    const result = await deleteSection(
      { sectionId, courseId: courseId },
      token
    );
    if (result) {
      // Normalizar la estructura del curso (subSections -> subSection)
      const normalizedResult = normalizeCourseStructure(result);
      dispatch(setCourse(normalizedResult));
    }
    setConfirmationModal(null);
  };

  // Delete SubSection
  const handleDeleteSubSection = async (
    subSectionId: string,
    sectionId: string
  ) => {
    if (!course || !token) return;
    const courseData = course as Course;
    const result = await deleteSubSection({ subSectionId, sectionId }, token);
    if (result && courseData) {
      // update the structure of course - As we have got only updated section details
      const updatedCourseContent = courseData.courseContent.map(
        (section: Section) => {
          const currentSectionId = (section as any)?.id || section?._id;
          if (currentSectionId === sectionId) {
            // Normalizar la sección actualizada (subSections -> subSection)
            const normalizedSection = {
              ...section,
              ...result,
              subSection: (result as any).subSections || result.subSection || [],
            };
            return normalizedSection;
          }
          return section;
        }
      );
      const updatedCourse: Course = {
        ...courseData,
        courseContent: updatedCourseContent,
      };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };

  if (!course) return null;
  const courseData = course as Course;

  return (
    <>
      <div
        className="rounded-2xl bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {courseData.courseContent.map((section: Section, sectionIndex: number) => {
          // Obtener el ID de la sección (priorizar 'id' sobre '_id' ya que PostgreSQL usa UUIDs con campo 'id')
          const sectionId = (section as any)?.id || section?._id;
          
          // Validar que sectionId existe y es un string válido
          if (!sectionId || typeof sectionId !== 'string') {
            console.error(`Invalid sectionId at index ${sectionIndex}:`, sectionId, section);
            return null;
          }
          
          const isSectionDragged =
            draggedItem?.type === "section" &&
            draggedItem?.sectionId === sectionId;
          const isSectionDragOver =
            draggedItem?.type === "section" &&
            dragOverSection === sectionId &&
            draggedItem?.sectionId !== sectionId;

          return (
            // Section Dropdown
            <details
              key={sectionId}
              open
              draggable
              onDragStart={(e) => {
                // Solo iniciar drag de sección si no se está arrastrando desde una lección
                // Verificar si el evento viene de un elemento hijo (lección)
                const target = e.target as HTMLElement;
                const isFromLecture = target.closest('[data-lecture-draggable]');
                
                if (!isFromLecture) {
                  console.log("🚀 DRAG START - Section:", sectionId);
                  handleDragStart("section", sectionId);
                } else {
                  // Si viene de una lección, cancelar el drag de la sección
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => {
                // Solo permitir drag over si es una sección o una lección de otra sección
                if (draggedItem?.type === "section" || 
                    (draggedItem?.type === "lecture" && draggedItem?.sourceSectionId !== sectionId)) {
                  e.preventDefault();
                  handleDragOver(e, sectionId);
                }
              }}
              onDrop={(e) => {
                // Prevenir el comportamiento por defecto del details
                e.preventDefault();
                e.stopPropagation();
                handleDrop(e, sectionId);
              }}
              className={`transition-all duration-200 ${
                isSectionDragged
                  ? "opacity-50 scale-95"
                  : isSectionDragOver
                  ? "border-l-4 border-l-yellow-500 bg-yellow-500/10"
                  : ""
              }`}
            >
              {/* Section Dropdown Content */}
              <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                {/* sectionName */}
                <div className="flex items-center gap-x-3">
                  <HiMenu className="text-xl text-richblack-400 cursor-grab active:cursor-grabbing" />
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p className="font-semibold text-richblack-50">
                    {section.sectionName}
                  </p>
                </div>

              <div className="flex items-center gap-x-3">
                {/* Change Edit SectionName button */}
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      sectionId,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "¿Eliminar esta Sección?",
                      text2: "Todas las lecciones en esta sección serán eliminadas",
                      btn1Text: "Eliminar",
                      btn2Text: "Cancelar",
                      btn1Handler: () => handleDeleleSection(sectionId),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>

                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className={`text-xl text-richblack-300`} />
              </div>
            </summary>
            <div
              className="px-6 pb-4 min-h-[50px]"
              onDragOver={(e) => {
                // Permitir drop de lecciones o secciones
                e.preventDefault();
                e.stopPropagation();
                handleDragOver(e, sectionId);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("📦 DROP on section container:", {
                  sectionId,
                  draggedItemType: draggedItem?.type,
                  draggedItemSourceSectionId: draggedItem?.sourceSectionId,
                  draggedItemLectureId: draggedItem?.lectureId
                });
                // Si se suelta en el contenedor (no en una subsección específica), agregar al final
                handleDrop(e, sectionId, undefined);
              }}
            >
              {/* Render All Sub Sections Within a Section */}
              {/* Manejar tanto subSection como subSections (del backend) */}
              {(() => {
                // Obtener las subsecciones (manejar ambos formatos)
                const subSectionsArray = (section.subSection && Array.isArray(section.subSection)) 
                  ? section.subSection 
                  : ((section as any).subSections && Array.isArray((section as any).subSections))
                    ? (section as any).subSections
                    : [];
                
                // Renderizar si hay subsecciones
                if (subSectionsArray.length > 0) {
                  return subSectionsArray.map((data: SubSection, subSectionIndex: number) => {
                    // Obtener el ID de la subsección (priorizar 'id' sobre '_id')
                    const subSectionId = (data as any)?.id || data?._id || `subsection-${sectionIndex}-${subSectionIndex}`;
                    
                    const isLectureDragged =
                      draggedItem?.type === "lecture" &&
                      draggedItem?.lectureId === subSectionId;
                    const isDragOver =
                      dragOverSection === sectionId &&
                      draggedItem?.type === "lecture" &&
                      draggedItem?.sourceSectionId !== sectionId;

                    return (
                      <div
                        key={subSectionId}
                        data-lecture-draggable="true"
                        draggable={true}
                        onDragStart={(e) => {
                          console.log("🚀 DRAG START - Lecture:", subSectionId, "from section:", sectionId);
                          // CRÍTICO: Detener la propagación para evitar que el <details> padre capture el evento
                          e.stopPropagation();
                          setWasJustDragged(true);
                          handleDragStart("lecture", sectionId, subSectionId);
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", subSectionId);
                          e.dataTransfer.setData("sectionId", sectionId);
                          e.dataTransfer.setData("type", "lecture");
                          console.log("✅ Lecture drag started, state should be:", { type: "lecture", sectionId, lectureId: subSectionId });
                        }}
                        onDragOver={(e) => {
                          // Permitir drop en cualquier subsección
                          e.preventDefault();
                          e.stopPropagation();
                          handleDragOver(e, sectionId);
                        }}
                        onDragEnd={(e) => {
                          console.log("🏁 DRAG END - Lecture");
                          handleDragEnd();
                          setTimeout(() => {
                            setWasJustDragged(false);
                          }, 200);
                        }}
                        onDrop={(e) => {
                          console.log("📦 DROP on lecture element:", {
                            sectionId,
                            subSectionIndex,
                            draggedItemType: draggedItem?.type
                          });
                          e.preventDefault();
                          e.stopPropagation();
                          // Si se suelta en una subsección específica, usar su índice
                          handleDrop(e, sectionId, subSectionIndex);
                        }}
                        onClick={(e) => {
                          if (wasJustDragged) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                          }
                          setViewSubSection(data);
                        }}
                        className={`flex cursor-grab active:cursor-grabbing items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2 transition-all duration-200 ${
                          isLectureDragged
                            ? "opacity-50 scale-95 bg-richblack-700"
                            : isDragOver
                            ? "bg-yellow-500/20 border-yellow-500"
                            : "hover:bg-richblack-600/30"
                        }`}
                      >
                        <div className="flex items-center gap-x-3 py-2">
                          <HiMenu className="text-lg text-richblack-400 cursor-grab active:cursor-grabbing flex-shrink-0 pointer-events-none" />
                          <RxDropdownMenu className="text-2xl text-richblack-50" />
                          <p className="font-semibold text-richblack-50">
                            {data.title}
                          </p>
                        </div>
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-x-3"
                        >
                        <button
                          onClick={() => {
                            // Asegurar que sectionId es un string válido antes de establecer el estado
                            if (!sectionId || typeof sectionId !== 'string') {
                              console.error("Invalid sectionId when editing subsection:", sectionId);
                              return;
                            }
                            console.log("Setting edit subsection with sectionId:", sectionId, "data:", data);
                            setEditSubSection({ ...data, sectionId: sectionId });
                          }}
                        >
                          <MdEdit className="text-xl text-richblack-300" />
                        </button>
                          <button
                            onClick={() =>
                              setConfirmationModal({
                                text1: "¿Eliminar esta Sub-Sección?",
                                text2: "Esta lección será eliminada",
                                btn1Text: "Eliminar",
                                btn2Text: "Cancelar",
                                btn1Handler: () =>
                                  handleDeleteSubSection(subSectionId, sectionId),
                                btn2Handler: () => setConfirmationModal(null),
                              })
                            }
                          >
                            <RiDeleteBin6Line className="text-xl text-richblack-300" />
                          </button>
                        </div>
                      </div>
                    );
                  });
                } else {
                  return <p className="text-richblack-400 text-sm py-2">No lectures in this section</p>;
                }
              })()}
              {/* Add New Lecture to Section */}
              <button
                onClick={() => setAddSubsection(sectionId)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Agregar Lección</p>
              </button>
            </div>
            </details>
          );
        })}
      </div>

      {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={(
            value: React.SetStateAction<
              string | (SubSection & { sectionId?: string }) | null
            >
          ) => {
            if (typeof value === "function") {
              setAddSubsection((prev) => {
                const newValue = value(
                  prev as string | (SubSection & { sectionId?: string }) | null
                );
                return typeof newValue === "string" ? newValue : null;
              });
            } else {
              setAddSubsection(typeof value === "string" ? value : null);
            }
          }}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={(
            value: React.SetStateAction<
              string | (SubSection & { sectionId?: string }) | null
            >
          ) => {
            if (typeof value === "function") {
              setViewSubSection((prev) => {
                const newValue = value(
                  prev as string | (SubSection & { sectionId?: string }) | null
                );
                return typeof newValue === "object" && newValue !== null
                  ? (newValue as SubSection)
                  : null;
              });
            } else {
              setViewSubSection(
                typeof value === "object" && value !== null
                  ? (value as SubSection)
                  : null
              );
            }
          }}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={(
            value: React.SetStateAction<
              string | (SubSection & { sectionId?: string }) | null
            >
          ) => {
            if (typeof value === "function") {
              setEditSubSection((prev) => {
                const newValue = value(
                  prev as string | (SubSection & { sectionId?: string }) | null
                );
                return typeof newValue === "object" && newValue !== null
                  ? (newValue as SubSection & { sectionId: string })
                  : null;
              });
            } else {
              setEditSubSection(
                typeof value === "object" && value !== null
                  ? (value as SubSection & { sectionId: string })
                  : null
              );
            }
          }}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}

      {/* Move Lecture Warning Modal */}
      {pendingMove && (
        <MoveLectureWarningModal
          isOpen={showMoveWarning}
          lecture={pendingMove.lecture}
          fromSectionName={pendingMove.fromSectionName}
          toSectionName={pendingMove.toSectionName}
          onConfirm={confirmMoveLecture}
          onCancel={cancelMoveLecture}
        />
      )}
    </>
  );
}
