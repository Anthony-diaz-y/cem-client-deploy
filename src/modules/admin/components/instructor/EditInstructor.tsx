"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getInstructorDetails,
  updateInstructor,
  UpdateInstructorData,
} from "@shared/services/adminAPI";
import { Loading } from "@shared/components";
import { FiArrowLeft, FiEdit, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

interface EditInstructorProps {
  instructorId: string;
  token: string;
}

/**
 * Componente para editar información de un instructor
 * Permite modificar nombre, email, número de contacto y estado de aprobación
 */
export default function EditInstructor({
  instructorId,
  token,
}: EditInstructorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateInstructorData>({
    name: "",
    email: "",
    approved: false,
    contactNumber: null,
  });

  // Estado local para el input del teléfono (siempre string)
  const [contactNumberInput, setContactNumberInput] = useState<string>("");

  // Estado local para especialidades (Experto en)
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialtiesList, setSpecialtiesList] = useState<string[]>([]);

  // Carga los datos del instructor desde la API
  const loadInstructor = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getInstructorDetails(instructorId, token);
      if (data?.instructor) {
        const contactNumber = data.instructor.profile?.contactNumber;
        setFormData({
          name: data.instructor.name,
          email: data.instructor.email,
          approved: data.instructor.approved || false,
          contactNumber: contactNumber || null,
        });
        // Actualizar el input del teléfono (siempre string para el input)
        setContactNumberInput(contactNumber ? String(contactNumber) : "");

        // Cargar especialidades desde professional_title
        const title = data.instructor.profile?.professional_title;
        if (title) {
          setSpecialtiesList(title.split(",").map((s: string) => s.trim()).filter(Boolean));
        }
      }
    } catch {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  }, [instructorId, token]);

  useEffect(() => {
    loadInstructor();
  }, [loadInstructor]);

  // Funciones para manejar especialidades
  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !specialtiesList.includes(specialtyInput.trim())) {
      setSpecialtiesList([...specialtiesList, specialtyInput.trim()]);
      setSpecialtyInput("");
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setSpecialtiesList(specialtiesList.filter((_, i) => i !== index));
  };

  // Maneja el envío del formulario y actualiza el instructor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      // Construir el valor del número de contacto
      const contactNumberValue =
        contactNumberInput.trim() === ""
          ? null
          : contactNumberInput.trim()
            ? parseInt(contactNumberInput.trim(), 10)
            : null;

      // Validar que el número sea válido
      const finalContactNumber =
        contactNumberValue !== null && !isNaN(contactNumberValue)
          ? contactNumberValue
          : null;

      // Construir el professional_title desde la lista de especialidades
      const professionalTitle = specialtiesList.join(", ");

      // Construir el objeto de actualización explícitamente
      const updates: UpdateInstructorData = {};

      if (formData.name) updates.name = formData.name;
      if (formData.email) updates.email = formData.email;
      if (formData.approved !== undefined) updates.approved = formData.approved;

      // Incluir contactNumber incluso si es null (para eliminar el número)
      updates.contactNumber = finalContactNumber;

      // Incluir professional_title
      updates.professional_title = professionalTitle || null;

      const result = await updateInstructor(instructorId, updates, token);

      if (result) {
        router.push(`/dashboard/admin/instructors/${instructorId}`);
      }
    } catch {
      // Error manejado por el servicio
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Botón volver */}
      <button
        onClick={() =>
          router.push(`/dashboard/admin/instructors/${instructorId}`)
        }
        className="flex items-center gap-2 text-cem-neutral-gray-400 hover:text-cem-primary transition-all group w-fit"
      >
        <div className="p-2 rounded-full group-hover:bg-cem-primary/10 transition-all">
          <FiArrowLeft size={20} />
        </div>
        <span className="font-bold text-sm tracking-wide">Volver a detalles</span>
      </button>

      <div className="bg-white rounded-[2.5rem] border border-cem-neutral-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-cem-primary/10 flex items-center justify-center text-cem-primary">
            <FiEdit size={24} />
          </div>
          <h1 className="text-3xl font-medium text-cem-neutral-gray-900 tracking-tight">
            Editar Perfil del Instructor
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-cem-neutral-gray-700 ml-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: Anthony Daniel Díaz"
                required
                className="w-full h-14 px-6 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-xl text-sm font-semibold text-cem-neutral-gray-700 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-cem-neutral-gray-700 ml-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="instructor@example.com"
                required
                className="w-full h-14 px-6 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-xl text-sm font-semibold text-cem-neutral-gray-700 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-cem-neutral-gray-700 ml-1">
                Número de Contacto <span className="text-[10px] text-cem-neutral-gray-400 font-normal uppercase ml-1">(Opcional)</span>
              </label>
              <input
                type="tel"
                value={contactNumberInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Solo números
                  setContactNumberInput(value);
                  setFormData({
                    ...formData,
                    contactNumber: value === "" ? null : value,
                  });
                }}
                placeholder="Ej: 999000099"
                maxLength={15}
                className="w-full h-14 px-6 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-xl text-sm font-semibold text-cem-neutral-gray-700 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
              />
              <p className="text-[11px] text-cem-neutral-gray-400 italic ml-1">
                Ingresa solo números. Déjalo vacío para eliminar el número.
              </p>
            </div>

            <div className="flex items-end pb-4">
              <label className="relative flex items-center gap-3 cursor-pointer group bg-cem-neutral-gray-50 p-4 rounded-xl border border-cem-neutral-gray-100 hover:border-cem-primary/30 transition-all w-full select-none">
                <input
                  type="checkbox"
                  checked={formData.approved}
                  onChange={(e) =>
                    setFormData({ ...formData, approved: e.target.checked })
                  }
                  className="w-6 h-6 rounded-lg border-2 border-cem-neutral-gray-300 text-cem-primary focus:ring-cem-primary/20 transition-all cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-cem-neutral-gray-800">
                    Instructor Aprobado
                  </span>
                  <span className="text-[10px] text-cem-neutral-gray-500 font-medium">
                    Permite que sus cursos sean visibles en el catálogo.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Campo Experto en (Especialidades) */}
          <div className="space-y-4 pt-4 border-t border-cem-neutral-gray-50">
            <div className="flex flex-col space-y-2">
              <label className="block text-sm font-bold text-cem-neutral-gray-700 ml-1">
                Experto en <span className="text-[10px] text-cem-neutral-gray-400 font-normal uppercase ml-1">(Especialidades)</span>
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                  placeholder="Ej: Biología, Finanzas, UI/UX..."
                  className="flex-1 h-14 px-6 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-xl text-sm font-semibold text-cem-neutral-gray-700 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="px-6 h-14 bg-cem-primary/10 text-cem-primary rounded-xl font-bold hover:bg-cem-primary hover:text-white transition-all flex items-center gap-2"
                >
                  <FiPlus size={20} />
                  Agregar
                </button>
              </div>
              <p className="text-[11px] text-cem-neutral-gray-400 italic ml-1">
                Presiona Enter o el botón Agregar para incluir una especialidad.
              </p>
            </div>

            {specialtiesList.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {specialtiesList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-cem-neutral-gray-100 rounded-xl shadow-sm group animate-fadeIn"
                  >
                    <span className="text-sm font-bold text-cem-neutral-gray-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(index)}
                      className="text-cem-neutral-gray-300 hover:text-red-500 transition-colors"
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-6 mt-6 border-t border-cem-neutral-gray-100">
            <button
              type="button"
              onClick={() =>
                router.push(`/dashboard/admin/instructors/${instructorId}`)
              }
              className="px-8 py-4 bg-cem-neutral-gray-100 text-cem-neutral-gray-600 rounded-xl font-bold hover:bg-cem-neutral-gray-200 transition-all min-w-[140px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-10 py-4 bg-cem-primary text-white rounded-xl font-bold hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
