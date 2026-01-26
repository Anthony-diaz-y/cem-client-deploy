"use client";

import React from "react";
import CourseSlider from "./CourseSlider";
import { CatalogTabsProps } from "../types";
import { FiSearch, FiX } from "react-icons/fi";
import { useCatalogTabsFilter } from "../hooks/useCatalogTabsFilter";
import { CATALOG_TEXTS } from "../constants/catalog.constants";

/**
 * CatalogTabs - Tabs component for catalog page
 * Displays tabs and course slider based on active tab
 */
const CatalogTabs: React.FC<CatalogTabsProps> = ({
  catalogPageData,
  active,
  onTabChange,
}) => {
  const {
    searchQuery,
    filteredCourses,
    setSearchQuery,
    clearSearch,
  } = useCatalogTabsFilter({
    catalogPageData,
    activeTab: active,
  });

  return (
    <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
      <div className="section_heading mb-6">{CATALOG_TEXTS.sections.coursesToStart}</div>
      
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-richblack-400" />
          </div>
          <input
            type="text"
            placeholder={CATALOG_TEXTS.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-12 py-3.5 bg-richblack-800 border border-richblack-700 rounded-xl text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-50/50 focus:border-yellow-50/50 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-richblack-200 transition-colors"
            >
              <FiX className="h-5 w-5 text-richblack-400" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-richblack-400">
            {CATALOG_TEXTS.search.results(filteredCourses.length)}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="my-4 flex border-b border-b-richblack-600 text-sm">
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            active === 1
              ? "border-b-2 border-b-yellow-50 text-yellow-50 font-medium"
              : "text-richblack-50 hover:text-richblack-200"
          } cursor-pointer`}
          onClick={() => onTabChange(1)}
        >
          {CATALOG_TEXTS.tabs.mostPopular}
        </button>
        <button
          className={`px-4 py-2 transition-all duration-200 ${
            active === 2
              ? "border-b-2 border-b-yellow-50 text-yellow-50 font-medium"
              : "text-richblack-50 hover:text-richblack-200"
          } cursor-pointer`}
          onClick={() => onTabChange(2)}
        >
          {CATALOG_TEXTS.tabs.new}
        </button>
      </div>
      
      {/* Cursos */}
      {filteredCourses.length > 0 ? (
        <div>
          <CourseSlider Courses={filteredCourses} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-richblack-400 text-lg">
            {searchQuery
              ? CATALOG_TEXTS.search.noResults
              : CATALOG_TEXTS.search.noCoursesInCategory}
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogTabs;
