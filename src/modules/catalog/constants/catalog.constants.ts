// Catalog Module - Constants
// Datos estáticos para componentes del módulo Catalog

export const CATALOG_TEXTS = {
  breadcrumb: {
    home: "Home",
    catalog: "Catalog",
  },
  tabs: {
    mostPopular: "Más Populares",
    new: "Nuevos",
  },
  sections: {
    coursesToStart: "Cursos para comenzar",
    topRatedInCategory: (categoryName: string) => `Cursos Mejor Valorados en ${categoryName}`,
    frequentlyBought: "Frecuentemente Comprados",
  },
  search: {
    placeholder: "Buscar cursos por nombre, instructor o categoría...",
    results: (count: number) => `${count} curso${count !== 1 ? "s" : ""} encontrado${count !== 1 ? "s" : ""}`,
    noResults: "No se encontraron cursos con tu búsqueda",
    noCoursesInCategory: "No hay cursos disponibles en esta categoría",
  },
  emptyState: {
    title: "No hay cursos disponibles",
    message: "No se encontraron cursos para esta categoría en este momento.",
  },
} as const;

