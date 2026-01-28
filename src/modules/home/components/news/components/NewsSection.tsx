"use client";

import React from "react";
import { NewsCard } from "./NewsCard";
import { NEWS_ITEMS } from "../../../constants/news.constants";

export const NewsSection: React.FC = () => {
  // Primeros dos artículos para la columna izquierda
  const leftColumnNews = NEWS_ITEMS.slice(0, 2);
  // Último artículo para la columna derecha (más grande)
  const rightColumnNews = NEWS_ITEMS[2];

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#0B4653] text-[20px] font-bold inline-block mb-4">
            Actualidad
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900 mb-4 max-w-sm md:max-w-none mx-auto">
            Noticias recientes
          </h2>
        </div>

        {/* Grid Simétrico y con espacio para Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto items-start justify-center py-10">
          {/* Columna Izquierda - Apiladas */}
          <div className="flex flex-col gap-8 md:gap-10">
            {leftColumnNews.map((news) => (
              <div key={news.id} className="w-full">
                <NewsCard news={news} />
              </div>
            ))}
          </div>

          {/* Columna Derecha - Gran card */}
          <div className="w-full">
            <NewsCard news={rightColumnNews} isLarge={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

