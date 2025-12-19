// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import {  Pagination } from "swiper"

import CourseCard from "./CourseCard";
import { CourseSliderProps } from "../types";

function CourseSlider({ Courses }: CourseSliderProps) {
  // Desactivar loop si no hay suficientes slides para evitar advertencias
  const shouldLoop = Courses && Courses.length > 3;
  
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={shouldLoop}
          // modules={[ Pagination]}

          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem] pt-8 px-2"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i} className="h-auto flex">
              <CourseCard course={course} Height={"h-[280px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 ">
          <p className=" h-[201px] w-full rounded-xl  skeleton"></p>
          <p className=" h-[201px] w-full rounded-xl hidden lg:flex skeleton"></p>
          <p className=" h-[201px] w-full rounded-xl hidden lg:flex skeleton"></p>
        </div>
      )}
    </>
  );
}

export default CourseSlider;
