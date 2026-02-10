"use client";

import React from "react";
import { ValuePropositionSection } from "@/modules/home/components/valueProposition";
import AboutHero from "../components/AboutHero";
import AboutHistory from "../components/AboutHistory";
import AboutStats from "../components/AboutStats";
import AboutTestimonials from "../components/AboutTestimonials";
import AboutTeam from "../components/AboutTeam";

const AboutContainer = () => {
  return (
    <section className="flex flex-col h-full w-full justify-center items-center">
      <div className="w-full mt-16">
        <AboutHero />

        <AboutHistory />

        <AboutStats />

        <section className="flex w-full flex-col justify-center items-center">
          <ValuePropositionSection />
        </section>

        <AboutTestimonials />

        <AboutTeam />
      </div>
    </section>
  );
};

export default AboutContainer;
