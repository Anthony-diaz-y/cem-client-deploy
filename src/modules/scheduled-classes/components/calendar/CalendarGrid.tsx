"use client";

import { useState, useEffect } from "react";
import { ClaseProgramada, DatosCalendario } from "@/types/scheduledClasses.types";
import DayCell from "./DayCell";

interface CalendarGridProps {
  datosCalendario: DatosCalendario;
  mesActual: string;
  onClassClick: (clase: ClaseProgramada) => void;
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Grid principal del calendario
export default function CalendarGrid({ datosCalendario, mesActual, onClassClick }: CalendarGridProps) {
  const generarDiasDelMes = () => {
    const [año, mes] = mesActual.split('-').map(Number);
    const primerDia = new Date(año, mes - 1, 1);
    const ultimoDia = new Date(año, mes, 0);

    const diasAnteriores = primerDia.getDay();
    const diasDelMes = ultimoDia.getDate();

    const dias: { fecha: string; esMesActual: boolean }[] = [];

    const formatearFechaLocal = (fecha: Date): string => {
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      return `${año}-${mes}-${dia}`;
    };

    for (let i = diasAnteriores - 1; i >= 0; i--) {
      const fecha = new Date(año, mes - 1, -i);
      dias.push({
        fecha: formatearFechaLocal(fecha),
        esMesActual: false,
      });
    }

    for (let dia = 1; dia <= diasDelMes; dia++) {
      const fecha = new Date(año, mes - 1, dia);
      dias.push({
        fecha: formatearFechaLocal(fecha),
        esMesActual: true,
      });
    }

    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      const fecha = new Date(año, mes, i);
      dias.push({
        fecha: formatearFechaLocal(fecha),
        esMesActual: false,
      });
    }

    return dias;
  };

  const dias = generarDiasDelMes();
  
  const [hoy, setHoy] = useState<string>('');
  
  useEffect(() => {
    const calcularHoy = () => {
      const ahora = new Date();
      const año = ahora.getFullYear();
      const mes = ahora.getMonth() + 1;
      const dia = ahora.getDate();
      const fechaHoy = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      setHoy(fechaHoy);
    };
    
    calcularHoy();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="grid grid-cols-7 bg-gradient-to-b from-gray-50 to-gray-100 border-b-2 border-gray-300">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="py-3.5 text-center text-sm font-bold text-gray-700 uppercase tracking-wide">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {dias.map(({ fecha, esMesActual }) => (
          <DayCell
            key={fecha}
            fecha={fecha}
            clases={datosCalendario[fecha] || []}
            esHoy={fecha === hoy}
            esMesActual={esMesActual}
            onClassClick={onClassClick}
          />
        ))}
      </div>
    </div>
  );
}
