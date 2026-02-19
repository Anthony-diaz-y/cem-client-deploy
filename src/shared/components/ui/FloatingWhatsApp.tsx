"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed right-6 bottom-20 lg:bottom-24 z-50 flex flex-col items-center group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href="https://wa.me/51983885114"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative flex flex-col items-center"
      >
        {/* BURBUJA DE WHATSAPP: Aparece y rebota sutilmente */}
        <motion.div
          className="relative mb-2"
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex items-center justify-center">
            <FaWhatsapp className="text-[#25D366] text-2xl" />
          </div>
          {/* Triangulito de la burbuja */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </motion.div>

        {/* CONTENEDOR GUACAMAYO */}
        <div className="relative w-[89px] h-[150px] transition-transform duration-500 group-hover:scale-105">
          <Image
            src="/cem-whatsapp.svg"
            alt="WhatsApp CEM"
            width={89}
            height={150}
            className="object-contain"
            priority
          />

          {/* EL GUIÑO: Posición Calibrada */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  top: "26px",
                  left: "31px",
                  width: "12px",
                  height: "17px",
                }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-[#02819E] rounded-full w-full h-full shadow-inner"
                  style={{
                    borderBottom: "1.5px solid rgba(0,0,0,0.3)"
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
