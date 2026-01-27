"use client";
import React from "react";
import type { FAQItem as FAQItemType } from "../../constants/faq.constants";

interface FAQItemProps {
  item: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
}

export const FAQItem: React.FC<FAQItemProps> = ({ item, isOpen, onToggle }) => {
  return (
    <div className="border-b border-cem-neutral-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 md:py-6 px-4 md:px-6 flex items-center justify-between text-left hover:bg-cem-neutral-gray-50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        <div className="flex items-center gap-4 flex-1">
          <span className={`text-xl md:text-2xl font-medium flex-shrink-0 transition-colors duration-300 ${
            isOpen ? "text-cem-primary" : "text-cem-neutral-gray-600"
          }`}>
            {isOpen ? "−" : "+"}
          </span>
          <h3 className={`text-base md:text-lg font-semibold flex-1 transition-colors duration-300 ${
            isOpen ? "text-cem-primary" : "text-cem-neutral-gray-900"
          }`}>
            {item.question}
          </h3>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isOpen 
            ? "bg-cem-primary text-white" 
            : "bg-cem-neutral-gray-200 text-cem-neutral-gray-600"
        }`}>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      <div
        id={`faq-answer-${item.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 md:pb-6 px-4 md:px-6 pl-12 md:pl-14">
          <p className="text-sm md:text-base text-cem-neutral-gray-600 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

