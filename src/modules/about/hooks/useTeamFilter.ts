import { useState, useMemo } from "react";
import { ALL_STAFF_MEMBERS } from "../constants/about.constants";
import { StaffMember } from "../interfaces/about.interfaces";

export const useTeamFilter = () => {
    const [activeCategory, setActiveCategory] = useState("Fundadores");

    const filteredStaff = useMemo(() => {
        const base = ALL_STAFF_MEMBERS.filter(m => m.category === activeCategory);
        if (base.length < 4) {
            const others = ALL_STAFF_MEMBERS.filter(m => m.category !== activeCategory);
            return [...base, ...others].slice(0, 8);
        }
        return base;
    }, [activeCategory]);

    return {
        activeCategory,
        setActiveCategory,
        filteredStaff,
    };
};
