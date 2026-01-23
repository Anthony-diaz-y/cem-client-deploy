import { useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { MdVideoLibrary, MdTextFields, MdAttachFile } from "react-icons/md";

import { SubSectionModalFormData, SubSectionModalProps } from "../../types/index";
import { SubSection } from "../../../course/types";
import { IconBtn, RichTextEditor } from "@shared/components";
import Upload from "../upload/Upload";
import AttachmentUpload from "../upload/AttachmentUpload";
import { useSubSectionForm } from "../../hooks/useSubSectionForm";
import { useSubSectionHandlers } from "../../hooks/useSubSectionHandlers";

// Componente modal para crear/editar/ver subsecciones (lecciones)
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

  const [loading, setLoading] = useState(false);

  const {
    showTextContent,
    setShowTextContent,
    showVideo,
    setShowVideo,
    showAttachments,
    setShowAttachments,
    richTextContent,
    setRichTextContent,
    isFormUpdated,
  } = useSubSectionForm({
    modalData,
    view,
    edit,
    setValue,
    getValues,
  });

  const { handleCreate, handleEdit } = useSubSectionHandlers({
    modalData,
    setModalData,
    setLoading,
    getValues,
    isFormUpdated,
  });

  // Manejar envío del formulario
  const onSubmit = async (data: SubSectionModalFormData) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        return;
      }
      handleEdit();
      return;
    }

    handleCreate(data);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Encabezado del modal */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viendo"} {add && "Agregando"} {edit && "Editando"} Lección
          </p>
          <button
            onClick={() => (!loading ? setModalData(null) : {})}
            className="text-richblack-5 hover:text-richblack-200 transition-colors"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>

        {/* Formulario del modal */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 px-8 py-10"
        >
          {/* Campo título - obligatorio */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-richblack-5" htmlFor="lectureTitle">
              Título de la Lección <sup className="text-pink-200">*</sup>
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Ej. Introducción a los algoritmos"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full bg-richblack-700 border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                El título es requerido
              </span>
            )}
          </div>

          {/* Botones para añadir contenido opcional */}
          {!view && (
            <div className="border-t border-richblack-700 pt-6">
              <p className="text-sm font-medium text-richblack-300 mb-4">
                Contenido Adicional (Opcional)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Botón Contenido de Texto */}
                <button
                  type="button"
                  onClick={() => setShowTextContent(!showTextContent)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${showTextContent
                    ? 'border-yellow-50 bg-yellow-50/10 text-yellow-50'
                    : 'border-richblack-600 bg-richblack-700 text-richblack-300 hover:border-richblack-500'
                    }`}
                >
                  <MdTextFields className="text-xl" />
                  <span className="text-sm font-medium">Contenido de Texto</span>
                </button>

                {/* Botón Video */}
                <button
                  type="button"
                  onClick={() => setShowVideo(!showVideo)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${showVideo
                    ? 'border-yellow-50 bg-yellow-50/10 text-yellow-50'
                    : 'border-richblack-600 bg-richblack-700 text-richblack-300 hover:border-richblack-500'
                    }`}
                >
                  <MdVideoLibrary className="text-xl" />
                  <span className="text-sm font-medium">Video</span>
                </button>

                {/* Botón Archivos */}
                <button
                  type="button"
                  onClick={() => setShowAttachments(!showAttachments)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${showAttachments
                    ? 'border-yellow-50 bg-yellow-50/10 text-yellow-50'
                    : 'border-richblack-600 bg-richblack-700 text-richblack-300 hover:border-richblack-500'
                    }`}
                >
                  <MdAttachFile className="text-xl" />
                  <span className="text-sm font-medium">Archivos</span>
                </button>
              </div>
            </div>
          )}

          {/* Campos opcionales que aparecen dinámicamente */}
          <div className="space-y-6">
            {/* Contenido de Texto - Opcional con Editor Rico */}
            {showTextContent && (
              <div className="flex flex-col space-y-2 animate-fadeIn">
                <label className="text-sm font-medium text-richblack-5 flex items-center gap-2">
                  <MdTextFields className="text-yellow-50" />
                  Contenido de la Lección
                </label>
                <RichTextEditor
                  value={richTextContent}
                  onChange={(value) => {
                    setRichTextContent(value);
                    setValue("lectureContent", value);
                  }}
                  placeholder="Escribe aquí el contenido de la lección con formato rico..."
                  disabled={view || loading}
                />
              </div>
            )}

            {/* Video - Opcional */}
            {showVideo && (
              <div className="animate-fadeIn">
                <Upload
                  name="lectureVideo"
                  label="Video de la Lección"
                  register={register as never}
                  setValue={setValue as never}
                  errors={errors as never}
                  video={true}
                  required={false}
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
              </div>
            )}

            {/* Archivos Adjuntos - Opcional */}
            {showAttachments && (
              <div className="animate-fadeIn">
                <AttachmentUpload<SubSectionModalFormData>
                  name="lectureAttachments"
                  deletedAttachmentsName="deletedAttachments"
                  label="Material Descargable"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  existingAttachments={
                    edit && modalData && typeof modalData === "object"
                      ? (modalData as SubSection).attachments
                      : []
                  }
                />
              </div>
            )}
          </div>

          {/* Botón Submit */}
          {!view && (
            <div className="flex justify-end pt-6 border-t border-richblack-700">
              <IconBtn
                disabled={loading}
                text={loading ? "Guardando..." : edit ? "Actualizar Lección" : "Crear Lección"}
                customClasses="bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-semibold px-6 py-3 rounded-lg transition-colors"
              />
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

