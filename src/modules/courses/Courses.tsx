"use client";

import React from "react";
import { Footer } from "@shared/components";
import { CoursesHeroSection } from "./components/hero";
import { CategoriesSection } from "./components/categories";
import { CoursesListSection } from "./components/coursesList";
import { ErrorState } from "./components/shared";
import LoadingSpinner from "@shared/components/ui/Loading";
import type { CoursesProps } from "./types";

const Courses: React.FC<
  CoursesProps & {
    isFetching?: boolean;
    category?: string;
    onCategoryChange?: (category: string) => void;
  }
> = ({
  courses,
  categories,
  search,
  category,
  page = 1,
  limit = 9,
  meta,
  onPageChange,
  onSearchChange,
  onCategoryChange,
  loading = false,
  isFetching = false,
  error = false,
}) => {
  if (error) {
    return (
      <div className="bg-white min-h-screen overflow-x-hidden">
        <ErrorState />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 bg-white">
        <CoursesHeroSection
          initialValue={search || ""}
          onSearch={onSearchChange}
          isLoading={isFetching}
        />
        {categories && categories.length > 0 && (
          <CategoriesSection
            categories={categories}
            selectedCategory={category}
            onCategorySelect={onCategoryChange || (() => {})}
          />
        )}
      </div>

      <CoursesListSection
        courses={courses}
        selectedCategory={category}
        page={page}
        limit={limit}
        meta={meta}
        onPageChange={onPageChange}
        loading={loading || isFetching}
      />

      <Footer />
    </div>
  );
};

export default Courses;
