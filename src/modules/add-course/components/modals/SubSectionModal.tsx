import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiBook, FiVideo, FiPaperclip } from "react-icons/fi";
import {
  SubSectionModalFormData,
  SubSectionModalProps,
} from "../../types/index";
import { SubSection } from "../../../course/types";
import { CEMModalLayout, RichTextEditor } from "@shared/components";
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

  const onSubmit = async (data: SubSectionModalFormData) => {
    if (view) return;
    if (edit) {
      if (!isFormUpdated()) return;
      handleEdit();
      return;
    }
    handleCreate(data);
  };

  const footer = (
    <div className="flex items-center justify-end gap-x-4 w-full h-[48px]">
      <button
        type="button"
        onClick={() => setModalData(null)}
        disabled={loading}
        className="w-[103px] h-[48px] bg-[#DCEEEF] text-cem-primary rounded-xl font-bold text-base hover:bg-[#D5E8E9] transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center"
      >
        Cancelar
      </button>
      {!view && (
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-[161px] h-[48px] bg-cem-primary text-white rounded-xl font-bold text-base hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 flex items-center justify-center active:scale-95"
        >
          {loading ? "..." : edit ? "Actualizar" : "Crear lección"}
        </button>
      )}
    </div>
  );

  return (
    <CEMModalLayout
      isOpen={!!modalData}
      onClose={() => setModalData(null)}
      title={`${view ? "Viendo" : add ? "Agregar" : "Editar"} lección`}
      centeredTitle={true}
      loading={loading}
      footer={footer}
      width="575px"
      height="650px"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
        <div className="flex flex-col space-y-1.5">
          <label
            className="text-sm font-bold text-cem-neutral-gray-900"
            htmlFor="lectureTitle"
          >
            Título de la Lección <sup className="text-red-500">*</sup>
          </label>
          <input
            disabled={view || loading}
            id="lectureTitle"
            placeholder="Agrega una sección para construir tu curso"
            {...register("lectureTitle", { required: true })}
            className="form-style w-full border-cem-neutral-gray-100 focus:border-cem-primary focus:ring-1 focus:ring-cem-primary py-2.5"
          />
          {errors.lectureTitle && (
            <span className="text-[10px] text-red-500 font-medium ml-1">
              El título es requerido
            </span>
          )}
        </div>

        <div className="w-full h-px border-t border-dashed border-cem-neutral-gray-100 my-1" />

        {!view && (
          <div className="pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setShowTextContent(!showTextContent)}
                className={`flex items-center justify-center gap-3 w-full h-[48px] rounded-xl border transition-all ${showTextContent
                  ? "border-cem-primary bg-cem-primary/5 text-cem-primary shadow-sm"
                  : "border-cem-neutral-gray-200 bg-[#F9FAFB] text-cem-neutral-gray-900 hover:border-cem-primary/40"
                  }`}
              >
                <FiBook className="text-xl" />
                <span className="font-bold text-sm">Texto</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVideo(!showVideo)}
                className={`flex items-center justify-center gap-3 w-full h-[48px] rounded-xl border transition-all ${showVideo
                  ? "border-cem-primary bg-cem-primary/5 text-cem-primary shadow-sm"
                  : "border-cem-neutral-gray-200 bg-[#F9FAFB] text-cem-neutral-gray-900 hover:border-cem-primary/40"
                  }`}
              >
                <FiVideo className="text-xl" />
                <span className="font-bold text-sm">Video</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAttachments(!showAttachments)}
                className={`flex items-center justify-center gap-3 w-full h-[48px] rounded-xl border transition-all ${showAttachments
                  ? "border-cem-primary bg-cem-primary/5 text-cem-primary shadow-sm"
                  : "border-cem-neutral-gray-200 bg-[#F9FAFB] text-cem-neutral-gray-900 hover:border-cem-primary/40"
                  }`}
              >
                <FiPaperclip className="text-xl" />
                <span className="font-bold text-sm">Archivos</span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col space-y-2 animate-fadeIn">
            <label className="text-xs font-bold text-cem-neutral-gray-900 flex items-center gap-2">
              <FiBook className="text-cem-primary" />
              Descripción (Pública)
            </label>
            <textarea
              {...register("lectureDescription")}
              disabled={view || loading}
              placeholder="Breve resumen de la lección que verán todos los usuarios"
              className="form-style w-full border-cem-neutral-gray-100 focus:border-cem-primary focus:ring-1 focus:ring-cem-primary py-2.5 min-h-[80px] text-sm"
            />
          </div>

          {showTextContent && (
            <div className="flex flex-col space-y-2 animate-fadeIn">
              <label className="text-xs font-bold text-cem-neutral-gray-900 flex items-center gap-2">
                <FiBook className="text-cem-primary" />
                Contenido de la Lección (Privado)
              </label>
              <RichTextEditor
                value={richTextContent}
                onChange={(value) => {
                  setRichTextContent(value);
                  setValue("lectureContent", value);
                }}
                disabled={view || loading}
              />
            </div>
          )}

          {showVideo && (
            <div className="flex flex-col space-y-1.5 animate-fadeIn">
              <label
                className="text-sm font-bold text-cem-neutral-gray-900"
                htmlFor="lectureVideo"
              >
                URL del Video
              </label>
              <input
                disabled={view || loading}
                id="lectureVideo"
                placeholder="Pega aquí la url del video de Youtube o Vimeo"
                {...register("lectureVideo", {
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*$/,
                    message: "El enlace debe ser de YouTube o Vimeo (ej: youtube.com/...)",
                  },
                })}
                className="form-style w-full border-cem-neutral-gray-100 focus:border-cem-primary focus:ring-1 focus:ring-cem-primary py-2.5"
              />
              {errors.lectureVideo && (
                <span className="text-[10px] text-red-500 font-medium ml-1">
                  {errors.lectureVideo.message}
                </span>
              )}
            </div>
          )}

          {showAttachments && (
            <div className="animate-fadeIn">
              <AttachmentUpload<SubSectionModalFormData>
                name="lectureAttachments"
                deletedAttachmentsName="deletedAttachments"
                label="Material"
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
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </CEMModalLayout>
  );
}
