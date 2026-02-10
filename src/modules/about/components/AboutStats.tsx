import React from "react";
import { STATS } from "../constants/about.constants";

const AboutStats = () => {
    return (
        <section className="bg-cem-primary mt-32 flex items-center justify-center py-16">
            <div className="flex flex-col md:flex-row w-full max-w-[1200px] justify-around items-center text-white text-center gap-7 md:gap-0">
                {STATS.map((stat, index) => (
                    <div key={index} className="flex flex-col gap-1 justify-center items-center">
                        <h4 className="text-[48px] font-bold">{stat.value}</h4>
                        <p className="text-[28px]">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutStats;
