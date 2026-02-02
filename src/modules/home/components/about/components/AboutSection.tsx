"use client";

import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-[800px] mx-auto text-center">
          {/* Header */}
          <div className="mb-10 md:mb-14">
            <p className="text-[#0B4653] text-[20px] font-bold inline-block mb-3">
              Somos CEM
            </p>
            <h2 className="text-4xl lg:text-[48px] font-bold text-cem-neutral-gray-900 leading-tight">
              Conoce el impacto de CEM
            </h2>
          </div>

          {/* Video Container */}
          <div className="relative w-[90%] md:w-full aspect-video mx-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group">
            {/* YouTube Embed */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Video de prueba
              title="Conoce el impacto de CEM"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>

            {/* Overlay decorativo (opcional, para mejorar el look inicial si fuera necesario) */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
