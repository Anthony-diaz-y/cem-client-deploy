"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    getStudentDetails,
    updateStudent,
} from "@shared/services/admin/students";
import { Loading } from "@shared/components";
import { FiArrowLeft, FiEdit } from "react-icons/fi";

interface EditStudentProps {
    studentId: string;
    token: string;
}

/**
 * Componente para editar información de un estudiante
 * Permite modificar nombre, email, y número de contacto
 */
export default function EditStudent({
    studentId,
    token,
}: EditStudentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
    });

    // Carga los datos del estudiante desde la API
    const loadStudent = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getStudentDetails(studentId, token);
            if (data?.student) {
                setFormData({
                    name: data.student.name,
                    email: data.student.email,
                    contactNumber: data.student.contactNumber || data.student.additionalDetails?.contactNumber || "",
                });
            }
        } catch {
            // Error manejado por el servicio
        } finally {
            setLoading(false);
        }
    }, [studentId, token]);

    useEffect(() => {
        loadStudent();
    }, [loadStudent]);

    // Maneja el envío del formulario y actualiza el estudiante
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setSaving(true);
        try {
            const result = await updateStudent(
                studentId,
                {
                    name: formData.name,
                    email: formData.email,
                    contactNumber: formData.contactNumber,
                },
                token,
            );

            if (result) {
                router.push(`/dashboard/admin/students/${studentId}`);
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
                    router.push(`/dashboard/admin/students/${studentId}`)
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
                        Editar Perfil del Estudiante
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
                                placeholder="estudiante@example.com"
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
                                value={formData.contactNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); // Solo números
                                    setFormData({ ...formData, contactNumber: value });
                                }}
                                placeholder="Ej: 999000099"
                                maxLength={15}
                                className="w-full h-14 px-6 bg-[#F3F4F6] border border-cem-neutral-gray-200 rounded-xl text-sm font-semibold text-cem-neutral-gray-700 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all shadow-sm"
                            />
                            <p className="text-[11px] text-cem-neutral-gray-400 italic ml-1">
                                Ingresa solo números. Déjalo vacío para eliminar el número.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6 mt-6 border-t border-cem-neutral-gray-100">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(`/dashboard/admin/students/${studentId}`)
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
