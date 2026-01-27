"use client";
import React from "react";
import { NewsCard } from "./NewsCard";
import { NEWS_ITEMS } from "../../constants/news.constants";

export const NewsSection: React.FC = () => {
  // Primeros dos artículos para la columna izquierda
  const leftColumnNews = NEWS_ITEMS.slice(0, 2);
  // Último artículo para la columna derecha (más grande)
  const rightColumnNews = NEWS_ITEMS[2];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-left mb-10 md:mb-12 lg:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-cem-neutral-gray-900">
            Noticias recientes
          </h2>
        </div>

        {/* Grid de Noticias - Layout de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto items-start">
          {/* Columna Izquierda - 2 cards pequeños apilados */}
          <div className="flex flex-col gap-6 md:gap-8">
            {leftColumnNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>

          {/* Columna Derecha - 1 card grande */}
          <div className="flex w-full">
            <NewsCard news={rightColumnNews} isLarge={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

