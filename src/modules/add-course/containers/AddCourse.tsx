import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import RenderSteps from "../components/navigation/RenderSteps";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function AddCourse() {
  const router = useRouter();
  useScrollToTop();

  return (
    <div className="flex flex-col w-full">
      {/* Botón de regreso */}
      <button
        onClick={() => router.push("/dashboard/admin/all-courses")}
        className="flex items-center gap-2 text-cem-primary hover:text-cem-primary-dark transition-colors mb-8 w-fit"
      >
        <FiArrowLeft className="text-lg" />
        <span className="text-sm font-medium">Volver a Cursos</span>
      </button>

      <div className="flex flex-col xl:flex-row w-full items-start gap-y-10 xl:gap-y-0 xl:gap-x-7">
        <div className="flex flex-1 flex-col w-full">
          <h1 className="mb-10 text-4xl font-bold text-cem-neutral-gray-900 text-center xl:text-left">
            Agregar Curso
          </h1>

          <div className="flex-1 w-full mx-auto max-w-[1000px] xl:max-w-none">
            <RenderSteps />
          </div>
        </div>

        {/* Course Upload Tips */}
        <div className="sticky top-24 hidden xl:flex w-full max-w-[371px] self-start mt-[5px] flex-col rounded-2xl border-[1px] border-cem-neutral-gray-200 bg-white pl-4 pr-6 py-6 shadow-sm">
          <div className="flex items-center w-full gap-x-0 mb-2">
            <span className="text-xl">⚡</span>
            <p className="text-xl text-cem-neutral-gray-900 font-semibold font-boogaloo">
              Consejos para Subir Cursos
            </p>
          </div>

          <ul className="list-disc pl-7 space-y-1 text-[14px] leading-[1.1] text-cem-neutral-gray-600">
            <li>Establece el precio del curso o hazlo gratuito.</li>
            <li>El tamaño estándar para la miniatura del curso es 1024x576.</li>
            <li>Tamaño máximo: Imágenes (10MB) y Archivos/Videos (100MB).</li>
            <li>La sección de video controla el video de resumen del curso.</li>
            <li>El Constructor de Curso es donde creas y organizas un curso.</li>
            <li>
              Agrega Temas en la sección Constructor de Curso para crear lecciones, cuestionarios
              y tareas.
            </li>
            <li>
              La información de la sección Datos Adicionales aparece en la
              página individual del curso.
            </li>
            <li>Se recomienda no agregar más de 4 requisitos por curso.</li>
            <li>Haz Anuncios para notificar cualquier</li>
            <li>Nota importante a todos los estudiantes inscritos a la vez.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
