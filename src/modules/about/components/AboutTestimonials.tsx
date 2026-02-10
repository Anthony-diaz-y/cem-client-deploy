import React from "react";
import { RatingStars } from "@shared/components";
import { TESTIMONIALS } from "../constants/about.constants";

const AboutTestimonials = () => {
    return (
        <section className="flex flex-col items-center justify-center py-16 bg-cem-accent px-5 lg:px-24">
            <h3 className="text-[16px] uppercase inline-block mb-4">Testimonios</h3>
            <h2 className="text-[36px] font-semibold mb-12">Autoridades nos recomiendan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[380px] md:max-w-[1200px]">
                {TESTIMONIALS.map((testi, index) => (
                    <div key={index} className="bg-white rounded-[40px] p-8 flex flex-col gap-6 shadow-sm">
                        <RatingStars Review_Count={testi.rating} Star_Size={20} />
                        <p className="text-cem-neutral-gray-600 text-[18px] leading-[24px]">
                            {testi.text}
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="w-12 h-12 bg-[#2D2D2D] rounded-full flex items-center justify-center text-white font-bold">
                                MW
                            </div>
                            <div>
                                <h4 className="font-bold text-cem-neutral-gray-900">{testi.name}</h4>
                                <p className="text-cem-neutral-gray-500 text-sm">{testi.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutTestimonials;
