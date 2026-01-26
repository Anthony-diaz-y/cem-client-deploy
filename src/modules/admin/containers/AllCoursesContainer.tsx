"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";
import AllCoursesTable from "../components/course/AllCoursesTable";
import { Loading } from "@shared/components";
import Pagination from "@shared/components/common/Pagination";
import { useAdminCourses } from "../hooks/course/useAdminCourses";

export default function AllCoursesContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAppSelector((state) => state.auth);
  const initialSearch = searchParams.get("search") || undefined;

  const {
    courses,
    counts,
    meta,
    filters,
    loading,
    searchInput,
    setSearchInput,
    handlePageChange,
    handleFiltersChange,
    refreshCourses,
  } = useAdminCourses(token, initialSearch);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-richblack-5">
          Todos los Cursos
        </h1>
        <p className="text-richblack-400">
          Gestiona todos los cursos del sistema, tanto publicados como en borrador
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => router.push("/dashboard/add-course")}
            className="flex items-center gap-x-2 rounded-lg bg-yellow-50 px-5 py-2.5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20"
          >
            <span className="text-lg">+</span> Crear Curso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Total de Cursos</p>
          <p className="text-2xl font-bold text-richblack-5">{counts.total}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Publicados</p>
          <p className="text-2xl font-bold text-green-400">{counts.published}</p>
        </div>
        <div className="bg-richblack-800 rounded-xl p-4 border border-richblack-700">
          <p className="text-sm text-richblack-400 mb-1">Borradores</p>
          <p className="text-2xl font-bold text-yellow-100">{counts.draft}</p>
        </div>
      </div>

      <AllCoursesTable
        courses={courses}
        token={token}
        onUpdate={refreshCourses}
        onEdit={() => {}}
        filters={{
          search: filters.search,
          status: filters.status,
          categoryId: filters.categoryId,
          instructorId: filters.instructorId,
        }}
        onFiltersChange={handleFiltersChange}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
      />

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
