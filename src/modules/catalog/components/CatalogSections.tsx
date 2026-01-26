"use client";

import React from "react";
import CourseSlider from "./CourseSlider";
import CourseCard from "./CourseCard";
import { CatalogSectionsProps, Course } from "../types";
import { useCatalogSections } from "../hooks/useCatalogSections";
import { CATALOG_TEXTS } from "../constants/catalog.constants";

/**
 * CatalogSections - Sections component for catalog page
 * Displays courses from the selected category and most selling courses
 */
const CatalogSections: React.FC<CatalogSectionsProps> = ({
  catalogPageData,
}) => {
  const { topRatedCourses, mostSellingInCategory } = useCatalogSections({
    catalogPageData,
  });

  return (
    <>
      {/* Section 2 - Top Rated Courses in Selected Category */}
      {topRatedCourses.length > 0 && (
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent mt-8">
          <div className="section_heading mb-6">
            {CATALOG_TEXTS.sections.topRatedInCategory(catalogPageData?.selectedCategory?.name || "")}
          </div>
          <div>
            <CourseSlider Courses={topRatedCourses} />
          </div>
        </div>
      )}
      
      {/* Section 3 - Most Selling / Frequently Bought */}
      {mostSellingInCategory.length > 0 && (
        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent overflow-x-hidden">
          <div className="section_heading mb-6">{CATALOG_TEXTS.sections.frequentlyBought}</div>
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              {mostSellingInCategory.map((course: Course, i: number) => {
                const courseId = (course as { id?: string })?.id || course?._id || i;
                return (
                  <div key={courseId} className="w-full min-w-0">
                    <CourseCard
                      course={course}
                      Height={"h-[280px]"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CatalogSections;
