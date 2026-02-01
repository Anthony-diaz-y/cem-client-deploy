"use client";

import React from "react";
import Courses from "../Courses";
import { useCoursesData } from "../hooks/useCoursesData";

interface CoursesContainerProps {
  categoryId?: string;
}

/** Container para la lista de cursos con filtrado opcional por categoría */
const CoursesContainer: React.FC<CoursesContainerProps> = ({ categoryId }) => {
  const {
    courses,
    loading,
    isFetching,
    error,
    search,
    page,
    limit,
    meta,
    category,
    setPage,
    setSearch,
    setCategory,
  } = useCoursesData(categoryId);

  return (
    <Courses
      courses={courses}
      search={search}
      category={category}
      page={page}
      limit={limit}
      meta={meta}
      onPageChange={setPage}
      onSearchChange={setSearch}
      onCategoryChange={setCategory}
      loading={loading}
      isFetching={isFetching}
      error={error}
    />
  );
};

export default CoursesContainer;
