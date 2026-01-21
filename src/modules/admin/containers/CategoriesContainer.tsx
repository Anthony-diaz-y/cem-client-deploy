"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@shared/store/hooks";
import CategoriesTable from "../components/category/CategoriesTable";
import CreateCategoryModal from "../components/category/CreateCategoryModal";
import { getAllCategories, Category } from "@shared/services/adminAPI";
import { Loading } from "@shared/components";

export default function CategoriesContainer() {
  const { token } = useAppSelector((state) => state.auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);

  const fetchCategories = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllCategories(token);
      setCategories(data || []);
    } catch (error) {
      // Error manejado por el servicio
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-richblack-5">
          Gestión de Categorías
        </h1>
        <p className="text-richblack-400">
          Administra las categorías del sistema. Visualiza, crea y elimina categorías.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsCreateCategoryModalOpen(true)}
            className="flex items-center gap-x-2 rounded-lg bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
          >
            <span className="text-lg">+</span> Crear Categoría
          </button>
        </div>
      </div>

      <CategoriesTable
        categories={categories}
        token={token}
        onUpdate={(updatedCategories?: Category[]) => {
          if (updatedCategories) {
            // Actualizar con la lista recibida del backend
            setCategories(updatedCategories);
          } else {
            // Recargar desde el servidor si no se proporciona lista
            fetchCategories();
          }
        }}
      />

      {isCreateCategoryModalOpen && token && (
        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={() => {
            fetchCategories();
          }}
          token={token}
        />
      )}
    </div>
  );
}

