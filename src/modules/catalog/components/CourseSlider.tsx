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
  
  // Si no hay cursos, no mostrar nada (el mensaje se muestra en el componente padre)
  if (!Courses || Courses.length === 0) {
    return null;
  }
  
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={25}
      loop={shouldLoop}
      // modules={[ Pagination]}

      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 25,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 25,
        },
      }}
      className="pt-8 px-2 pb-4"
    >
      {Courses.map((course, i) => (
        <SwiperSlide key={i} className="h-auto flex">
          <CourseCard course={course} Height={"h-[280px]"} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CourseSlider;
