"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StaffMember } from "../interfaces/about.interfaces";
import { flipCardVariants, flipCardTransition } from "../animations";

interface StaffCardProps {
    member: StaffMember;
}

const StaffCard: React.FC<StaffCardProps> = ({ member }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="flex flex-col gap-4 w-full items-center md:items-start"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className="relative w-[241px] h-[336px] md:w-full md:aspect-[4/5] [perspective:1000px] cursor-pointer">
                <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d]"
                    initial="front"
                    animate={isFlipped ? "back" : "front"}
                    variants={flipCardVariants}
                    transition={flipCardTransition}
                >
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover rounded-[30px] grayscale"
                        />
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-cem-accent rounded-[30px] p-6 flex items-center justify-center text-center">
                        <p className="text-cem-neutral-gray-700 text-sm leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fermentum iaculis turpis morbi libero. Sodales commodo arcu mi aliquam amet.
                        </p>
                    </div>
                </motion.div>
            </div>
            <div className="text-center md:text-left">
                <h4 className="text-[20px] font-bold text-cem-neutral-gray-900">{member.name}</h4>
                <p className="text-cem-neutral-gray-500 text-[14px]">{member.role}</p>
            </div>
        </div>
    );
};

export default StaffCard;
