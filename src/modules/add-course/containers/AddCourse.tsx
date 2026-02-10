import RenderSteps from "../components/navigation/RenderSteps";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function AddCourse() {
  useScrollToTop();

  return (
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-cem-neutral-gray-900 font-boogaloo text-center lg:text-left">
          Agregar Curso
        </h1>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-cem-neutral-gray-200 bg-cem-cardbackground p-6 shadow-sm">
        <p className="mb-8 text-lg text-cem-neutral-gray-900 font-semibold">⚡ Consejos para Subir Cursos</p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-cem-neutral-gray-700">
          <li>Establece el precio del curso o hazlo gratuito.</li>
          <li>El tamaño estándar para la miniatura del curso es 1024x576.</li>
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
          <li>Haz Anuncios para notificar cualquier</li>
          <li>Nota importante a todos los estudiantes inscritos a la vez.</li>
        </ul>
      </div>
    </div>
  );
}
