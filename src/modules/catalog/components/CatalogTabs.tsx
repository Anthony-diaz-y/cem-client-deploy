'use client'

import React from "react"
import CourseSlider from "./CourseSlider"
import { CatalogPageData } from "../types"

interface CatalogTabsProps {
  catalogPageData: CatalogPageData
  active: number
  onTabChange: (tab: number) => void
}

/**
 * CatalogTabs - Tabs component for catalog page
 * Displays tabs and course slider based on active tab
 */
const CatalogTabs: React.FC<CatalogTabsProps> = ({
  catalogPageData,
  active,
  onTabChange,
}) => {
  return (
    <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
      <div className="section_heading">Courses to get you started</div>
      <div className="my-4 flex border-b border-b-richblack-600 text-sm">
        <p
          className={`px-4 py-2 ${
            active === 1
              ? "border-b border-b-yellow-25 text-yellow-25"
              : "text-richblack-50"
          } cursor-pointer`}
          onClick={() => onTabChange(1)}
        >
          Most Popular
        </p>
        <p
          className={`px-4 py-2 ${
            active === 2
              ? "border-b border-b-yellow-25 text-yellow-25"
              : "text-richblack-50"
          } cursor-pointer`}
          onClick={() => onTabChange(2)}
        >
          New
        </p>
      </div>
      <div>
        <CourseSlider
          Courses={catalogPageData?.selectedCategory?.courses || []}
        />
      </div>
    </div>
  )
}

export default CatalogTabs

