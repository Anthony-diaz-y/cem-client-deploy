"use client";

import React, { useState, useEffect } from "react";
import { StarRating } from "@shared/components";
import { ApiError } from "../../types";
import { createRating, Review, updateRating } from "../../services/reviewsAPI";

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
          token,
        );
      } else {
        // Crear nueva reseña
        result = await createRating(
          {
            courseId,
            rating,
            review: review.trim(),
          },
          token,
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
        setError(
          "No se pudo guardar la reseña. Por favor, intenta nuevamente.",
        );
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
    <form
      onSubmit={handleSubmit}
      className="bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 p-6 rounded-xl"
    >
      <h3 className="text-xl font-semibold text-cem-neutral-gray-900 mb-6">
        {existingReview ? "Editar tu reseña" : "Deja tu reseña"}
      </h3>

      <div className="mb-6">
        <label className="block mb-3 text-cem-neutral-gray-900 font-medium">
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
            <span className="text-cem-neutral-gray-600">
              {rating} {rating === 1 ? "estrella" : "estrellas"}
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="review"
          className="block mb-3 text-cem-neutral-gray-900 font-medium"
        >
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
          className="w-full px-4 py-3 bg-white text-cem-neutral-gray-900 border border-cem-neutral-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cem-primary focus:border-cem-primary resize-none"
        />
        <small className="text-cem-neutral-gray-500 text-sm mt-2 block">
          {review.length} caracteres (mínimo 10)
        </small>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || rating === 0 || !review.trim()}
        className="w-full py-3 px-4 rounded-lg bg-cem-primary text-white font-semibold hover:bg-cem-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
