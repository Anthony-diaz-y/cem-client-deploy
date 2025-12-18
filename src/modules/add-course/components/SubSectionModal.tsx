import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
} from "@shared/services/courseDetailsAPI";
import { setCourse } from "../../course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { Course, Section, SubSection } from "../../course/types";
import { SubSectionModalFormData, SubSectionModalProps } from "../types/index";
import IconBtn from "@shared/components/IconBtn";
import Upload from "./Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}: SubSectionModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<SubSectionModalFormData>();

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const { course } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    if ((view || edit) && modalData && typeof modalData === "object") {
      const subSectionData = modalData as SubSection & { sectionId?: string };
      setValue("lectureTitle", subSectionData.title);
      setValue("lectureDesc", subSectionData.description);
      setValue("lectureVideo", subSectionData.videoUrl);
    }
  }, [view, edit, modalData, setValue]);

  // detect whether form is updated or not
  const isFormUpdated = () => {
    if (!modalData || typeof modalData === "string") return false;
    const currentValues = getValues();
    const subSectionData = modalData as SubSection & { sectionId?: string };
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== subSectionData.title ||
      currentValues.lectureDesc !== subSectionData.description ||
      currentValues.lectureVideo !== subSectionData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    if (!modalData || typeof modalData === "string" || !token || !course) {
      console.error("Missing required data for editing subsection:", { modalData, token, course });
      return;
    }
    const currentValues = getValues();
    const subSectionData = modalData as SubSection & { sectionId?: string };
    const courseData = course as Course;
    
    console.log("Editing subsection - modalData:", modalData);
    console.log("Editing subsection - subSectionData:", subSectionData);
    
    // Validar que sectionId existe y es un string válido
    const sectionId = subSectionData.sectionId;
    if (!sectionId || typeof sectionId !== 'string' || sectionId === 'undefined' || sectionId === 'null') {
      console.error("Invalid sectionId:", sectionId);
      toast.error("ID de sección no encontrado o inválido");
      return;
    }
    
    // Validar formato UUID para sectionId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sectionId)) {
      console.error("Invalid sectionId format:", sectionId);
      toast.error("ID de sección inválido");
      return;
    }
    
    // Obtener el ID de la subsección (priorizar 'id' sobre '_id')
    const subSectionId = (subSectionData as any)?.id || subSectionData?._id;
    if (!subSectionId || typeof subSectionId !== 'string' || subSectionId === 'undefined' || subSectionId === 'null') {
      console.error("Invalid subSectionId:", subSectionId, "subSectionData:", subSectionData);
      toast.error("ID de subsección no encontrado o inválido");
      return;
    }
    
    // Validar formato UUID para subSectionId
    if (!uuidRegex.test(subSectionId)) {
      console.error("Invalid subSectionId format:", subSectionId);
      toast.error("ID de subsección inválido");
      return;
    }
    
    console.log("Valid IDs - sectionId:", sectionId, "subSectionId:", subSectionId);
    
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData();
    // console.log("Values After Editing form values:", currentValues)
    
    // Siempre incluir sectionId y subSectionId (requeridos) - asegurar que son strings válidos
    formData.append("sectionId", String(sectionId));
    formData.append("subSectionId", String(subSectionId));
    
    // Incluir title y description siempre (usar valores actuales del form)
    const title = currentValues.lectureTitle?.trim() || subSectionData.title || '';
    const description = currentValues.lectureDesc?.trim() || subSectionData.description || '';
    
    if (title) {
      formData.append("title", title);
    }
    if (description) {
      formData.append("description", description);
    }
    
    // Para el video, solo incluir si ha cambiado (es un File object o URL diferente)
    if (currentValues.lectureVideo && currentValues.lectureVideo !== subSectionData.videoUrl) {
      // Si es un archivo (File object), agregarlo directamente
      if (currentValues.lectureVideo instanceof File) {
        formData.append("video", currentValues.lectureVideo);
      } else if (typeof currentValues.lectureVideo === 'string' && currentValues.lectureVideo.trim()) {
        // Si es una URL string diferente, agregarla
        formData.append("video", currentValues.lectureVideo.trim());
      }
    }
    setLoading(true);
    try {
      const result = await updateSubSection(formData, token);
      if (result) {
        console.log("UPDATE SUB-SECTION RESULT:", result);
        
        // El backend devuelve la sección actualizada con las subsecciones
        const updatedCourseContent = courseData.courseContent.map(
          (section: Section) => {
            // Obtener el ID de la sección (priorizar 'id' sobre '_id')
            const currentSectionId = (section as any)?.id || section?._id;
            if (currentSectionId === subSectionData.sectionId) {
              // El backend devuelve la sección actualizada con las subsecciones
              // Necesitamos asegurarnos de que preserve todas las propiedades de la sección original
              
              // Verificar si result tiene subSection como array
              // El backend puede devolver 'subSections' (con S mayúscula) o 'subSection'
              let subSectionArray: any[] = [];
              if ((result as any).subSections && Array.isArray((result as any).subSections)) {
                // Backend devuelve 'subSections' con S mayúscula
                subSectionArray = (result as any).subSections;
              } else if (result.subSection && Array.isArray(result.subSection)) {
                subSectionArray = result.subSection;
              } else if (section.subSection && Array.isArray(section.subSection)) {
                // Si el resultado no tiene subSection, mantener el original
                subSectionArray = section.subSection;
              } else if ((section as any).subSections && Array.isArray((section as any).subSections)) {
                // También verificar subSections en la sección original
                subSectionArray = (section as any).subSections;
              }
              
              // Crear la sección actualizada preservando todas las propiedades
              const updatedSection: Section = {
                ...section, // Preservar propiedades originales (sectionName, _id, id, etc.)
                ...result,  // Sobrescribir con las del resultado (subSection actualizado)
                subSection: subSectionArray, // Asegurar que subSection sea un array válido
              };
              
              console.log("Updated section (edit):", updatedSection);
              console.log("SubSection array length (edit):", updatedSection.subSection.length);
              
              return updatedSection;
            }
            return section;
          }
        );
        
        const updatedCourse: Course = {
          ...courseData,
          courseContent: updatedCourseContent,
        };
        
        console.log("UPDATED COURSE (edit):", updatedCourse);
        dispatch(setCourse(updatedCourse));
      }
    } catch (error) {
      console.error("Error updating subsection:", error);
      // El error ya se maneja en updateSubSection
    } finally {
      setModalData(null);
      setLoading(false);
    }
  };

  const onSubmit = async (data: SubSectionModalFormData) => {
    // console.log(data)
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubsection();
      }
      return;
    }

    if (!modalData || typeof modalData !== "string" || !token || !course)
      return;
    
    // Validar que el sectionId es un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(modalData)) {
      toast.error("ID de sección inválido");
      return;
    }
    
    const courseData = course as Course;
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);
    setLoading(true);
    try {
      const result = await createSubSection(formData, token);
      if (result) {
        console.log("CREATE SUB-SECTION RESULT:", result);
        
        // El backend devuelve la sección actualizada con las subsecciones
        // Necesitamos actualizar solo la sección correspondiente en el curso
        console.log("Current courseContent before update:", courseData.courseContent.map((s: Section) => ({
          sectionName: s.sectionName,
          sectionId: (s as any)?.id || s?._id,
          subSectionCount: s.subSection?.length || 0
        })));
        
        const updatedCourseContent = courseData.courseContent.map(
          (section: Section) => {
            // Obtener el ID de la sección (priorizar 'id' sobre '_id')
            const currentSectionId = (section as any)?.id || section?._id;
            console.log(`Comparing section ${currentSectionId} with modalData ${modalData}`);
            
            if (currentSectionId === modalData) {
              // El backend devuelve la sección actualizada con las subsecciones
              // Necesitamos asegurarnos de que preserve todas las propiedades de la sección original
              // y que el array de subSection esté correctamente formado
              
              // Verificar si result tiene subSection como array
              // El backend puede devolver 'subSections' (con S mayúscula) o 'subSection'
              let subSectionArray: any[] = [];
              if ((result as any).subSections && Array.isArray((result as any).subSections)) {
                // Backend devuelve 'subSections' con S mayúscula
                subSectionArray = (result as any).subSections;
              } else if (result.subSection && Array.isArray(result.subSection)) {
                subSectionArray = result.subSection;
              } else if (section.subSection && Array.isArray(section.subSection)) {
                // Si el resultado no tiene subSection, mantener el original
                subSectionArray = section.subSection;
              } else if ((section as any).subSections && Array.isArray((section as any).subSections)) {
                // También verificar subSections en la sección original
                subSectionArray = (section as any).subSections;
              }
              
              // Crear la sección actualizada preservando todas las propiedades
              const updatedSection: Section = {
                ...section, // Preservar propiedades originales (sectionName, _id, id, etc.)
                ...result,  // Sobrescribir con las del resultado (subSection actualizado)
                subSection: subSectionArray, // Asegurar que subSection sea un array válido
              };
              
              console.log("Updated section:", updatedSection);
              console.log("SubSection array length:", updatedSection.subSection.length);
              
              return updatedSection;
            }
            // IMPORTANTE: Retornar la sección original sin cambios si no es la que estamos actualizando
            console.log(`Keeping section ${currentSectionId} unchanged (${section.subSection?.length || 0} subSections)`);
            return section;
          }
        );
        
        // Crear el curso actualizado preservando todas las propiedades
        const updatedCourse: Course = {
          ...courseData, // Preservar todas las propiedades del curso original
          courseContent: updatedCourseContent, // Actualizar solo el courseContent
        };
        
        console.log("UPDATED COURSE:", updatedCourse);
        console.log("Total sections:", updatedCourseContent.length);
        updatedCourseContent.forEach((sec, idx) => {
          console.log(`Section ${idx}: ${sec.sectionName}, subSections: ${sec.subSection?.length || 0}`);
        });
        
        dispatch(setCourse(updatedCourse));
      }
    } catch (error) {
      console.error("Error creating subsection:", error);
      // El error ya se maneja en createSubSection, pero no queremos cerrar el modal si falla
    } finally {
      setModalData(null);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={
              register as unknown as Parameters<typeof Upload>[0]["register"]
            }
            setValue={
              setValue as unknown as Parameters<typeof Upload>[0]["setValue"]
            }
            errors={errors as unknown as Parameters<typeof Upload>[0]["errors"]}
            video={true}
            viewData={
              view && modalData && typeof modalData === "object"
                ? (modalData as SubSection).videoUrl
                : null
            }
            editData={
              edit && modalData && typeof modalData === "object"
                ? (modalData as SubSection).videoUrl
                : null
            }
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
