import React from "react";
import Image from "next/image";
import { ConcentricCircles } from "../../shared";
import { brandColors } from "@shared/design-tokens";
import doctor from "@shared/assets/hero/doctor.webp";
import iconCourse from "@shared/assets/hero/icon-course.webp";
import iconCoursesView from "@shared/assets/hero/icon-coursesView.webp";
import iconStudent from "@shared/assets/hero/icon-student.webp";
import { HeroBadge } from "./HeroBadge";

export const HeroImageSection: React.FC = () => {
    return (
        <div className=" w-full max-w-[600px] ">
            {/* Círculo concéntrico decorativo desktop (400px) */}
            <ConcentricCircles
                size={400}
                circles={4}
                borderColor={brandColors.primary.light}
                className="absolute hidden md:block md:top-56 md:-right-48 lg:top-72 lg:-right-32 z-0"
            />
            <div
                className="relative w-[260px] h-[260px] min-[380px]:w-[300px]  min-[380px]:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto"
                style={{ marginTop: "30px" }}
            >
                {/* Corona circular de fondo */}
                <div
                    className="absolute z-0 w-[260px] h-[260px] min-[380px]:w-[300px] min-[380px]:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                    style={{
                        borderRadius: "50%",
                        border: `1px solid ${brandColors.primary.DEFAULT}`,
                        top: "-20px",
                        left: "-20px",
                        boxSizing: "border-box",
                        pointerEvents: "none",
                    }}
                />

                {/* Círculo principal con imagen */}
                <div
                    className="relative z-10 rounded-full overflow-hidden shadow-2xl w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                    style={{
                        borderRadius: "50%",
                        marginTop: "30px",
                        marginLeft: "10px",
                    }}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={doctor}
                            alt="doctora"
                            fill
                            className="object-cover"
                            style={{ borderRadius: "50%" }}
                            priority
                        />
                    </div>
                </div>

                {/* Badges */}
                <HeroBadge
                    position="top-left"
                    value="3+"
                    label="Cursos"
                    imageSrc={iconCourse}
                />
                <HeroBadge
                    position="top-right"
                    value="5K+"
                    label="Vistas de cursos"
                    imageSrc={iconCoursesView}
                />
                <HeroBadge
                    position="bottom-right"
                    value="71+"
                    label="Estudiantes"
                    imageSrc={iconStudent}
                />

                {/* Punto decorativo */}
                <div className="hidden md:block absolute bottom-1 left-6 md:bottom-2 md:left-10 lg:left-12 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-cem-primary rounded-full z-20"></div>
            </div>
        </div>
    );
};
