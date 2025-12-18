"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import { setCourseViewSidebar } from "@modules/dashboard/store/sidebarSlice";
import { RootState, AppDispatch } from "@shared/store/store";
import { Section, SidebarSectionListProps } from "../types";
import { toggleLectureCompletion } from "@shared/services/courseDetailsAPI";
import { updateCompletedLectures, removeCompletedLecture } from "../store/viewCourseSlice";

/**
 * SidebarSectionList - Section list component for video details sidebar
 */
const SidebarSectionList: React.FC<SidebarSectionListProps> = ({
  courseSectionData,
  courseId,
  activeStatus,
  videoBarActive,
  completedLectures,
  onSectionClick,
  onSubSectionClick,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { courseViewSidebar } = useSelector(
    (state: RootState) => state.sidebar
  );
  const { token } = useSelector((state: RootState) => state.auth);
  const { courseEntireData } = useSelector((state: RootState) => state.viewCourse);

  const handleSubSectionClick = (sectionId: string, subSectionId: string) => {
    onSubSectionClick(sectionId, subSectionId);
    router.push(
      `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`
    );
    if (
      courseViewSidebar &&
      typeof window !== "undefined" &&
      window.innerWidth <= 640
    ) {
      dispatch(setCourseViewSidebar(false));
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    // Si la sección ya está expandida, colapsarla; si no, expandirla
    if (activeStatus === sectionId) {
      onSectionClick(""); // Colapsar
    } else {
      onSectionClick(sectionId); // Expandir
    }
  };

  // Función para toggle de completado de lecture
  const handleToggleCompletion = async (
    e: React.MouseEvent,
    topicId: string,
    sectionId: string,
    isCurrentlyCompleted: boolean
  ) => {
    e.stopPropagation(); // Evitar que se expanda/colapse la sección
    
    // Obtener courseId del prop o de courseEntireData
    const currentCourseId = courseId || courseEntireData?._id || (courseEntireData as any)?.id;
    
    if (!token || !currentCourseId) {
      console.error("Token o courseId no disponible");
      return;
    }

    // Llamar al backend (el backend maneja el toggle automáticamente)
    const result = await toggleLectureCompletion(
      { 
        courseId: currentCourseId, 
        subsectionId: topicId 
      },
      token
    );

    // Actualizar el estado basado en la respuesta del backend
    if (result?.success) {
      if (result.isCompleted) {
        // Si el backend dice que está completada, agregarla a la lista
        if (!completedLectures.includes(topicId)) {
          dispatch(updateCompletedLectures(topicId));
        }
      } else {
        // Si el backend dice que NO está completada, removerla de la lista
        if (completedLectures.includes(topicId)) {
          dispatch(removeCompletedLecture(topicId));
        }
      }
    }
  };

  // Función para formatear la duración del video
  const formatDuration = (duration: string | number | undefined): string => {
    if (!duration) return "";
    
    // Si es un número (segundos), convertir a minutos y segundos
    let seconds: number;
    if (typeof duration === "string") {
      // Intentar parsear como número
      const parsed = parseFloat(duration);
      if (isNaN(parsed)) return duration; // Si no es un número, devolver el string original
      seconds = parsed;
    } else {
      seconds = duration;
    }

    // Redondear a entero
    seconds = Math.round(seconds);
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar">
      {courseSectionData.length === 0 ? (
        <div className="flex items-center justify-center h-full text-richblack-400 text-sm p-6">
          <p className="text-center">No hay secciones disponibles</p>
        </div>
      ) : (
        <div className="p-2 space-y-2">
          {courseSectionData.map((section: Section, index: number) => {
            // Manejar tanto subSection como subSections (del backend)
            const subSectionsArray = (section.subSection && Array.isArray(section.subSection)) 
              ? section.subSection 
              : ((section as any).subSections && Array.isArray((section as any).subSections))
                ? (section as any).subSections
                : [];
            
            const sectionId = section?._id || (section as any)?.id;
            const isExpanded = activeStatus === sectionId;
            
            return (
              <div
                className="cursor-pointer text-sm text-richblack-5 rounded-lg overflow-hidden border border-richblack-700 hover:border-richblack-600 transition-all"
                onClick={() => handleSectionToggle(sectionId)}
                key={sectionId || index}
              >
                <div className="flex justify-between items-center bg-richblack-700 px-4 py-3.5 hover:bg-richblack-600 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-richblack-5 truncate text-base">
                      {section?.sectionName || `Sección ${index + 1}`}
                    </div>
                    {subSectionsArray.length > 0 && (
                      <div className="text-xs text-richblack-400 mt-1">
                        {subSectionsArray.length} {subSectionsArray.length === 1 ? 'lecture' : 'lectures'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    {subSectionsArray.length > 0 && (
                      <span className="text-xs font-medium text-richblack-300 whitespace-nowrap bg-richblack-800 px-2 py-1 rounded">
                        {subSectionsArray.length}
                      </span>
                    )}
                    <span
                      className={`transition-transform duration-300 text-richblack-400 ${
                        isExpanded
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    >
                      <BsChevronDown size={18} />
                    </span>
                  </div>
                </div>

                {activeStatus === sectionId && (
                  <div className="transition-all duration-300 ease-in-out bg-richblack-800 border-t border-richblack-700">
                    {subSectionsArray.length > 0 ? (
                      <div className="py-2">
                        {subSectionsArray.map((topic, i: number) => {
                          const topicId = topic?._id || (topic as any)?.id;
                          const isActive = videoBarActive === topicId;
                          const isCompleted = completedLectures.includes(topicId);
                          
                          return (
                            <div
                              className={`flex items-center gap-3 px-4 py-2.5 transition-all border-l-4 mx-2 my-1 rounded ${
                                isActive
                                  ? "bg-yellow-50 font-semibold text-richblack-900 border-yellow-400 shadow-md"
                                  : "hover:bg-richblack-900 text-richblack-5 border-transparent hover:border-richblack-600"
                              }`}
                              key={topicId || i}
                            >
                              <div 
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                                  isCompleted 
                                    ? 'bg-yellow-200 border-yellow-400 hover:bg-yellow-300' 
                                    : isActive 
                                      ? 'border-richblack-600 hover:border-yellow-400' 
                                      : 'border-richblack-500 hover:border-yellow-400'
                                }`}
                                onClick={(e) => handleToggleCompletion(e, topicId, sectionId, isCompleted)}
                                title={isCompleted ? "Clic para desmarcar como completada" : "Clic para marcar como completada"}
                              >
                                {isCompleted && (
                                  <span className="text-richblack-900 text-xs font-bold">✓</span>
                                )}
                              </div>
                              <div 
                                className="flex-1 flex flex-col gap-1 min-w-0 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (sectionId && topicId) {
                                    handleSubSectionClick(sectionId, topicId);
                                  }
                                }}
                              >
                                <span className={`text-sm font-medium truncate ${
                                  isActive ? 'text-richblack-900' : 'text-richblack-5'
                                }`}>
                                  {topic.title || `Lecture ${i + 1}`}
                                </span>
                                {topic.timeDuration && (
                                  <span className={`text-xs ${
                                    isActive ? 'text-richblack-700' : 'text-richblack-400'
                                  }`}>
                                    ⏱️ {formatDuration(topic.timeDuration)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-richblack-400 text-sm text-center">
                        No hay lectures disponibles en esta sección
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarSectionList;
