"use client";

import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Footer, Img } from "@shared/components";
import { fadeIn } from "@shared/utils/motionFrameVarients";
import { HighlightText } from "@modules/home";

import FoundingStory from "@shared/assets/Images/FoundingStory.png";
import BannerImage1 from "@shared/assets/Images/aboutus1.webp";
import BannerImage2 from "@shared/assets/Images/aboutus2.webp";
import BannerImage3 from "@shared/assets/Images/aboutus3.webp";

import ContactFormSection from "../components/ContactFormSection";
import LearningGrid from "../components/LearningGrid";
import Quote from "../components/Quote";
import Stats from "../components/Stats";
import { LEARNING_GRID_ITEMS, STATS_DATA } from "../constants/about.constants";

const ReviewSlider = lazy(() => import("@shared/components/sliders/ReviewSlider"));

const AboutContainer = () => {
  return (
    <div className="flex flex-col h-full w-full min-h-screen justify-center items-center max-w-[1200px] bg-black/10">
      <h2 className="text-6xl">Impulsando la innovación en la educación en línea para un futuro más brillante</h2>
    </div>
  );
};

export default AboutContainer;
