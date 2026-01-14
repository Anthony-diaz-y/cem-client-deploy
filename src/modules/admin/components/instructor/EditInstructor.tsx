"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getInstructorDetails, updateInstructor, UpdateInstructorData } from "@shared/services/adminAPI";
import Loading from "@shared/components/Loading";
import { FiArrowLeft } from "react-icons/fi";

interface EditInstructorProps {
  instructorId: string;
  token: string;
}

/**
 * Componente para editar información de un instructor
 * Permite modificar nombre, email, número de contacto y estado de aprobación
 */
export default function EditInstructor({ instructorId, token }: EditInstructorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateInstructorData>({
    firstName: "",
    lastName: "",
    email: "",
    approved: false,
    contactNumber: null,
  });
  
  // Estado local para el input del teléfono (siempre string)
  const [contactNumberInput, setContactNumberInput] = useState<string>("");

  // Carga los datos del instructor desde la API
  const loadInstructor = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getInstructorDetails(instructorId, token);
      if (data?.instructor) {
        const contactNumber = data.instructor.profile?.contactNumber;
        setFormData({
          firstName: data.instructor.firstName,
          lastName: data.instructor.lastName,
          email: data.instructor.email,
          approved: data.instructor.approved || false,
          contactNumber: contactNumber || null,
        });
        // Actualizar el input del teléfono (siempre string para el input)
        setContactNumberInput(contactNumber ? String(contactNumber) : "");
      }
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setLoading(false);
    }
  }, [instructorId, token]);

  useEffect(() => {
    loadInstructor();
  }, [loadInstructor]);

  // Maneja el envío del formulario y actualiza el instructor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      // Construir el valor del número de contacto
      const contactNumberValue = contactNumberInput.trim() === "" 
        ? null 
        : (contactNumberInput.trim() ? parseInt(contactNumberInput.trim(), 10) : null);
      
      // Validar que el número sea válido
      const finalContactNumber = (contactNumberValue !== null && !isNaN(contactNumberValue)) 
        ? contactNumberValue 
        : null;
      
      // Construir el objeto de actualización explícitamente
      const updates: UpdateInstructorData = {};
      
      if (formData.firstName) updates.firstName = formData.firstName;
      if (formData.lastName) updates.lastName = formData.lastName;
      if (formData.email) updates.email = formData.email;
      if (formData.approved !== undefined) updates.approved = formData.approved;
      
      // Incluir contactNumber incluso si es null (para eliminar el número)
      updates.contactNumber = finalContactNumber;
      
      const result = await updateInstructor(instructorId, updates, token);
      
      if (result) {
        router.push(`/dashboard/admin/instructors/${instructorId}`);
      }
    } catch (error) {
      // Error manejado por el servicio
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <button
        onClick={() => router.push(`/dashboard/admin/instructors/${instructorId}`)}
        className="flex items-center gap-2 text-richblack-300 hover:text-richblack-5 transition-colors"
      >
        <FiArrowLeft size={20} />
        <span>Volver a detalles</span>
      </button>

      <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-6">
        <h1 className="text-3xl font-bold text-richblack-5 mb-6">Editar Instructor</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-richblack-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-richblack-300 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-richblack-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-richblack-300 mb-2">
              Número de Contacto
              <span className="text-richblack-500 text-xs ml-2">(Opcional)</span>
            </label>
            <input
              type="tel"
              value={contactNumberInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Solo números
                setContactNumberInput(value);
                // Actualizar formData para mantener sincronización
                setFormData({
                  ...formData,
                  contactNumber: value === "" ? null : value,
                });
              }}
              placeholder="Ej: 1234567890"
              maxLength={15}
              className="w-full px-4 py-3 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-richblack-400 mt-1">
              Ingresa solo números. Déjalo vacío para eliminar el número de contacto.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.approved}
                onChange={(e) =>
                  setFormData({ ...formData, approved: e.target.checked })
                }
                className="w-5 h-5 text-yellow-500 bg-richblack-900 border-richblack-700 rounded focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-richblack-300">
                Aprobado
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/admin/instructors/${instructorId}`)}
              className="px-6 py-3 bg-richblack-700 text-richblack-300 rounded-lg font-medium hover:bg-richblack-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

