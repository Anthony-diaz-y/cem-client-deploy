import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiBookOpen } from "react-icons/fi";
import CategoryCourseItem from "../../CategoryCourseItem";
import type { CategoryCardProps } from "../interfaces/CategoryCard.interface";

interface CategoryCardContentProps extends Pick<
  CategoryCardProps,
  "category"
> {
  courseCount: number;
}

export const CategoryCardContent: React.FC<CategoryCardContentProps> = ({
  category,
  courseCount,
}) => {
  return (
    <AnimatePresence initial={false}>
      {category.expanded && (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="bg-white rounded-b-[2rem] overflow-hidden border-t-0 mt-0"
        >
          <div className="w-[96%] max-w-[932px] mx-auto border-t border-cem-neutral-gray-200" />

          <div className="px-6 pb-6 pt-6">
            {category.loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="w-8 h-8 border-4 border-cem-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                  Cargando cursos...
                </p>
              </motion.div>
            ) : courseCount === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 bg-white rounded-2xl border border-dashed border-cem-neutral-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-cem-neutral-gray-50 flex items-center justify-center mx-auto mb-3">
                  <FiBookOpen className="text-xl text-cem-neutral-gray-300" />
                </div>
                <p className="text-sm font-bold text-cem-neutral-gray-900">
                  Esta categoría no tiene cursos
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="courses"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-3"
              >
                {category.courses?.map((course) => (
                  <div key={course.id}>
                    <CategoryCourseItem
                      course={course}
                      categoryId={category.id}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
