"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UsuarioInscrito } from "@/types/scheduledClasses.types";
import { obtenerUsuariosInscritos } from "@/shared/services/scheduledClasses/scheduledClassesAPI";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface EnrolledUsersListProps {
  classId: string;
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

// Modal con lista de usuarios inscritos (Admin/Instructor)
export default function EnrolledUsersList({ classId, token, isOpen, onClose }: EnrolledUsersListProps) {
  const [usuarios, setUsuarios] = useState<UsuarioInscrito[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const cargarUsuarios = async () => {
      setCargando(true);
      try {
        const respuesta = await obtenerUsuariosInscritos(classId, token);
        setUsuarios(respuesta.data.enrolledUsers);
      } catch (error) {
        toast.error('Error al cargar usuarios inscritos');
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, [isOpen, classId, token]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Usuarios Inscritos</h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-blue-100 mt-1">Total: {usuarios.length} personas</p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {cargando ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : usuarios.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay usuarios inscritos aún</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {usuarios.map((usuario) => (
                      <div
                        key={usuario.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {usuario.image ? (
                            <Image
                              src={usuario.image}
                              alt={`${usuario.firstName} ${usuario.lastName}`}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {usuario.firstName.charAt(0)}{usuario.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {usuario.firstName} {usuario.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{usuario.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
