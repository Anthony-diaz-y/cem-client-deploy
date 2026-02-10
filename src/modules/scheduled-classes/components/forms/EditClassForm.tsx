"use client";

import { useForm } from "react-hook-form";
import { ActualizarClaseDto, ClaseProgramada, Platform } from "@/types/scheduledClasses.types";
import { PLATAFORMAS, DURACION_MINIMA_MINUTOS, SCHEDULED_CLASSES_TEXTS } from "@/modules/scheduled-classes/constants/scheduledClasses.constants";
import { actualizarClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";
import { useState } from "react";

interface EditClassFormProps {
  clase: ClaseProgramada;
  token: string;
  userRole?: string;
  onSuccess: (updatedClass?: ClaseProgramada) => void;
  onCancel: () => void;
}

interface EditClassFormData {
  title: string;
  description: string;
  platform: Platform;
  meetingLink: string;
  duration: number;
  isActive: boolean;
  dateOnly: string;
  timeOnly: string;
}

// Formulario para editar una clase programada existente
export default function EditClassForm({ clase, token, userRole, onSuccess, onCancel }: EditClassFormProps) {
  const [enviando, setEnviando] = useState(false);

  const fechaISO = new Date(clase.scheduledDate);
  const añoLocal = fechaISO.getFullYear();
  const mesLocal = fechaISO.getMonth() + 1;
  const diaLocal = fechaISO.getDate();
  const horasLocal = fechaISO.getHours();
  const minutosLocal = fechaISO.getMinutes();

  const dateOnly = `${añoLocal}-${String(mesLocal).padStart(2, '0')}-${String(diaLocal).padStart(2, '0')}`;
  const timeOnly = `${String(horasLocal).padStart(2, '0')}:${String(minutosLocal).padStart(2, '0')}`;

  const { register, handleSubmit, formState: { errors } } = useForm<EditClassFormData>({
    defaultValues: {
      title: clase.title,
      description: clase.description,
      platform: clase.platform,
      meetingLink: clase.meetingLink,
      duration: clase.duration,
      isActive: clase.isActive,
      dateOnly,
      timeOnly
    }
  });

  // Procesa el envío del formulario
  const onSubmit = async (datos: EditClassFormData) => {
    setEnviando(true);
    try {
      const [año, mes, dia] = datos.dateOnly.split('-').map(Number);
      const [horas, minutos] = datos.timeOnly.split(':').map(Number);

      const fechaLocal = new Date(año, mes - 1, dia, horas, minutos);
      const fechaISO = fechaLocal.toISOString();

      // Solo admins pueden cambiar isActive
      const esAdmin = userRole === 'Admin';

      const payload: ActualizarClaseDto = {
        title: datos.title,
        description: datos.description,
        platform: datos.platform,
        meetingLink: datos.meetingLink,
        duration: Number(datos.duration),
        scheduledDate: fechaISO,
        // Solo incluir isActive si es admin
        ...(esAdmin && { isActive: datos.isActive }),
      };

      const response = await actualizarClaseProgramada(clase.id, payload, token);
      toast.success(SCHEDULED_CLASSES_TEXTS.forms.edit.success);
      onSuccess(response?.data);
    } catch (error: unknown) {
      const mensaje = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SCHEDULED_CLASSES_TEXTS.forms.edit.error;
      toast.error(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.title}</label>
        <input
          {...register('title', { required: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.titleRequired, maxLength: { value: 255, message: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.titleMaxLength } })}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.description}</label>
        <textarea
          {...register('description', { required: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.descriptionRequired })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.platform}</label>
          <select
            {...register('platform', { required: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.platformRequired })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {PLATAFORMAS.map((plat) => (
              <option key={plat.value} value={plat.value}>{plat.icon} {plat.label}</option>
            ))}
          </select>
          {errors.platform && <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.duration}</label>
          <input
            {...register('duration', { required: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.durationRequired, min: { value: DURACION_MINIMA_MINUTOS, message: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.durationMin(DURACION_MINIMA_MINUTOS) }, valueAsNumber: true })}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.meetingLink}</label>
        <input
          {...register('meetingLink', { required: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.meetingLinkRequired, pattern: { value: /^https?:\/\/.+/, message: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.meetingLinkPattern } })}
          type="url"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.date}</label>
          <input
            {...register('dateOnly', { required: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.dateRequired })}
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.time}</label>
          <input
            {...register('timeOnly', { required: SCHEDULED_CLASSES_TEXTS.forms.edit.validation.timeRequired })}
            type="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Solo mostrar campo isActive para administradores */}
      {userRole === 'Admin' && (
        <div className="flex items-center gap-2 py-2">
          <input {...register('isActive')} type="checkbox" className="w-4 h-4 text-cem-primary border-gray-300 rounded" />
          <label className="text-sm font-medium text-gray-700">{SCHEDULED_CLASSES_TEXTS.forms.edit.fields.isActive}</label>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium" disabled={enviando}>{SCHEDULED_CLASSES_TEXTS.forms.edit.buttons.cancel}</button>
        <button type="submit" disabled={enviando} className="px-6 py-2 bg-cem-primary text-white rounded-lg hover:bg-cem-primary-dark font-semibold shadow-md">{enviando ? SCHEDULED_CLASSES_TEXTS.forms.edit.buttons.saving : SCHEDULED_CLASSES_TEXTS.forms.edit.buttons.save}</button>
      </div>
    </form>
  );
}
