"use client";
import React from "react";
import Image, { type StaticImageData } from "next/image";
import type { NewsItem } from "../../constants/news.constants";

interface NewsCardProps {
  news: NewsItem;
  isLarge?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, isLarge = false }) => {
  if (!isLarge) {
    return (
      <article className="flex flex-row" style={{ width: '568px', height: '200px' }}>
        {/* Imagen - lado izquierdo: 200px alto x 320px ancho */}
        <div className="relative flex-shrink-0 overflow-hidden rounded-lg" style={{ width: '320px', height: '200px' }}>
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>

        {/* Contenido - lado derecho: 248px ancho */}
        <div className="p-4 md:p-5 flex flex-col justify-between" style={{ width: '248px' }}>
          {/* Fecha */}
          <p className="text-xs md:text-sm text-cem-neutral-gray-500 mb-2">
            {news.date}
          </p>

          {/* Título */}
          <h3 className="font-bold text-cem-neutral-gray-900 mb-2 leading-tight text-base md:text-lg">
            {news.title}
          </h3>

          {/* Descripción */}
          <p className="text-cem-neutral-gray-700 mb-3 text-sm flex-1">
            {news.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {news.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: tag.color,
                  color: tag.textColor || '#1F2937'
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

  return (
    <article className="flex flex-col" style={{ width: '592px', height: '432px' }}>
      <div className="relative flex-shrink-0 overflow-hidden rounded-lg" style={{ width: '592px', height: '280px' }}>
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover"
          sizes="592px"
        />
      </div>

      <div className="p-5 md:p-6 flex flex-col overflow-hidden" style={{ height: '152px' }}>
        {/* Fecha */}
        <p className="text-xs md:text-sm text-cem-neutral-gray-500 mb-2">
          {news.date}
        </p>

        {/* Título */}
        <h3 className="font-bold text-cem-neutral-gray-900 mb-2.5 leading-tight text-xl md:text-2xl">
          {news.title}
        </h3>

        {/* Descripción */}
        <p className="text-cem-neutral-gray-700 mb-4 text-base line-clamp-2">
          {news.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium"
              style={{ 
                backgroundColor: tag.color,
                color: tag.textColor || '#1F2937'
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

