import Instructor from "@shared/assets/Images/teacher3.png";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";
import { Img } from "@shared/components";

import { motion } from "framer-motion";
import { scaleUp } from "@shared/utils/motionFrameVarients";
import { HOME_TEXTS } from "../constants/home.constants";

const InstructorSection = () => {
  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-20 items-center">
        <motion.div
          variants={scaleUp}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className="lg:w-[50%] "
        >
          <Img
            src={Instructor}
            alt="Instructor"
            className="shadow-white rounded-3xl"
          />
        </motion.div>

        <div className="lg:w-[50%] flex flex-col">
          <div className="text-3xl lg:text-4xl font-semobold w-[50%] mb-2">
            {HOME_TEXTS.instructor.title.part1}
            <HighlightText text={HOME_TEXTS.instructor.title.part2} />
          </div>

          <p className="font-medium text-[16px] w-[80%] text-richblack-300 mb-12">
            {HOME_TEXTS.instructor.description}
          </p>

          <div className="w-fit">
            <CTAButton active={true} linkto={HOME_TEXTS.links.signup}>
              <div className="flex flex-row gap-2 items-center">
                {HOME_TEXTS.instructor.button}
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
