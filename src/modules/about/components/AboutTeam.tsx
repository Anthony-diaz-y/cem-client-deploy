"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffCard from "./StaffCard";
import { STAFF_CATEGORIES } from "../constants/about.constants";
import { fadeInScaleVariants } from "../animations";
import { useTeamFilter } from "../hooks/useTeamFilter";

const AboutTeam = () => {
    const { activeCategory, setActiveCategory, filteredStaff } = useTeamFilter();

    return (
        <section className="flex flex-col justify-center items-center mt-20 mb-32 overflow-hidden">
            <div className="max-w-[1200px] w-full px-6 xl:px-0">
                <h2 className="text-[36px] font-semibold mb-8">Conoce al equipo</h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-12 text-sm md:text-base overflow-x-auto pb-2 no-scrollbar">
                    {STAFF_CATEGORIES.map((cat, idx) => (
                        <div key={cat} className="flex items-center gap-4 whitespace-nowrap">
                            <button
                                onClick={() => setActiveCategory(cat)}
                                className={`transition-all duration-300 relative pb-1 ${activeCategory === cat
                                    ? "text-cem-primary font-bold border-b-2 border-cem-primary"
                                    : "text-cem-neutral-gray-400 hover:text-cem-neutral-gray-600"
                                    }`}
                            >
                                {cat}
                            </button>
                            {idx < STAFF_CATEGORIES.length - 1 && (
                                <span className="text-cem-neutral-gray-300">—</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Carousel - Full Width */}
            <div className="w-full md:hidden">
                <div
                    className="flex overflow-x-auto gap-4 px-6 pb-10 snap-x snap-mandatory no-scrollbar"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}} />
                    {filteredStaff.map((member, index) => (
                        <div
                            key={`${activeCategory}-${member.id}-${index}`}
                            className="flex-shrink-0 w-[241px] snap-center"
                        >
                            <StaffCard member={member} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Grid Layout */}
            <div className="max-w-[1200px] w-full px-6 xl:px-0 hidden md:block">
                <motion.div
                    layout
                    className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredStaff.map((member, index) => (
                            <motion.div
                                key={`${activeCategory}-${member.id}-${index}`}
                                variants={fadeInScaleVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                custom={index}
                                layout
                            >
                                <StaffCard member={member} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutTeam;
