"use client";

import React from "react";
import Courses from "../Courses";
import { useCoursesData } from "../hooks/useCoursesData";

const CoursesContainer = () => {
  const {
    courses,
    categories,
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
  } = useCoursesData();

  return (
    <Courses
      courses={courses}
      categories={categories}
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
