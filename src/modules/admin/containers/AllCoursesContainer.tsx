"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@shared/store/hooks";
import AllCoursesTable from "../components/course/allCoursesTable/AllCoursesTable";
import { Loading } from "@shared/components";
import { useAdminCourses } from "../hooks/course/useAdminCourses";
import { StatCard } from "../components/shared/StatCard";
import { ActionButton } from "../components/shared/ActionButton";

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
    loadMore,
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

  // Solo mostrar la pantalla de carga completa en el primer montaje si no hay cursos
  if (loading && courses.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          Todos los Cursos
        </h1>
        <p className="text-cem-neutral-gray-500 font-medium">
          Gestiona todos los cursos del sistema, tanto publicados como en borrador.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <ActionButton
            label="Crear Curso"
            onClick={() => router.push("/dashboard/add-course")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Cursos" value={counts.total} />
        <StatCard title="Publicados" value={counts.published} />
        <StatCard title="Borradores" value={counts.draft} />
      </div>

      <AllCoursesTable
        courses={courses}
        token={token}
        onUpdate={refreshCourses}
        onEdit={() => { }}
        filters={{
          search: filters.search,
          status: filters.status,
          categoryId: filters.categoryId,
          instructorId: filters.instructorId,
        }}
        onFiltersChange={handleFiltersChange}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        loadMore={loadMore}
        hasMore={meta.page < meta.totalPages}
      />
    </div>
  );
}
