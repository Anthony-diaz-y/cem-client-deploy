export const flipCardVariants = {
    front: {
        rotateY: 0,
    },
    back: {
        rotateY: 180,
    },
};

export const flipCardTransition = {
    duration: 0.6,
    type: "spring",
    stiffness: 260,
    damping: 20,
};

export const fadeInScaleVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: (index: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            delay: index * 0.05,
        },
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};
