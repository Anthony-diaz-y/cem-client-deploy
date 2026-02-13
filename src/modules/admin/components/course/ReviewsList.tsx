"use client";

import React, { useState } from "react";
import {
  CourseReview,
  createReviewAdmin,
  updateReviewAdmin,
  deleteReviewAdmin,
} from "@shared/services/adminAPI";
import { Img, RatingStars, ConfirmationModal } from "@shared/components";
import { FiStar, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

interface ReviewsListProps {
  reviews: CourseReview[];
  courseId: string;
  token: string;
  onUpdate?: () => void;
}

export default function ReviewsList({
  reviews,
  courseId,
  token,
  onUpdate,
}: ReviewsListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReview, setEditingReview] = useState<CourseReview | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Estados para el formulario de crear
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: "",
  });

  // Estados para el formulario de editar
  const [editReview, setEditReview] = useState({
    rating: 5,
    review: "",
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Ordenar por fecha (más recientes primero)
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const handleCreateReview = async () => {
    if (!newReview.review.trim()) {
      return;
    }

    const result = await createReviewAdmin(
      {
        courseId,
        rating: newReview.rating,
        review: newReview.review,
      },
      token,
    );

    if (result) {
      setShowCreateModal(false);
      setNewReview({ rating: 5, review: "" });
      onUpdate?.();
    }
  };

  const handleUpdateReview = async () => {
    if (!editingReview || !editReview.review.trim()) {
      return;
    }

    const result = await updateReviewAdmin(
      editingReview.id,
      {
        rating: editReview.rating,
        review: editReview.review,
      },
      token,
    );

    if (result) {
      setEditingReview(null);
      setEditReview({ rating: 5, review: "" });
      onUpdate?.();
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const success = await deleteReviewAdmin(reviewId, token);
    if (success) {
      setDeleteConfirm(null);
      onUpdate?.();
    }
  };

  const openEditModal = (review: CourseReview) => {
    setEditingReview(review);
    setEditReview({
      rating: review.rating,
      review: review.review,
    });
  };

  if (reviews.length === 0 && !showCreateModal && !editingReview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-medium text-[#1E293B]">
            Reseñas del Curso
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cem-primary hover:bg-cem-primary-dark text-white rounded-lg transition-all duration-200 font-medium shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            Agregar Reseña
          </button>
        </div>
        <div className="bg-cem-neutral-gray-50 rounded-lg p-8 text-center border border-cem-neutral-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-50 flex items-center justify-center shadow-sm">
            <FiStar className="w-8 h-8 text-cyan-600" />
          </div>
          <p className="text-cem-neutral-gray-500 font-medium">
            No hay reseñas para este curso aún
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con botón Agregar */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-medium text-[#1E293B]">
          Reseñas del Curso
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cem-primary hover:bg-cem-primary-dark text-white rounded-lg transition-all duration-200 font-medium shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          Agregar Reseña
        </button>
      </div>

      {/* Lista de Reseñas */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-cem-neutral-gray-100 p-6 hover:border-cem-primary/30 transition-colors shadow-sm"
          >
            <div className="flex gap-4">
              {/* Avatar del usuario */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-cem-neutral-gray-50 border border-cem-neutral-gray-100 shadow-sm">
                  <Img
                    src={review.user.image}
                    alt={`${review.user.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Contenido de la reseña */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-[#1E293B] mb-1">
                      {review.user.name}
                    </h4>
                    <p className="text-xs font-medium text-cem-neutral-gray-400">
                      {review.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-lg">
                      <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium text-amber-600">
                        {review.rating}
                      </span>
                    </div>
                    <div className="flex gap-1 ml-4 pt-1">
                      <button
                        onClick={() => openEditModal(review)}
                        className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Editar reseña"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(review.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar reseña"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rating visual */}
                <div className="mb-3">
                  <RatingStars Review_Count={review.rating} />
                </div>

                {/* Texto de la reseña */}
                <p className="text-cem-neutral-gray-500 mb-3 leading-relaxed">
                  {review.review}
                </p>

                {/* Fecha */}
                <div className="flex items-center gap-2 text-xs font-medium text-cem-neutral-gray-400">
                  <span>Publicado el {formatDate(review.createdAt)}</span>
                  {review.updatedAt !== review.createdAt && (
                    <span className="text-cem-neutral-gray-300 font-medium italic">
                      • Actualizado el {formatDate(review.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Crear Reseña */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg border border-cem-neutral-gray-100 bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
              Agregar Reseña
            </h3>
            <p className="text-sm font-medium text-cem-neutral-gray-400 mb-6 leading-relaxed">
              La reseña aparecerá como creada por ti (el administrador actual).
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-cem-neutral-gray-500 mb-2">
                  Calificación
                </label>
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-cem-primary transition-all cursor-pointer"
                  required
                >
                  <option value={1}>1 estrella</option>
                  <option value={2}>2 estrellas</option>
                  <option value={3}>3 estrellas</option>
                  <option value={4}>4 estrellas</option>
                  <option value={5}>5 estrellas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-cem-neutral-gray-500 mb-2">
                  Reseña
                </label>
                <textarea
                  value={newReview.review}
                  onChange={(e) =>
                    setNewReview({ ...newReview, review: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-cem-primary resize-none transition-all"
                  rows={4}
                  required
                  minLength={1}
                  placeholder="Escribe la reseña..."
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewReview({ rating: 5, review: "" });
                  }}
                  className="px-4 py-2 bg-cem-neutral-gray-100 hover:bg-cem-neutral-gray-200 text-cem-neutral-gray-700 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateReview}
                  disabled={!newReview.review.trim()}
                  className="px-4 py-2 bg-cem-primary hover:bg-cem-primary-dark disabled:opacity-50 disabled:bg-cem-neutral-gray-200 disabled:text-cem-neutral-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Reseña */}
      {editingReview && (
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg border border-cem-neutral-gray-100 bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-6">
              Editar Reseña
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-cem-neutral-gray-500 mb-2">
                  Calificación
                </label>
                <select
                  value={editReview.rating}
                  onChange={(e) =>
                    setEditReview({
                      ...editReview,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-cem-primary transition-all cursor-pointer"
                  required
                >
                  <option value={1}>1 estrella</option>
                  <option value={2}>2 estrellas</option>
                  <option value={3}>3 estrellas</option>
                  <option value={4}>4 estrellas</option>
                  <option value={5}>5 estrellas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-cem-neutral-gray-500 mb-2">
                  Reseña
                </label>
                <textarea
                  value={editReview.review}
                  onChange={(e) =>
                    setEditReview({ ...editReview, review: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-lg text-[#1E293B] font-medium focus:outline-none focus:ring-2 focus:ring-cem-primary resize-none transition-all"
                  rows={4}
                  required
                  minLength={1}
                  placeholder="Escribe la reseña..."
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setEditReview({ rating: 5, review: "" });
                  }}
                  className="px-4 py-2 bg-cem-neutral-gray-100 hover:bg-cem-neutral-gray-200 text-cem-neutral-gray-700 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdateReview}
                  disabled={!editReview.review.trim()}
                  className="px-4 py-2 bg-cem-primary hover:bg-cem-primary-dark disabled:opacity-50 disabled:bg-cem-neutral-gray-200 disabled:text-cem-neutral-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
      {deleteConfirm && (
        <ConfirmationModal
          modalData={{
            text1: "¿Estás seguro de que deseas eliminar esta reseña?",
            text2:
              "Esta acción no se puede deshacer. La reseña será eliminada permanentemente.",
            btn1Text: "Eliminar",
            btn2Text: "Cancelar",
            btn1Handler: () => handleDeleteReview(deleteConfirm),
            btn2Handler: () => setDeleteConfirm(null),
          }}
        />
      )}
    </div>
  );
}
