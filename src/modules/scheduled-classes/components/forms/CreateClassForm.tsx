"use client";

import { useForm } from "react-hook-form";
import { CrearClaseDto, Platform } from "@/types/scheduledClasses.types";
import { PLATAFORMAS, DURACION_MINIMA_MINUTOS, SCHEDULED_CLASSES_TEXTS } from "@/modules/scheduled-classes/constants/scheduledClasses.constants";
import { crearClaseProgramada } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";
import { useState } from "react";

interface CreateClassFormProps {
  token: string;
  userRole?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  platform: string;
  meetingLink: string;
  duration: number;
  dateOnly: string;
  timeOnly: string;
}

// Formulario para crear nueva clase programada
export default function CreateClassForm({ token, userRole, onSuccess, onCancel }: CreateClassFormProps) {
  const [enviando, setEnviando] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (datos: FormData) => {
    setEnviando(true);
    try {
      const [año, mes, dia] = datos.dateOnly.split('-').map(Number);
      const [horas, minutos] = datos.timeOnly.split(':').map(Number);
      
      const fechaLocal = new Date(año, mes - 1, dia, horas, minutos);
      const fechaISO = fechaLocal.toISOString();

      const esInstructor = userRole === 'Instructor';
      
      const payload: CrearClaseDto = {
        title: datos.title,
        description: datos.description,
        platform: datos.platform as Platform,
        meetingLink: datos.meetingLink,
        duration: Number(datos.duration),
        scheduledDate: fechaISO,
        isActive: esInstructor ? false : true,
      };

      await crearClaseProgramada(payload, token);
      if (esInstructor) {
        toast.success(SCHEDULED_CLASSES_TEXTS.forms.create.success.instructor);
      } else {
        toast.success(SCHEDULED_CLASSES_TEXTS.forms.create.success.admin);
      }
      onSuccess();
    } catch (error: unknown) {
      const mensaje = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || SCHEDULED_CLASSES_TEXTS.forms.create.error;
      toast.error(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {SCHEDULED_CLASSES_TEXTS.forms.create.fields.title}
        </label>
        <input
          {...register('title', {
            required: SCHEDULED_CLASSES_TEXTS.forms.create.validation.titleRequired,
            maxLength: { value: 255, message: SCHEDULED_CLASSES_TEXTS.forms.create.validation.titleMaxLength }
          })}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder={SCHEDULED_CLASSES_TEXTS.forms.create.placeholders.title}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {SCHEDULED_CLASSES_TEXTS.forms.create.fields.description}
        </label>
        <textarea
          {...register('description', { required: SCHEDULED_CLASSES_TEXTS.forms.create.validation.descriptionRequired })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder={SCHEDULED_CLASSES_TEXTS.forms.create.placeholders.description}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {SCHEDULED_CLASSES_TEXTS.forms.create.fields.platform}
          </label>
          <select
            {...register('platform', { required: SCHEDULED_CLASSES_TEXTS.forms.create.validation.platformRequired })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">{SCHEDULED_CLASSES_TEXTS.forms.create.placeholders.platform}</option>
            {PLATAFORMAS.map((plat) => (
              <option key={plat.value} value={plat.value}>
                {plat.icon} {plat.label}
              </option>
            ))}
          </select>
          {errors.platform && <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {SCHEDULED_CLASSES_TEXTS.forms.create.fields.duration}
          </label>
          <input
            {...register('duration', {
              required: SCHEDULED_CLASSES_TEXTS.forms.create.validation.durationRequired,
              min: { value: DURACION_MINIMA_MINUTOS, message: SCHEDULED_CLASSES_TEXTS.forms.create.validation.durationMin(DURACION_MINIMA_MINUTOS) },
              valueAsNumber: true
            })}
            type="number"
            min={DURACION_MINIMA_MINUTOS}
            defaultValue={60}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {SCHEDULED_CLASSES_TEXTS.forms.create.fields.meetingLink}
        </label>
        <input
          {...register('meetingLink', {
            required: SCHEDULED_CLASSES_TEXTS.forms.create.validation.meetingLinkRequired,
            pattern: {
              value: /^https?:\/\/.+/,  
              message: SCHEDULED_CLASSES_TEXTS.forms.create.validation.meetingLinkPattern
            }
          })}
          type="url"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder={SCHEDULED_CLASSES_TEXTS.forms.create.placeholders.meetingLink}
        />
        {errors.meetingLink && <p className="mt-1 text-sm text-red-600">{errors.meetingLink.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {SCHEDULED_CLASSES_TEXTS.forms.create.fields.date}
          </label>
          <input
            {...register('dateOnly', {
              required: SCHEDULED_CLASSES_TEXTS.forms.create.validation.dateRequired,
              validate: (value) => {
                // Parsear fecha como local (para evitar desfase UTC)
                const [y, m, d] = value.split('-').map(Number);
                const fecha = new Date(y, m - 1, d);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                return fecha >= hoy || SCHEDULED_CLASSES_TEXTS.forms.create.validation.dateFuture;
              }
            })}
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.dateOnly && <p className="mt-1 text-sm text-red-600">{errors.dateOnly.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {SCHEDULED_CLASSES_TEXTS.forms.create.fields.time}
          </label>
          <input
            {...register('timeOnly', {
              required: SCHEDULED_CLASSES_TEXTS.forms.create.validation.timeRequired,
              validate: (value, formValues) => {
                if (!formValues.dateOnly) return true;

                const [y, m, d] = formValues.dateOnly.split('-').map(Number);
                const fechaSeleccionada = new Date(y, m - 1, d);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                // Solo validar hora si es hoy
                if (fechaSeleccionada.getTime() === hoy.getTime()) {
                  const [horas, minutos] = value.split(':').map(Number);
                  const horaSeleccionada = new Date();
                  horaSeleccionada.setHours(horas, minutos, 0, 0);

                  const ahora = new Date();
                  return horaSeleccionada > ahora || SCHEDULED_CLASSES_TEXTS.forms.create.validation.timeFuture;
                }
                return true;
              }
            })}
            type="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.timeOnly && <p className="mt-1 text-sm text-red-600">{errors.timeOnly.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          disabled={enviando}
        >
          {SCHEDULED_CLASSES_TEXTS.forms.create.buttons.cancel}
        </button>
        <button
          type="submit"
          disabled={enviando}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
        >
          {enviando ? SCHEDULED_CLASSES_TEXTS.forms.create.buttons.creating : SCHEDULED_CLASSES_TEXTS.forms.create.buttons.create}
        </button>
      </div>
    </form>
  );
}
