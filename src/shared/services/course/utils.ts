// Validar formato UUID
export const isValidUUID = (id: string): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Obtener ID de curso (soporta id o _id)
export const getCourseId = (course: { id?: string; _id?: string }): string | null => {
  return course?.id || course?._id || null;
};

// Eliminar cursos duplicados basándose en el ID
export const removeDuplicateCourses = <T extends { id?: string; _id?: string }>(courses: T[]): T[] => {
  return courses.reduce((acc: T[], course: T) => {
    const courseId = getCourseId(course);
    if (!courseId) return acc;

    const existingIndex = acc.findIndex((c: T) => {
      const cId = getCourseId(c);
      return cId === courseId;
    });

    if (existingIndex === -1) {
      acc.push(course);
    }
    return acc;
  }, []);
};

