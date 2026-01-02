import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { resetCourseState, setEditCourse, setStep } from "../../course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { Course, Section, SubSection } from "../../course/types";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import { reorderSections, reorderSubSections } from "@shared/services/courseDetailsAPI";

/**
 * Custom hook for course builder navigation logic
 * Separates navigation logic from component
 */
export const useCourseBuilderNavigation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { course } = useSelector((state: RootState) => state.course);
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);

  const goToNext = async () => {
    if (!course || !token) return;

    const courseData = course as Course;
    
    // Validar que courseContent existe y es un array
    if (!courseData.courseContent || !Array.isArray(courseData.courseContent) || courseData.courseContent.length === 0) {
      toast.error("Por favor, agrega al menos una sección");
      return;
    }
    
    // Validar que cada sección tenga al menos una subsección
    const sectionsWithoutLectures = courseData.courseContent.filter(
      (section) => {
        // Verificar que subSection o subSections existe, es un array y tiene al menos un elemento
        // El backend puede devolver 'subSections' (con S mayúscula) o 'subSection'
        const subSectionsArray = section.subSection || (section as any).subSections;
        const hasSubSections = subSectionsArray && 
                              Array.isArray(subSectionsArray) && 
                              subSectionsArray.length > 0;
        if (!hasSubSections) {
          console.log(`Section "${section.sectionName}" (ID: ${(section as any)?.id || section?._id}) has no lectures`);
        }
        return !hasSubSections;
      }
    );
    
    if (sectionsWithoutLectures.length > 0) {
      console.log("Sections without lectures:", sectionsWithoutLectures);
      toast.error(`Por favor, agrega al menos una lección en cada sección. ${sectionsWithoutLectures.length} sección(es) sin lecciones.`);
      return;
    }

    // Obtener el ID del curso
    const courseId = (courseData as any)?.id || courseData?._id;
    if (!courseId) {
      toast.error("ID de curso no encontrado");
      return;
    }

    // Guardar el orden de las secciones y subsecciones
    const toastId = toast.loading("Guardando cambios...");
    try {
      // 1. Reordenar secciones
      const sectionIds = courseData.courseContent.map((section: Section) => {
        return (section as any)?.id || section?._id;
      }).filter(Boolean);

      if (sectionIds.length > 0) {
        console.log("💾 Guardando orden de secciones:", sectionIds);
        await reorderSections(
          {
            courseId,
            sectionIds,
          },
          token,
          false // No mostrar toast individual
        );
      }

      // 2. Reordenar subsecciones en cada sección
      for (const section of courseData.courseContent) {
        const sectionId = (section as any)?.id || section?._id;
        const subSectionsArray = section.subSection || (section as any).subSections || [];
        
        if (subSectionsArray.length > 0 && sectionId) {
          const subSectionIds = subSectionsArray.map((sub: SubSection) => {
            return (sub as any)?.id || sub?._id;
          }).filter(Boolean);

          if (subSectionIds.length > 0) {
            console.log(`💾 Guardando orden de subsecciones en sección ${sectionId}:`, subSectionIds);
            await reorderSubSections(
              {
                sectionId,
                subSectionIds,
              },
              token,
              false // No mostrar toast individual
            );
          }
        }
      }

      // Cerrar el toast de loading
      toast.dismiss(toastId);

      // Verificar si es admin para redirigir correctamente
      const isAdmin = user?.accountType === ACCOUNT_TYPE.ADMIN;
      
      // Mensaje de confirmación único
      if (isAdmin) {
        toast.success("Curso editado exitosamente");
      } else {
        toast.success("¡Curso creado exitosamente! El curso está en estado 'Borrador' y pendiente de revisión por el administrador.", {
          duration: 6000,
        });
      }
      
      // Resetear el estado del curso y redirigir según el tipo de usuario
      dispatch(resetCourseState());
      if (isAdmin) {
        router.push("/dashboard/admin/all-courses");
      } else {
        router.push("/dashboard/my-courses");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error al guardar el orden:", error);
      toast.error("Error al guardar los cambios. Por favor, intenta nuevamente.");
    }
  };

  const goBack = () => {
    dispatch(setStep(1));
  };

  return { goToNext, goBack };
};
