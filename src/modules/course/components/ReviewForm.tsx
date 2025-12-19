"use client";

import React, { useState, useEffect } from "react";
import StarRating from "@shared/components/StarRating";
import { createRating, updateRating, type Review } from "../services/reviewsAPI";
import type { ApiError } from "../types";

interface ReviewFormProps {
  courseId: string;
  existingReview?: Review | null;
  onSuccess: (review: Review) => void;
  token: string;
}

/**
 * ReviewForm - Formulario para crear o editar reseñas
 */
const ReviewForm: React.FC<ReviewFormProps> = ({
  courseId,
  existingReview,
  onSuccess,
  token,
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [review, setReview] = useState(existingReview?.review || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReview(existingReview.review);
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (rating === 0) {
      setError("Por favor, selecciona una calificación con estrellas");
      return;
    }

    if (!review.trim()) {
      setError("Por favor, escribe una reseña");
      return;
    }

    if (review.trim().length < 10) {
      setError("La reseña debe tener al menos 10 caracteres");
      return;
    }

    setLoading(true);

    try {
      let result: Review | null = null;

      if (existingReview) {
        // Actualizar reseña existente
        result = await updateRating(
          {
            ratingId: existingReview.id,
            rating,
            review: review.trim(),
          },
          token
        );
      } else {
        // Crear nueva reseña
        result = await createRating(
          {
            courseId,
            rating,
            review: review.trim(),
          },
          token
        );
      }

      if (result) {
        onSuccess(result);
        if (!existingReview) {
          // Limpiar formulario si es nueva reseña
          setRating(0);
          setReview("");
        }
      } else {
        setError("No se pudo guardar la reseña. Por favor, intenta nuevamente.");
      }
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Error al guardar la reseña. Por favor, intenta nuevamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-richblack-700 p-6 rounded-2xl">
      <h3 className="text-2xl font-semibold text-richblack-5 mb-6">
        {existingReview ? "Editar tu reseña" : "Deja tu reseña"}
      </h3>

      <div className="mb-6">
        <label className="block mb-3 text-richblack-5 font-medium">
          Calificación con estrellas *
        </label>
        <div className="flex items-center gap-4">
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            readonly={false}
            starSize={28}
          />
          {rating > 0 && (
            <span className="text-richblack-200">
              {rating} {rating === 1 ? "estrella" : "estrellas"}
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="review" className="block mb-3 text-richblack-5 font-medium">
          Tu reseña *
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Comparte tu experiencia con este curso..."
          rows={5}
          minLength={10}
          required
          className="w-full px-4 py-3 bg-richblack-800 text-richblack-5 border border-richblack-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-50 resize-none"
        />
        <small className="text-richblack-400 text-sm mt-2 block">
          {review.length} caracteres (mínimo 10)
        </small>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || rating === 0 || !review.trim()}
        className="yellowButton w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Guardando..."
          : existingReview
          ? "Actualizar reseña"
          : "Publicar reseña"}
      </button>
    </form>
  );
};

export default ReviewForm;

