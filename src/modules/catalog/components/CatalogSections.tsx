'use client'

import React from "react"
import CourseSlider from "./CourseSlider"
import CourseCard from "./CourseCard"
import { CatalogPageData, Course } from "../types"

interface CatalogSectionsProps {
  catalogPageData: CatalogPageData
}

/**
 * CatalogSections - Sections component for catalog page
 * Displays different category sections and most selling courses
 */
const CatalogSections: React.FC<CatalogSectionsProps> = ({ catalogPageData }) => {
  return (
    <>
      {/* Section 2 - Different Category */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.differentCategory?.name}
        </div>
        <div>
          <CourseSlider
            Courses={catalogPageData?.differentCategory?.courses || []}
          />
        </div>
      </div>

      {/* Section 3 - Most Selling */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.mostSellingCourses
              ?.slice(0, 4)
              .map((course: Course, i: number) => (
                <CourseCard
                  course={course}
                  key={course._id || i}
                  Height={"h-[300px]"}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default CatalogSections

