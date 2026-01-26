import React from "react";
import Image, { StaticImageData } from "next/image";

import Logo1 from "@shared/assets/TimeLineLogo/Logo1.svg";
import Logo2 from "@shared/assets/TimeLineLogo/Logo2.svg";
import Logo3 from "@shared/assets/TimeLineLogo/Logo3.svg";
import Logo4 from "@shared/assets/TimeLineLogo/Logo4.svg";
import timelineImage from "@shared/assets/Images/TimelineImage.png";

import { Img } from "@shared/components";

import { motion } from "framer-motion";
import { fadeIn } from "@shared/utils/motionFrameVarients";
import { TimelineItem } from "../types";
import { HOME_TEXTS } from "../constants/home.constants";

// Helper to get image URL
const getLogoUrl = (logo: string | StaticImageData): string => {
  if (typeof logo === "string") return logo;
  // Handle StaticImageData type
  const staticImage = logo as StaticImageData;
  return staticImage?.src || String(logo);
};

const logos = [Logo1, Logo2, Logo3, Logo4];
const timeline: TimelineItem[] = HOME_TEXTS.timeline.items.map((item, index) => ({
  Logo: getLogoUrl(logos[index]),
  heading: item.heading,
  Description: item.description,
}));

const TimelineSection = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-15 items-center">
        <motion.div
          variants={fadeIn("right", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className="w-full lg:w-[45%] flex flex-col gap-5"
        >
          {timeline.map((element, index) => {
            return (
              <div className="flex flex-row gap-6" key={index}>
                <div className="w-[50px] h-[50px] rounded-full bg-richblue-500 flex justify-center items-center">
                  <Image
                    src={element.Logo}
                    alt={element.heading}
                    width={50}
                    height={50}
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-[18px]">
                    {element.heading}
                  </h2>
                  <p className="text-base">{element.Description}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className="relative shadow-blue-200"
        >
          <Img
            src={getLogoUrl(timelineImage)}
            alt="timelineImage"
            className="shadow-white object-cover h-fit scale-x-[-1] w-[550px] "
          />

          <div
            className=" absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
                            left-[50%] translate-x-[-50%] translate-y-[-70%] rounded-3xl"
          >
            <div className="flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7">
              <p className="text-2xl lg:text-3xl font-bold">{HOME_TEXTS.timeline.stats.years.value}</p>
              <p className="text-caribbeangreen-300 text-xs lg:text-sm">
                {HOME_TEXTS.timeline.stats.years.label}
              </p>
            </div>

            <div className="flex gap-5 items-center px-7">
              <p className="text-2xl lg:text-3xl font-bold">{HOME_TEXTS.timeline.stats.courses.value}</p>
              <p className="text-caribbeangreen-300 text-xs lg:text-sm">
                {HOME_TEXTS.timeline.stats.courses.label}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimelineSection;
