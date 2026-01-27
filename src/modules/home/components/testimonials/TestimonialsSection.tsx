"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "../../constants/testimonials.constants";

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentTestimonial = TESTIMONIALS[currentIndex];

  // Auto-play carousel con transición suave
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
        setIsTransitioning(false);
      }, 300); // Duración de la transición fade out
    }, 8000); // Cambia cada 8 segundos

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <section className="w-full py-16 md:py-20 relative" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm md:text-base font-medium text-cem-primary mb-2">
            Testimonios
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cem-neutral-gray-900">
            Nuestra comunidad habla
          </h2>
        </div>

        {/* Testimonial Content */}
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Quote */}
            <div className="mb-10">
              <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-cem-neutral-gray-900 leading-relaxed">
                <span className="text-[48px]text-cem-neutral-gray-900">&ldquo;</span>
                {currentTestimonial.quote}
                <span className="text-cem-primary font-semibold">
                  {currentTestimonial.highlightedText}
                </span>
                <span className="text-2xl md:text-3xl lg:text-4xl text-cem-primary">&rdquo;</span>
              </p>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-cem-neutral-gray-100 border-2 border-yellow-400">
                  <Image
                    key={currentTestimonial.id}
                    src={currentTestimonial.image}
                    alt={currentTestimonial.author}
                    fill
                    sizes="(max-width: 768px) 96px, 112px"
                    className="object-cover rounded-full transition-opacity duration-500"
                    priority={currentIndex === 0}
                  />
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-cem-neutral-gray-900 mb-2">
                {currentTestimonial.author}
              </h3>
              <p className="text-base md:text-lg text-cem-neutral-gray-600">
                {currentTestimonial.role}, {currentTestimonial.affiliation}
              </p>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center gap-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "h-1 w-8 bg-cem-primary rounded-full"
                    : "w-2 h-2 rounded-full bg-cem-neutral-gray-300"
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

