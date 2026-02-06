"use client";

import React from "react";
import { Footer } from "@shared/components";
import { HeroSection } from "./components/hero";
import { PartnersSection } from "./components/partners";
import { CoursesSection } from "./components/courses";
import { ValuePropositionSection } from "./components/valueProposition";
import { ExpertsSection } from "./components/experts";
import { TestimonialsSection } from "./components/testimonials";
import { FAQSection } from "./components/faq";
import { AlliesSection } from "./components/allies";
import { NewsSection } from "./components/news";
import { AboutSection } from "./components/about";
import type { HomeProps } from "./types";
import { useCombinedCourses } from "./hooks/useCombinedCourses";

const Home: React.FC<HomeProps> = ({
  courses,
  token,
  hero,
  coursesLoading = false,
  coursesError = false,
}) => {
  const displayCourses = useCombinedCourses(courses || []);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden  mt-16 ">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col">
        <HeroSection hero={hero} />
        <PartnersSection />
      </div>

      <CoursesSection
        courses={displayCourses}
        loading={coursesLoading}
        error={coursesError}
      />

      <ValuePropositionSection />

      <ExpertsSection />

      <AboutSection />

      <TestimonialsSection />

      <FAQSection />

      <AlliesSection />

      <NewsSection />

      <Footer />
    </div>
  );
};

export default Home;
