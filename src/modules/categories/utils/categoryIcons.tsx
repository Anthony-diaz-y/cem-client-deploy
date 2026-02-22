"use client";

import React from "react";
import {
  GiMicroscope,
  GiWheat,
  GiHealthNormal,
  GiChemicalDrop,
  GiDna1,
  GiForest,
  GiShrimp,
} from "react-icons/gi";

/**
 * Renderiza el ícono de una categoría.
 * - Si hay SVG guardado en BD (string SVG), lo muestra inline con className de color heredado.
 * - Si no, genera un ícono automático según palabras clave del nombre.
 */
export function resolveCategoryIcon(
  categoryName: string,
  savedIconSvg?: string | null,
): React.ReactNode {
  // Si hay SVG guardado, renderizarlo inline
  if (savedIconSvg && savedIconSvg.toLowerCase().includes("<svg")) {
    return (
      <span
        className="inline-flex items-center justify-center w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current [&_path]:fill-current [&_circle]:fill-current [&_rect]:fill-current"
        dangerouslySetInnerHTML={{ __html: savedIconSvg }}
      />
    );
  }

  // Fallback: generar automáticamente por palabras clave
  const name = categoryName.toLowerCase();
  if (
    name.includes("biología") ||
    name.includes("biotecnología") ||
    name.includes("bioprocesos")
  )
    return <GiMicroscope />;
  if (
    name.includes("agro") ||
    name.includes("veterinaria") ||
    name.includes("carrera") ||
    name.includes("animal")
  )
    return <GiWheat />;
  if (name.includes("salud")) return <GiHealthNormal />;
  if (name.includes("alimento") || name.includes("inocuidad"))
    return <GiChemicalDrop />;
  if (
    name.includes("ambiental") ||
    name.includes("sostenibilidad") ||
    name.includes("forestal")
  )
    return <GiForest />;
  if (
    name.includes("acuícola") ||
    name.includes("pesca") ||
    name.includes("marino")
  )
    return <GiShrimp />;
  if (name.includes("química") || name.includes("quimica"))
    return <GiChemicalDrop />;
  if (
    name.includes("genética") ||
    name.includes("genetica") ||
    name.includes("adn")
  )
    return <GiDna1 />;

  return <GiMicroscope />;
}
