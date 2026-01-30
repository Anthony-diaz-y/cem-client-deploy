"use client";

import React from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import guacamayo from "@shared/assets/hero/guacamayo.webp";

const FloatingWhatsApp = () => {
  return (
    <div className="fixed right-0 bottom-20 lg:bottom-24 z-20 flex flex-col items-center">
      {/* Burbuja de diálogo con WhatsApp - Justo encima del guacamayo */}
      <div className="relative mb-2">
        {/* Burbuja de diálogo */}
        <a
          href="https://wa.me/51983885114"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-105"
          style={{
            width: "45px",
            height: "45px",
            padding: "8px",
          }}
          aria-label="Contactar por WhatsApp"
        >
          <FaWhatsapp className="text-[#25D366]" size={22} />
        </a>

        {/* Puntero de la burbuja apuntando hacia abajo */}
        <div
          className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "10px solid white",
            filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
          }}
        />

        {/* Línea conectora desde la burbuja al guacamayo */}
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2"
          style={{
            width: "2px",
            height: "12px",
            backgroundColor: "#C4EBDF",
            marginTop: "8px",
            borderRadius: "1px",
          }}
        />
      </div>

      {/* Guacamayo decorativo */}
      <div className="relative w-16 h-16 lg:w-20 lg:h-20">
        <Image
          src={guacamayo}
          alt="Guacamayo CEM"
          fill
          className="object-contain drop-shadow-lg"
          priority={false}
        />
      </div>
    </div>
  );
};

export default FloatingWhatsApp;
