"use client";

import React from "react";
import Image from "next/image";
import type { NewsItem } from "../../../constants/news.constants";

interface NewsCardProps {
  news: NewsItem;
  isLarge?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, isLarge = false }) => {
  // Estilo base de tarjeta "tipo Valor/Curso" - Se aplica en móvil y tablets
  // Limitamos el ancho con max-w-sm para que no se vean enormes en mobile
  const baseCardClasses =
    "flex flex-col bg-white rounded-xl border border-cem-neutral-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 w-full h-full group max-w-sm mx-auto xl:max-w-none xl:mx-0";

  if (!isLarge) {
    return (
      <article
        className={`${baseCardClasses} xl:flex-row xl:h-[220px] xl:items-stretch`}
      >
        {/* Imagen */}
        <div className="relative flex-shrink-0 overflow-hidden w-full aspect-[16/9] xl:w-[320px] xl:h-[220px]">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1280px) 100vw, 320px"
          />
        </div>

        {/* Contenido */}
        <div className="p-5 xl:p-6 flex flex-col justify-center flex-1">
          <p className="text-xs md:text-sm text-cem-neutral-gray-500 mb-2">
            {news.date}
          </p>

          <h3 className="font-bold text-cem-neutral-gray-900 mb-2 leading-tight text-xl xl:text-lg group-hover:text-cem-primary transition-colors line-clamp-2">
            {news.title}
          </h3>

          <p className="text-cem-neutral-gray-700 mb-4 text-sm xl:text-sm line-clamp-2 md:line-clamp-3">
            {news.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {news.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-[10px] md:text-xs font-medium"
                style={{
                  backgroundColor: tag.color,
                  color: tag.textColor || "#1F2937",
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  }

  // Versión "Grande" (isLarge)
  return (
    <article className={`${baseCardClasses} xl:h-[472px]`}>
      {/* Imagen */}
      <div className="relative flex-shrink-0 overflow-hidden w-full aspect-[16/9] xl:h-[280px]">
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1280px) 100vw, 600px"
        />
      </div>

      {/* Contenido */}
      <div className="p-5 xl:p-8 flex flex-col flex-1">
        <p className="text-xs md:text-sm text-cem-neutral-gray-500 mb-2">
          {news.date}
        </p>

        <h3 className="font-bold text-cem-neutral-gray-900 mb-3 leading-tight text-xl md:text-2xl group-hover:text-cem-primary transition-colors line-clamp-2">
          {news.title}
        </h3>

        <p className="text-cem-neutral-gray-700 mb-6 text-base line-clamp-3">
          {news.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-[10px] md:text-xs font-medium"
              style={{
                backgroundColor: tag.color,
                color: tag.textColor || "#1F2937",
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

