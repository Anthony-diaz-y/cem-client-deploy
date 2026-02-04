"use client";

import React, { useState } from "react";
import {
  CourseReview,
  createReviewAdmin,
  updateReviewAdmin,
  deleteReviewAdmin,
} from "@shared/services/adminAPI";
import { Img, RatingStars, ConfirmationModal } from "@shared/components";
import { FiStar, FiUser, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

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
          <h2 className="text-2xl font-bold text-richblack-5">
            Reseñas del Curso
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            <FiPlus className="w-4 h-4" />
            Agregar Reseña
          </button>
        </div>
        <div className="bg-richblack-900/50 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-richblack-700 flex items-center justify-center">
            <FiStar className="w-8 h-8 text-richblack-400" />
          </div>
          <p className="text-richblack-400">
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
        <h2 className="text-2xl font-bold text-richblack-5">
          Reseñas del Curso
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-blue-500/20"
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
            className="bg-richblack-900/50 rounded-lg border border-richblack-700 p-6 hover:border-richblack-600 transition-colors"
          >
            <div className="flex gap-4">
              {/* Avatar del usuario */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-richblack-700 border border-richblack-600">
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
                    <h4 className="font-semibold text-richblack-5 mb-1">
                      {review.user.name}
                    </h4>
                    <p className="text-xs text-richblack-400">
                      {review.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-yellow-50">
                        {review.rating}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(review)}
                        className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        title="Editar reseña"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(review.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
                <p className="text-richblack-300 mb-3 leading-relaxed">
                  {review.review}
                </p>

                {/* Fecha */}
                <div className="flex items-center gap-2 text-xs text-richblack-500">
                  <span>Publicado el {formatDate(review.createdAt)}</span>
                  {review.updatedAt !== review.createdAt && (
                    <span className="text-richblack-600">
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
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
          <div className="w-11/12 max-w-md rounded-lg border border-richblack-400 bg-richblack-800 p-6">
            <h3 className="text-2xl font-bold text-richblack-5 mb-4">
              Agregar Reseña
            </h3>
            <p className="text-sm text-richblack-400 mb-4">
              La reseña aparecerá como creada por ti (el administrador actual).
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-richblack-300 mb-2">
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
                  className="w-full px-4 py-2.5 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-richblack-300 mb-2">
                  Reseña
                </label>
                <textarea
                  value={newReview.review}
                  onChange={(e) =>
                    setNewReview({ ...newReview, review: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                  className="px-4 py-2 bg-richblack-700 hover:bg-richblack-600 text-richblack-300 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateReview}
                  disabled={!newReview.review.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-richblack-700 disabled:text-richblack-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
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
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
          <div className="w-11/12 max-w-md rounded-lg border border-richblack-400 bg-richblack-800 p-6">
            <h3 className="text-2xl font-bold text-richblack-5 mb-4">
              Editar Reseña
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-richblack-300 mb-2">
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
                  className="w-full px-4 py-2.5 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-richblack-300 mb-2">
                  Reseña
                </label>
                <textarea
                  value={editReview.review}
                  onChange={(e) =>
                    setEditReview({ ...editReview, review: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-richblack-900 border border-richblack-700 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                  className="px-4 py-2 bg-richblack-700 hover:bg-richblack-600 text-richblack-300 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdateReview}
                  disabled={!editReview.review.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-richblack-700 disabled:text-richblack-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
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
