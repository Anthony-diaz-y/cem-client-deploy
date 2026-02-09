"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClaseProgramada, DatosCalendario } from "@/types/scheduledClasses.types";
import { obtenerCalendario } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import { obtenerMesActual, obtenerNombreMes } from "@/shared/utils/scheduledClassUtils";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ClassDetailsModal from "../ClassDetailsModal";
import EditClassForm from "../forms/EditClassForm";
import { eliminarClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";

interface CalendarViewProps {
  token: string;
  userRole?: string;
  userId?: string;
  refreshKey?: number;
}

export default function CalendarView({ token, userRole, userId, refreshKey }: CalendarViewProps) {
  const [mesActual, setMesActual] = useState(obtenerMesActual());
  const [datosCalendario, setDatosCalendario] = useState<DatosCalendario>({});
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseProgramada | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editModalAbierto, setEditModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [direccionAnimacion, setDireccionAnimacion] = useState<'izquierda' | 'derecha'>('derecha');

  const cargarCalendario = async (esSilencioso = false) => {
    if (!esSilencioso) setCargando(true);
    try {
      const respuesta = await obtenerCalendario(mesActual, token);
      const data = respuesta.data;
      const respAny = respuesta as unknown;

      let clasesDataRaw: DatosCalendario = {};
      if (data && typeof data === 'object') {
        clasesDataRaw = data;
      } else if (respAny && typeof respAny === 'object' && !(respAny as { success?: boolean }).success) {
        clasesDataRaw = respAny as DatosCalendario;
      }

      const reagruparPorFechaLocal = (datos: DatosCalendario): DatosCalendario => {
        const reagrupado: DatosCalendario = {};

        Object.keys(datos).forEach(fechaKey => {
          datos[fechaKey].forEach(clase => {
            if (!clase || !clase.scheduledDate) {
              return;
            }

            const fechaClase = new Date(clase.scheduledDate);
            if (isNaN(fechaClase.getTime())) {
              return;
            }

            const año = fechaClase.getFullYear();
            const mes = String(fechaClase.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaClase.getDate()).padStart(2, '0');
            const fechaLocal = `${año}-${mes}-${dia}`;

            if (!reagrupado[fechaLocal]) {
              reagrupado[fechaLocal] = [];
            }
            reagrupado[fechaLocal].push(clase);
          });
        });

        return reagrupado;
      };

      let clasesData = reagruparPorFechaLocal(clasesDataRaw);

      const esEstudiante = userRole === 'Student';
      if (esEstudiante) {
        const clasesFiltradas: DatosCalendario = {};
        Object.keys(clasesData).forEach(fecha => {
          const clasesActivas = clasesData[fecha].filter(clase => clase.isActive);
          if (clasesActivas.length > 0) {
            clasesFiltradas[fecha] = clasesActivas;
          }
        });
        clasesData = clasesFiltradas;
      }


      setDatosCalendario(clasesData);

      // Actualizar clase seleccionada si el modal está abierto
      if (claseSeleccionada) {
        const todasLasClases = Object.values(clasesData).flat();
        const claseActualizada = todasLasClases.find(c => c.id === claseSeleccionada.id);
        if (claseActualizada) {
          setClaseSeleccionada(claseActualizada);
        }
      }
    } catch (error) {
      toast.error('Error al cargar el calendario');
    } finally {
      if (!esSilencioso) setCargando(false);
    }
  };

  useEffect(() => {
    cargarCalendario();
  }, [mesActual]);

  useEffect(() => {
    if (refreshKey !== undefined && refreshKey > 0) {
      cargarCalendario(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const navegarMes = (direccion: 'anterior' | 'siguiente') => {
    setDireccionAnimacion(direccion === 'anterior' ? 'izquierda' : 'derecha');

    const [año, mes] = mesActual.split('-').map(Number);
    let nuevoMes = mes;
    let nuevoAño = año;

    if (direccion === 'anterior') {
      nuevoMes--;
      if (nuevoMes < 1) {
        nuevoMes = 12;
        nuevoAño--;
      }
    } else {
      nuevoMes++;
      if (nuevoMes > 12) {
        nuevoMes = 1;
        nuevoAño++;
      }
    }

    setMesActual(`${nuevoAño}-${String(nuevoMes).padStart(2, '0')}`);
  };

  const irAHoy = () => {
    const mesHoy = obtenerMesActual();
    const [añoActual, mesActualNum] = mesActual.split('-').map(Number);
    const [añoHoy, mesHoyNum] = mesHoy.split('-').map(Number);

    if (añoHoy > añoActual || (añoHoy === añoActual && mesHoyNum > mesActualNum)) {
      setDireccionAnimacion('derecha');
    } else if (añoHoy < añoActual || (añoHoy === añoActual && mesHoyNum < mesActualNum)) {
      setDireccionAnimacion('izquierda');
    }

    setMesActual(mesHoy);
  };

  const abrirDetalles = (clase: ClaseProgramada) => {
    setClaseSeleccionada(clase);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClaseSeleccionada(null);
  };

  // Abre modal de edición
  const manejarEditar = () => {
    setModalAbierto(false);
    setEditModalAbierto(true);
  };

  // Elimina clase con confirmación
  const manejarEliminar = async () => {
    if (!claseSeleccionada) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer.')) {
      try {
        await eliminarClaseProgramada(claseSeleccionada.id, token);
        toast.success('Clase eliminada exitosamente');
        cerrarModal();
        cargarCalendario(true);
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

  const variantesAnimacion = {
    entrada: (direccion: 'izquierda' | 'derecha') => ({
      x: direccion === 'izquierda' ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
    centro: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    salida: (direccion: 'izquierda' | 'derecha') => ({
      x: direccion === 'izquierda' ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div>
      <CalendarHeader
        mesActual={obtenerNombreMes(mesActual)}
        onMesAnterior={() => navegarMes('anterior')}
        onMesSiguiente={() => navegarMes('siguiente')}
        onHoy={irAHoy}
      />

      <div className="relative overflow-hidden" style={{ minHeight: '600px' }}>
        <AnimatePresence mode="wait" custom={direccionAnimacion}>
          <motion.div
            key={mesActual}
            custom={direccionAnimacion}
            initial="entrada"
            animate="centro"
            exit="salida"
            variants={variantesAnimacion}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
          >
            <CalendarGrid
              datosCalendario={datosCalendario}
              mesActual={mesActual}
              onClassClick={abrirDetalles}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <ClassDetailsModal
        clase={claseSeleccionada}
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onRefresh={() => cargarCalendario(true)}
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
                cargarCalendario(true);
              }}
              onCancel={() => setEditModalAbierto(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
