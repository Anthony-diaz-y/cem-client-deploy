"use client";

import { useState, useEffect } from "react";
import { ClaseProgramada, ParametrosConsultaClases, Platform } from "@/types/scheduledClasses.types";
import { obtenerClases } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import { PAGINACION_DEFAULT } from "@/modules/scheduled-classes/constants/scheduledClasses.constants";
import ClassListItem from "./ClassListItem";
import ClassDetailsModal from "../ClassDetailsModal";
import CalendarFilters from "../filters/CalendarFilters";
import StudentClassFilters from "../filters/StudentClassFilters";
import EditClassForm from "../forms/EditClassForm";
import { eliminarClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";

interface ClassListViewProps {
  token: string;
  userRole?: string;
  userId?: string;
  refreshKey?: number;
}

// Vista de lista alternativa al calendario
export default function ClassListView({ token, userRole, userId, refreshKey }: ClassListViewProps) {
  const [clases, setClases] = useState<ClaseProgramada[]>([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseProgramada | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editModalAbierto, setEditModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [plataformaSeleccionada, setPlataformaSeleccionada] = useState<Platform | 'all'>('all');
  const [soloActivas, setSoloActivas] = useState(false);
  const [filtroInscripcion, setFiltroInscripcion] = useState<'all' | 'enrolled' | 'not-enrolled'>('all');

  const esEstudiante = userRole === 'Student';
  const esInstructor = userRole === 'Instructor';
  const esAdmin = userRole === 'Admin';

  const cargarClases = async (esSilencioso = false) => {
    if (!esSilencioso) setCargando(true);
    try {
      const parametros: ParametrosConsultaClases = {
        page: paginaActual,
        limit: PAGINACION_DEFAULT.limit,
      };

      // Filtros según el rol
      if (esEstudiante) {
        // Estudiantes: filtro de inscripción
        if (filtroInscripcion === 'enrolled') {
          parametros.enrolled = true;
        } else if (filtroInscripcion === 'not-enrolled') {
          parametros.enrolled = false;
        }
        // El backend filtra automáticamente solo clases activas para estudiantes
        // No enviamos isActive para estudiantes, el backend lo maneja
      } else {
        // Instructores y Admins: filtro de estado activo
        if (soloActivas) {
          parametros.isActive = true;
        }
        // Instructores y Admins pueden ver todas las clases (activas e inactivas)
        // Si soloActivas es false, no enviamos el parámetro para ver todas
      }

      if (plataformaSeleccionada !== 'all') {
        parametros.platform = plataformaSeleccionada;
      }

      const respuesta = await obtenerClases(parametros, token);

      // Manejo robusto de la respuesta
      const data = respuesta.data;
      const respAny = respuesta as unknown;

      if (data && Array.isArray(data.classes)) {
        setClases(data.classes);
        setTotalPaginas(data.totalPages || 1);

        // Actualizar clase seleccionada en el modal para reflejar cambios inmediatos
        if (claseSeleccionada) {
          const claseActualizada = data.classes.find((c: ClaseProgramada) => c.id === claseSeleccionada.id);
          if (claseActualizada) setClaseSeleccionada(claseActualizada);
        }
      } else if (respAny && typeof respAny === 'object' && 'classes' in respAny && Array.isArray((respAny as { classes: unknown[] }).classes)) {
        const respTyped = respAny as { classes: ClaseProgramada[]; totalPages?: number };
        setClases(respTyped.classes);
        setTotalPaginas(respTyped.totalPages || 1);

        if (claseSeleccionada) {
          const claseActualizada = respTyped.classes.find((c: ClaseProgramada) => c.id === claseSeleccionada.id);
          if (claseActualizada) setClaseSeleccionada(claseActualizada);
        }
      } else {
        setClases([]);
      }
    } catch (error) {
      toast.error('Error al cargar las clases');
    } finally {
      if (!esSilencioso) setCargando(false);
    }
  };

  useEffect(() => {
    cargarClases();
  }, [paginaActual, plataformaSeleccionada, soloActivas, filtroInscripcion]);

  useEffect(() => {
    if (refreshKey !== undefined && refreshKey > 0) {
      cargarClases(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const abrirDetalles = (clase: ClaseProgramada) => {
    setClaseSeleccionada(clase);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClaseSeleccionada(null);
  };

  // Abre el modal de edición
  const manejarEditar = () => {
    setModalAbierto(false);
    setEditModalAbierto(true);
  };

  // Elimina una clase con confirmación
  const manejarEliminar = async () => {
    if (!claseSeleccionada) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer.')) {
      try {
        await eliminarClaseProgramada(claseSeleccionada.id, token);
        toast.success('Clase eliminada exitosamente');
        cerrarModal();
        cargarClases(true);
      } catch (error) {
        toast.error('Error al eliminar la clase');
      }
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cem-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {esEstudiante ? (
        <StudentClassFilters
          selectedPlatform={plataformaSeleccionada}
          onPlatformChange={setPlataformaSeleccionada}
          enrolledFilter={filtroInscripcion}
          onEnrolledFilterChange={setFiltroInscripcion}
        />
      ) : (
        <CalendarFilters
          selectedPlatform={plataformaSeleccionada}
          onPlatformChange={setPlataformaSeleccionada}
          showActiveOnly={soloActivas}
          onActiveToggle={() => setSoloActivas(!soloActivas)}
        />
      )}

      <div className="space-y-4">
        {clases.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No hay clases programadas</p>
          </div>
        ) : (
          clases.map((clase) => (
            <ClassListItem
              key={clase.id}
              clase={clase}
              onViewDetails={() => abrirDetalles(clase)}
            />
          ))
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
            disabled={paginaActual === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="text-gray-700 font-medium">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      <ClassDetailsModal
        clase={claseSeleccionada}
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onRefresh={() => cargarClases(true)}
        token={token}
        userRole={userRole}
        userId={userId}
        onEdit={manejarEditar}
        onDelete={manejarEliminar}
      />

      {/* Modal de Edición */}
      {editModalAbierto && claseSeleccionada && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Clase</h2>
            <EditClassForm
              clase={claseSeleccionada}
              token={token}
              userRole={userRole}
              onSuccess={() => {
                setEditModalAbierto(false);
                setClaseSeleccionada(null);
                cargarClases(true);
              }}
              onCancel={() => setEditModalAbierto(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
