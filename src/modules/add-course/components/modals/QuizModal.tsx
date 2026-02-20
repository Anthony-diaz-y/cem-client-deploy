import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import { QuizFormData, QuizModalProps, SubSectionModalFormData } from "../../types/index";
import { SubSection } from "../../../course/types";
import { CEMModalLayout } from "@shared/components";
import { useSubSectionHandlers } from "../../hooks/useSubSectionHandlers";

export default function QuizModal({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false,
}: QuizModalProps) {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<QuizFormData>({
        defaultValues: {
            quizTitle: "",
            questions: [
                {
                    questionText: "",
                    options: ["", "", "", ""],
                    correctOptionIndex: 0,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    const watchedQuestions = watch("questions");

    const { handleCreate, handleEdit } = useSubSectionHandlers({
        modalData,
        setModalData,
        setLoading,
        getValues: () => ({} as SubSectionModalFormData),
        isFormUpdated: () => true,
    });

    useEffect(() => {
        if ((view || edit) && modalData && typeof modalData === "object") {
            const sub = modalData as SubSection;
            reset({
                quizTitle: sub.quizTitle || "",
                questions: sub.questions || [],
            });
        }
    }, [modalData, reset, view, edit]);

    const onSubmit = async (data: QuizFormData) => {
        if (view) return;

        const payload = {
            lectureTitle: data.quizTitle,
            questions: data.questions,
        };

        if (edit) {
            handleEdit(data, true);
        } else {
            handleCreate(payload, true);
        }
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
                    {loading ? "..." : edit ? "Actualizar" : "Crear Quiz"}
                </button>
            )}
        </div>
    );

    return (
        <CEMModalLayout
            isOpen={!!modalData}
            onClose={() => setModalData(null)}
            title={`${view ? "Viendo" : add ? "Agregar" : "Editar"} Quiz`}
            centeredTitle={true}
            loading={loading}
            footer={footer}
            width="700px"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-bold text-cem-neutral-gray-900" htmlFor="quizTitle">
                        Título del Quiz <sup className="text-red-500">*</sup>
                    </label>
                    <input
                        disabled={view || loading}
                        id="quizTitle"
                        placeholder="Ej: Evaluación de conceptos básicos"
                        {...register("quizTitle", { required: "El título es obligatorio" })}
                        className="form-style w-full border-cem-neutral-gray-100 focus:border-cem-primary focus:ring-1 focus:ring-cem-primary py-2.5"
                    />
                    {errors.quizTitle && (
                        <span className="text-[10px] text-red-500 font-medium ml-1">
                            {errors.quizTitle.message}
                        </span>
                    )}
                </div>

                <div className="space-y-8">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 rounded-2xl border border-cem-neutral-gray-100 bg-cem-neutral-gray-50/50 space-y-4 relative group">
                            {!view && fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute top-4 right-4 text-cem-neutral-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <MdDelete size={20} />
                                </button>
                            )}

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-sm font-bold text-cem-neutral-gray-900">
                                    Pregunta {index + 1} <sup className="text-red-500">*</sup>
                                </label>
                                <input
                                    disabled={view || loading}
                                    placeholder="Escribe la pregunta aquí..."
                                    {...register(`questions.${index}.questionText` as const, { required: "La pregunta es obligatoria" })}
                                    className="form-style w-full border-cem-neutral-gray-100 focus:border-cem-primary focus:ring-1 focus:ring-cem-primary py-2.5"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map((optIndex) => (
                                    <div key={optIndex} className="flex flex-col space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-cem-neutral-gray-500">
                                                Opción {optIndex + 1}
                                            </label>
                                            {!view && (
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        value={optIndex}
                                                        disabled={loading}
                                                        {...register(`questions.${index}.correctOptionIndex` as const)}
                                                        className="w-3 h-3 text-cem-primary focus:ring-cem-primary"
                                                        checked={Number(watchedQuestions?.[index]?.correctOptionIndex) === optIndex}
                                                    />
                                                    <span className="text-[10px] font-bold text-cem-primary">Correcta</span>
                                                </label>
                                            )}
                                        </div>
                                        <input
                                            disabled={view || loading}
                                            placeholder={`Opción ${optIndex + 1}`}
                                            {...register(`questions.${index}.options.${optIndex}` as const, { required: "Opción requerida" })}
                                            className={`form-style w-full py-2 ${view && Number(field.correctOptionIndex) === optIndex
                                                ? "border-green-500 bg-green-50"
                                                : "border-cem-neutral-gray-100"
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {!view && (
                    <button
                        type="button"
                        onClick={() => append({ questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 })}
                        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-cem-neutral-gray-200 rounded-2xl text-cem-neutral-gray-500 hover:border-cem-primary hover:text-cem-primary transition-all font-bold"
                    >
                        <MdAdd size={20} />
                        Agregar otra pregunta
                    </button>
                )}
            </form>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
        </CEMModalLayout>
    );
}
