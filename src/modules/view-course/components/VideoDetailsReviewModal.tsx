import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { createRating } from "@modules/course/services/reviewsAPI";
import StarRating from "@shared/components/StarRating";
import IconBtn from "@shared/components/IconBtn";
import Img from "@shared/components/Img";
import { VideoDetailsReviewModalProps, ReviewFormData } from "../types";
import { RootState } from "@shared/store/store";

export default function VideoDetailsReviewModal({
  setReviewModal,
}: VideoDetailsReviewModalProps) {
  const { user } = useSelector((state: RootState) => state.profile);
  const { token } = useSelector((state: RootState) => state.auth);
  const { courseEntireData } = useSelector(
    (state: RootState) => state.viewCourse
  );
  const { courseId } = useParams();

  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReviewFormData>();

  const courseExperience = watch("courseExperience");

  useEffect(() => {
    setRating(0);
    setError(null);
  }, []);

  const onSubmit = async (data: ReviewFormData) => {
    // Obtener courseId de múltiples fuentes posibles
    const normalizedCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
    const courseIdToUse = normalizedCourseId || courseEntireData?._id || (courseEntireData as any)?.id;

    if (!token) {
      toast.error("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    if (!courseIdToUse) {
      toast.error("No se pudo identificar el curso. Por favor, recarga la página.");
      console.error("CourseId no disponible:", { courseId, courseEntireData });
      return;
    }

    // Validaciones
    if (rating === 0) {
      setError("Por favor, selecciona una calificación con estrellas");
      toast.error("Por favor, selecciona una calificación con estrellas");
      return;
    }

    if (!data.courseExperience?.trim()) {
      setError("Por favor, escribe tu experiencia");
      toast.error("Por favor, escribe tu experiencia");
      return;
    }

    if (data.courseExperience.trim().length < 10) {
      setError("La reseña debe tener al menos 10 caracteres");
      toast.error("La reseña debe tener al menos 10 caracteres");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createRating(
        {
          courseId: courseIdToUse,
          rating,
          review: data.courseExperience.trim(),
        },
        token
      );

      if (result) {
        // El servicio ya muestra un toast de éxito, así que solo cerramos el modal
        // Cerrar el modal después de un breve delay para que el usuario vea el toast
        setTimeout(() => {
          setReviewModal(false);
          // Recargar la página o actualizar las reseñas si es necesario
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("reviewUpdated"));
          }
        }, 1500);
      } else {
        setError("No se pudo guardar la reseña. Por favor, intenta nuevamente.");
        // El servicio ya muestra el toast de error, así que no duplicamos
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Error al guardar la reseña. Por favor, intenta nuevamente.";
      setError(errorMessage);
      // El servicio ya muestra el toast de error, así que no duplicamos
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Agregar Reseña</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <Img
              src={user?.image}
              alt={user?.firstName + "profile"}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div className="">
              <p className="font-semibold text-richblack-5 capitalize">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">Publicando públicamente</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col"
          >
            {/* Calificación con Estrellas */}
            <div className="mb-6 flex flex-col items-center">
              <label className="mb-3 text-sm font-medium text-richblack-5">
                Calificación con estrellas <sup className="text-pink-200">*</sup>
              </label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  readonly={false}
                  starSize={32}
                />
                {rating > 0 && (
                  <span className="text-richblack-200 text-sm">
                    {rating} {rating === 1 ? "estrella" : "estrellas"}
                  </span>
                )}
              </div>
              {error && error.includes("calificación") && (
                <span className="mt-2 text-xs text-pink-200">{error}</span>
              )}
            </div>

            {/* Textarea para experiencia */}
            <div className="mb-4 flex w-full flex-col space-y-2">
              <label
                className="text-sm text-richblack-5"
                htmlFor="courseExperience"
              >
                Agrega tu Experiencia <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Comparte tu experiencia con este curso..."
                {...register("courseExperience", { 
                  required: "Por favor, escribe tu experiencia",
                  minLength: {
                    value: 10,
                    message: "La reseña debe tener al menos 10 caracteres"
                  }
                })}
                className="form-style resize-none min-h-[130px] w-full"
              />
              <small className="text-richblack-400 text-xs">
                {courseExperience?.length || 0} caracteres (mínimo 10)
              </small>
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  {errors.courseExperience.message || "Por favor, agrega tu experiencia"}
                </span>
              )}
              {error && !error.includes("calificación") && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  {error}
                </span>
              )}
            </div>

            {/* Botones */}
            <div className="mt-6 flex w-full justify-end gap-x-2">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                disabled={loading}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold
                           text-richblack-900 hover:bg-richblack-900 hover:text-richblack-300 duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0 || !courseExperience?.trim()}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold
                           text-richblack-900 hover:bg-yellow-100 duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
