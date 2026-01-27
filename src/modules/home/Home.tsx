"use client";

import React from "react";
import { Footer } from "@shared/components";
import HeroSection from "./components/HeroSection";
import PartnersSection from "./components/PartnersSection";
import { CoursesSection } from "./components/courses";
import { ValuePropositionSection } from "./components/valueProposition";
import { ExpertsSection } from "./components/experts";
import { TestimonialsSection } from "./components/testimonials";
import { FAQSection } from "./components/faq";
import { AlliesSection } from "./components/allies";
import { NewsSection } from "./components/news";
import type { HomeProps } from "./types";
import { useCombinedCourses } from "./hooks/useCombinedCourses";

const Home: React.FC<HomeProps> = ({
  courses,
  token,
  coursesLoading = false,
  coursesError = false,
}) => {
  const displayCourses = useCombinedCourses(courses || []);

  return (
    <div className="bg-white min-h-screen">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 bg-white">
        <HeroSection />
        <PartnersSection />
      </div>

      <CoursesSection 
        courses={displayCourses}
        loading={coursesLoading}
        error={coursesError}
      />

      <ValuePropositionSection />

      <ExpertsSection />

      <TestimonialsSection />

      <FAQSection />

      <AlliesSection />

      <NewsSection />

      <Footer />
    </div>
  );
};

export default Home;