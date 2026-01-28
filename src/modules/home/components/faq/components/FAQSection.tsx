"use client";

import React, { useState } from "react";
import { FAQItem } from "./FAQItem";
import { FAQ_ITEMS } from "../../../constants/faq.constants";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0); // Primera pregunta abierta por defecto

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900 mb-4 max-w-sm md:max-w-none mx-auto">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-cem-neutral-gray-600 max-w-2xl mx-auto">
            Resolvemos tus dudas
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-cem-neutral-gray-200 shadow-sm overflow-hidden">
            {FAQ_ITEMS.map((item, index) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

