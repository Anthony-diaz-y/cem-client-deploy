"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiUserPlus, FiUser, FiMail, FiPhone, FiLock, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { createInstructor } from "@shared/services/adminAPI";
import { CEMModalLayout } from "@shared/components";

interface CreateInstructorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
}

/**
 * Modal para crear un nuevo instructor manualmente (Admin)
 */
export default function CreateInstructorModal({
    isOpen,
    onClose,
    onSuccess,
    token,
}: CreateInstructorModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    // Estado para especialidades
    const [specialtyInput, setSpecialtyInput] = useState("");
    const [specialtiesList, setSpecialtiesList] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSpecialty = () => {
        if (specialtyInput.trim() && !specialtiesList.includes(specialtyInput.trim())) {
            setSpecialtiesList([...specialtiesList, specialtyInput.trim()]);
            setSpecialtyInput("");
        }
    };

    const handleRemoveSpecialty = (index: number) => {
        setSpecialtiesList(specialtiesList.filter((_, i) => i !== index));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error("El nombre y el email son obligatorios");
            return;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Por favor, ingresa un email válido");
            return;
        }

        setLoading(true);
        try {
            const success = await createInstructor(
                {
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    contactNumber: formData.contactNumber.trim() || undefined,
                    password: formData.password.trim() || undefined,
                    professional_title: specialtiesList.length > 0 ? specialtiesList.join(", ") : undefined,
                },
                token
            );

            if (success) {
                // Reset states
                setFormData({
                    name: "",
                    email: "",
                    contactNumber: "",
                    password: "",
                });
                setSpecialtiesList([]);
                setSpecialtyInput("");

                onSuccess();
                onClose();
            }
        } catch {
            // Error manejado por el servicio
        } finally {
            setLoading(false);
        }
    };

    const inputClasses =
        "w-full h-14 pl-12 pr-4 bg-cem-neutral-gray-50 border border-cem-neutral-gray-100 rounded-xl text-cem-neutral-gray-900 placeholder-cem-neutral-gray-400 focus:outline-none focus:ring-4 focus:ring-cem-primary/5 focus:border-cem-primary transition-all font-medium";
    const labelClasses = "block text-sm font-bold text-cem-neutral-gray-600 mb-2 ml-1";
    const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-xl text-cem-neutral-gray-300 group-focus-within:text-cem-primary transition-colors";

    return (
        <CEMModalLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Registrar Nuevo Instructor"
            icon={<FiUserPlus className="text-2xl text-cem-primary" />}
            loading={loading}
            footer={
                <div className="flex gap-4 w-full justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-8 py-4 bg-cem-neutral-gray-100 text-cem-neutral-gray-600 rounded-xl font-bold hover:bg-cem-neutral-gray-200 transition-all disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className="px-8 py-4 bg-cem-primary text-white rounded-xl font-bold hover:bg-cem-primary-dark transition-all shadow-lg shadow-cem-primary/20 disabled:opacity-50 min-w-[180px]"
                    >
                        {loading ? "Registrando..." : "Registrar Instructor"}
                    </button>
                </div>
            }
        >
            <form onSubmit={onSubmit} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre Completo */}
                    <div className="space-y-1">
                        <label htmlFor="name" className={labelClasses}>
                            Nombre Completo
                        </label>
                        <div className="relative group">
                            <FiUser className={iconClasses} />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej. Juan Pérez"
                                className={inputClasses}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label htmlFor="email" className={labelClasses}>
                            Correo Electrónico
                        </label>
                        <div className="relative group">
                            <FiMail className={iconClasses} />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ejemplo@cem.com"
                                className={inputClasses}
                                required
                            />
                        </div>
                    </div>

                    {/* Número de Contacto */}
                    <div className="space-y-1">
                        <label htmlFor="contactNumber" className={labelClasses}>
                            Número de Contacto (Opcional)
                        </label>
                        <div className="relative group">
                            <FiPhone className={iconClasses} />
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Ej. 999888777"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-1">
                        <label htmlFor="password" className={labelClasses}>
                            Contraseña Temporal (Opcional)
                        </label>
                        <div className="relative group">
                            <FiLock className={iconClasses} />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Dejar vacío para usar defecto"
                                className={inputClasses}
                            />
                        </div>
                        <p className="text-[10px] text-cem-neutral-gray-400 mt-1 ml-1 px-1">
                            * Si se deja vacío, la contraseña por defecto será: <b>Instructor123!</b>
                        </p>
                    </div>

                    {/* Experto en (Especialidades) */}
                    <div className="md:col-span-2 pt-4 border-t border-cem-neutral-gray-50 space-y-4">
                        <div className="space-y-1">
                            <label className={labelClasses}>
                                Experto en (Especialidades)
                            </label>
                            <div className="flex gap-3">
                                <div className="relative group flex-1">
                                    <FiPlus className={iconClasses} />
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
                                        placeholder="Ej. Biología, Finanzas, UI/UX..."
                                        className={inputClasses}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSpecialty}
                                    className="px-6 h-14 bg-cem-primary/10 text-cem-primary rounded-xl font-bold hover:bg-cem-primary hover:text-white transition-all flex items-center gap-2"
                                >
                                    <FiPlus size={20} />
                                    Agregar
                                </button>
                            </div>
                        </div>

                        {specialtiesList.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {specialtiesList.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-cem-neutral-gray-50 border border-cem-neutral-gray-100 rounded-lg group animate-fadeIn"
                                    >
                                        <span className="text-xs font-bold text-cem-neutral-gray-700">{item}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpecialty(index)}
                                            className="text-cem-neutral-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <RiDeleteBin6Line size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </CEMModalLayout>
    );
}
