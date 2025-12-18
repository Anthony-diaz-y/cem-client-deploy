import { useEffect, useState, useRef } from "react";
import { InstructorDataType, Course } from "../types";
import { getInstructorData } from "@shared/services/profileAPI";
import { fetchInstructorCourses } from "@shared/services/courseDetailsAPI";

/**
 * Custom hook to fetch and manage instructor data
 * Separates data fetching logic from component
 */
// Cache global para mantener datos entre navegaciones
let cachedInstructorData: InstructorDataType[] | null = null;
let cachedCourses: Course[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para invalidar el cache (útil después de inscripciones, etc.)
export const invalidateInstructorCache = () => {
  cachedInstructorData = null;
  cachedCourses = [];
  cacheTimestamp = 0;
};

export const useInstructorData = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState<
    InstructorDataType[] | null
  >(cachedInstructorData); // Inicializar con cache si existe
  const [courses, setCourses] = useState<Course[]>(cachedCourses); // Inicializar con cache si existe
  const hasLoadedRef = useRef(cachedInstructorData !== null || cachedCourses.length > 0);

  // Función para cargar datos frescos en background o forzada
  const fetchFreshData = async (forceUpdate = false) => {
    try {
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        const tokenStr = localStorage.getItem('token');
        if (tokenStr) {
          try {
            token = JSON.parse(tokenStr);
          } catch {
            token = tokenStr;
          }
        }
      }

      if (!token) return;

      // Si es una actualización forzada, mostrar loading
      if (forceUpdate) {
        setLoading(true);
      }

      const [instructorApiData, instructorCourses] = await Promise.all([
        getInstructorData(token),
        fetchInstructorCourses(token),
      ]);

      // Normalizar y sincronizar datos de estudiantes (misma lógica que en el useEffect principal)
      let normalizedCourses: Course[] = [];
      
      if (instructorCourses && Array.isArray(instructorCourses)) {
        // Normalizar cursos: función robusta de normalización según recomendaciones del backend
        normalizedCourses = instructorCourses.map((course: any) => {
          // 1. Asegurar que studentsEnrolled sea SIEMPRE un array (según recomendación del backend)
          let studentsEnrolled: string[] = [];
          if (Array.isArray(course.studentsEnrolled)) {
            studentsEnrolled = course.studentsEnrolled;
          } else if (Array.isArray(course.studentsEnroled)) {
            studentsEnrolled = course.studentsEnroled; // Manejar typo común
          } else if (Array.isArray(course.enrolledStudents)) {
            studentsEnrolled = course.enrolledStudents;
          } else if (Array.isArray(course.students)) {
            studentsEnrolled = course.students;
          } else {
            // Si no es un array, inicializar como array vacío
            studentsEnrolled = [];
          }
          
          // 2. Calcular totalStudentsEnrolled: priorizar el valor del backend, sino usar la longitud del array
          let totalStudentsEnrolled: number;
          if (typeof course.totalStudentsEnrolled === 'number' && course.totalStudentsEnrolled >= 0) {
            totalStudentsEnrolled = course.totalStudentsEnrolled;
          } else if (typeof course.totalStudents === 'number' && course.totalStudents >= 0) {
            totalStudentsEnrolled = course.totalStudents;
          } else {
            // Si no existe, calcular desde el array
            totalStudentsEnrolled = studentsEnrolled.length;
          }
          
          // 3. Validar que totalStudentsEnrolled coincida con la longitud del array (según recomendación del backend)
          if (totalStudentsEnrolled !== studentsEnrolled.length) {
            totalStudentsEnrolled = studentsEnrolled.length;
          }
          
          // 4. Convertir price de string a número si es necesario
          let price: number;
          if (typeof course.price === 'string') {
            price = parseFloat(course.price) || 0;
          } else if (typeof course.price === 'number') {
            price = course.price;
          } else {
            price = 0;
          }
          
          return {
              ...course,
              studentsEnrolled, // Siempre un array
              totalStudentsEnrolled, // Siempre un número válido
              price, // Siempre un número
              // Asegurar que status sea 'Published' o 'Draft'
              status: course.status === 'Published' || course.status === 'Draft' 
                ? course.status 
                : (course.status || 'Draft'),
              // Usar totalAmountGenerated del backend si está disponible
              totalAmountGenerated: typeof course.totalAmountGenerated === 'number' 
                ? course.totalAmountGenerated 
                : undefined,
            };
        });
        
        setCourses(normalizedCourses as Course[]);
        cachedCourses = normalizedCourses as Course[];
      }

      // Normalizar instructorData: sincronizar con courses para tener datos consistentes
      if (instructorApiData && Array.isArray(instructorApiData) && instructorApiData.length > 0) {
        const normalizedInstructorData = instructorApiData.map((data: any) => {
          // Buscar el curso correspondiente en la lista de cursos normalizados
          const matchingCourse = normalizedCourses.length > 0 
            ? normalizedCourses.find((c: any) => {
                const courseId = c?.id || c?._id;
                const dataId = data?._id || data?.id;
                return courseId === dataId;
              })
            : null;
          
          // Usar el conteo de estudiantes del curso normalizado si está disponible
          const studentsCount = matchingCourse?.totalStudentsEnrolled ?? 
                               (Array.isArray(data.studentsEnrolled) 
                                 ? data.studentsEnrolled.length 
                                 : (data.totalStudentsEnrolled || 0));
          
          return {
            ...data,
            totalStudentsEnrolled: studentsCount,
          };
        });
        
        setInstructorData(normalizedInstructorData as InstructorDataType[]);
        cachedInstructorData = normalizedInstructorData as InstructorDataType[];
      }
      hasLoadedRef.current = true;
      cacheTimestamp = Date.now();
      
      if (forceUpdate) {
        setLoading(false);
      }
      } catch (error) {
        if (forceUpdate) {
          setLoading(false);
        }
      }
  };

  // Listener para refrescar datos cuando se invalida el cache
  useEffect(() => {
    const handleRefresh = () => {
      // Forzar recarga de datos invalidando el cache
      hasLoadedRef.current = false;
      cacheTimestamp = 0; // Invalidar timestamp
      // Llamar a fetchFreshData con forceUpdate=true para actualizar el estado
      fetchFreshData(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("instructorDataRefresh", handleRefresh);
      return () => {
        window.removeEventListener("instructorDataRefresh", handleRefresh);
      };
    }
  }, []); // fetchFreshData está definido antes, así que está disponible en el closure

  useEffect(() => {
    (async () => {
      // Si hay cache válido, usar esos datos inmediatamente sin mostrar loading
      const now = Date.now();
      if (cachedInstructorData && cachedCourses.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
        setInstructorData(cachedInstructorData);
        setCourses(cachedCourses);
        hasLoadedRef.current = true;
        // Cargar datos frescos en background sin mostrar loading
        fetchFreshData();
        return;
      }

      // Solo mostrar loading si nunca se han cargado datos
      if (!hasLoadedRef.current) {
        setLoading(true);
      }
      
      try {
        // Obtener token del localStorage
        let token: string | null = null;
        if (typeof window !== 'undefined') {
          const tokenStr = localStorage.getItem('token');
          if (tokenStr) {
            try {
              token = JSON.parse(tokenStr);
            } catch {
              token = tokenStr;
            }
          }
        }

        if (!token) {
          setLoading(false);
          return;
        }

        // Obtener datos del instructor y cursos
        const [instructorApiData, instructorCourses] = await Promise.all([
          getInstructorData(token),
          fetchInstructorCourses(token),
        ]);

        // Normalizar y sincronizar datos de estudiantes
        if (instructorCourses && Array.isArray(instructorCourses)) {
          // Normalizar cursos: función robusta de normalización según recomendaciones del backend
          const normalizedCourses = instructorCourses.map((course: any) => {
            // 1. Asegurar que studentsEnrolled sea SIEMPRE un array (según recomendación del backend)
            let studentsEnrolled: string[] = [];
            if (Array.isArray(course.studentsEnrolled)) {
              studentsEnrolled = course.studentsEnrolled;
            } else if (Array.isArray(course.studentsEnroled)) {
              studentsEnrolled = course.studentsEnroled; // Manejar typo común
            } else if (Array.isArray(course.enrolledStudents)) {
              studentsEnrolled = course.enrolledStudents;
            } else if (Array.isArray(course.students)) {
              studentsEnrolled = course.students;
            } else {
              // Si no es un array, inicializar como array vacío
              studentsEnrolled = [];
            }
            
            // 2. Calcular totalStudentsEnrolled: priorizar el valor del backend, sino usar la longitud del array
            let totalStudentsEnrolled: number;
            if (typeof course.totalStudentsEnrolled === 'number' && course.totalStudentsEnrolled >= 0) {
              totalStudentsEnrolled = course.totalStudentsEnrolled;
            } else if (typeof course.totalStudents === 'number' && course.totalStudents >= 0) {
              totalStudentsEnrolled = course.totalStudents;
            } else {
              // Si no existe, calcular desde el array
              totalStudentsEnrolled = studentsEnrolled.length;
            }
            
            // 3. Validar que totalStudentsEnrolled coincida con la longitud del array (según recomendación del backend)
            if (totalStudentsEnrolled !== studentsEnrolled.length) {
              totalStudentsEnrolled = studentsEnrolled.length;
            }
            
            // 4. Convertir price de string a número si es necesario
            let price: number;
            if (typeof course.price === 'string') {
              price = parseFloat(course.price) || 0;
            } else if (typeof course.price === 'number') {
              price = course.price;
            } else {
              price = 0;
            }
            
            return {
              ...course,
              studentsEnrolled, // Siempre un array
              totalStudentsEnrolled, // Siempre un número válido
              price, // Siempre un número
              // Asegurar que status sea 'Published' o 'Draft'
              status: course.status === 'Published' || course.status === 'Draft' 
                ? course.status 
                : (course.status || 'Draft'),
              // Usar totalAmountGenerated del backend si está disponible
              totalAmountGenerated: typeof course.totalAmountGenerated === 'number' 
                ? course.totalAmountGenerated 
                : undefined,
            };
          });
          
          setCourses(normalizedCourses as Course[]);
          cachedCourses = normalizedCourses as Course[];
        }

        // Normalizar instructorData: sincronizar con courses para tener datos consistentes
        if (instructorApiData && Array.isArray(instructorApiData) && instructorApiData.length > 0) {
          // Si tenemos cursos normalizados, usar esos datos para sincronizar
          const normalizedInstructorData = instructorApiData.map((data: any) => {
            // Buscar el curso correspondiente en la lista de cursos normalizados
            const matchingCourse = cachedCourses.length > 0 
              ? cachedCourses.find((c: any) => {
                  const courseId = c?.id || c?._id;
                  const dataId = data?._id || data?.id;
                  return courseId === dataId;
                })
              : null;
            
            // Usar el conteo de estudiantes del curso normalizado si está disponible
            const studentsCount = matchingCourse?.totalStudentsEnrolled ?? 
                                 (Array.isArray(data.studentsEnrolled) 
                                   ? data.studentsEnrolled.length 
                                   : (data.totalStudentsEnrolled || 0));
            
            return {
              ...data,
              totalStudentsEnrolled: studentsCount,
            };
          });
          
          setInstructorData(normalizedInstructorData as InstructorDataType[]);
          cachedInstructorData = normalizedInstructorData as InstructorDataType[];
        }
        hasLoadedRef.current = true;
        cacheTimestamp = Date.now();
      } catch (error) {
        // Error silencioso - el estado de loading se maneja automáticamente
      }
      setLoading(false);
    })();
  }, []); // Solo ejecutar una vez al montar

  return { loading, instructorData, courses };
};
