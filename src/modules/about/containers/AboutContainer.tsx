"use client";

import React, { lazy } from "react";


const ReviewSlider = lazy(() => import("@shared/components/sliders/ReviewSlider"));

const AboutContainer = () => {
  return (
    <section className="flex flex-col h-full w-full  justify-center  items-center max-w-[1440px] mt-15">
      <div className=" h-96 mt-16">
        <div className="px-32 bg-[#A6EFFF4D] h-[250px] ">
          <h2 className="text-6xl">Impulsando la innovación en la educación en línea para un futuro más brillante</h2>

        </div>

      </div>
    </section>
  );
};

export default AboutContainer;
