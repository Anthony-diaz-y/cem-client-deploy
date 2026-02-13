import RenderSteps from "../components/navigation/RenderSteps";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function AddCourse() {
  useScrollToTop();

  return (
    <div className="flex flex-col xl:flex-row w-full items-start gap-y-10 xl:gap-y-0 xl:gap-x-10">
      <div className="flex flex-1 flex-col w-full">
        <h1 className="mb-10 text-3xl font-medium text-cem-neutral-gray-900 font-boogaloo text-center xl:text-left">
          Agregar Curso
        </h1>

        <div className="flex-1 w-full mx-auto max-w-[800px] xl:max-w-none">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-24 hidden xl:block w-full max-w-[400px] flex-shrink-0 rounded-2xl border-[1px] border-cem-neutral-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-x-2 mb-6">
          <span className="text-2xl">⚡</span>
          <p className="text-xl text-cem-neutral-gray-900 font-semibold font-boogaloo">Consejos para Subir Cursos</p>
        </div>

        <ul className="ml-5 list-disc space-y-4 text-sm text-cem-neutral-gray-600">
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
