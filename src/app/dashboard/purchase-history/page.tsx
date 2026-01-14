"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Img from "@shared/components/Img";
import Loading from "@shared/components/Loading";
import { FiCheckCircle, FiClock, FiXCircle, FiExternalLink, FiCalendar, FiDollarSign, FiHash } from "react-icons/fi";

// ========== TEMPORAL: Interface para datos de compra ==========
// TODO: ELIMINAR ESTE CÓDIGO TEMPORAL DESPUÉS - Reemplazar con datos de la BD
interface PurchaseItem {
  _id: string;
  courseName: string;
  courseDescription: string;
  thumbnail: string;
  price: number;
  purchaseDate: string;
  status: "Completed" | "Pending" | "Refunded";
  transactionId: string;
  courseContent: { _id: string; subSection: { _id: string }[] }[];
}
// ============================================================

function PurchaseHistory() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPurchaseHistory = async () => {
      try {
        setLoading(true);
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
          console.error("No token found");
          setLoading(false);
          return;
        }

        // Nota: El backend no tiene un endpoint específico para purchase history
        // Por ahora, usamos los cursos inscritos como historial de compras
        // TODO: Implementar endpoint específico para purchase history en el backend
        const { getUserEnrolledCourses } = await import("@shared/services/profileAPI");
        const enrolledCourses = await getUserEnrolledCourses(token);
        
        // Adaptar los datos de cursos inscritos a la estructura de PurchaseItem
        if (enrolledCourses && Array.isArray(enrolledCourses)) {
          const purchases: PurchaseItem[] = enrolledCourses.map((course: any, index: number) => {
            // Asegurar que siempre haya un ID único para evitar keys duplicadas
            const courseId = course._id || course.courseId || course.id || `course-${index}-${Date.now()}`;
            // Asegurar que el precio sea un número
            const price = typeof course.price === 'number' 
              ? course.price 
              : parseFloat(course.price) || 0;
            
            return {
              _id: courseId,
              courseName: course.courseName || '',
              courseDescription: course.courseDescription || '',
              thumbnail: course.thumbnail || '',
              price: price,
              purchaseDate: course.createdAt || course.purchaseDate || new Date().toISOString().split('T')[0],
              status: "Completed" as const,
              transactionId: course.transactionId || `TXN-${courseId}`,
              courseContent: course.courseContent || [],
            };
          });
          
          // Ordenar por fecha de compra (más recientes primero)
          purchases.sort((a, b) => {
            const dateA = new Date(a.purchaseDate).getTime();
            const dateB = new Date(b.purchaseDate).getTime();
            return dateB - dateA; // Orden descendente (más recientes primero)
          });
          
          setPurchases(purchases);
        }
      } catch (error) {
        console.error("Could not fetch purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    getPurchaseHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number | string | undefined | null): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      if (!isNaN(parsed)) {
        return parsed.toFixed(2);
      }
    }
    return '0.00';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <FiCheckCircle className="w-3.5 h-3.5" />
            Completado
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <FiClock className="w-3.5 h-3.5" />
            Pendiente
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            <FiXCircle className="w-3.5 h-3.5" />
            Reembolsado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-richblack-700 text-richblack-300 border border-richblack-600">
            {status}
          </span>
        );
    }
  };

  const handleCourseClick = async (purchase: PurchaseItem) => {
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
      console.error("Token is required to access course");
      return;
    }

    const courseId = purchase._id;

    // Intentar usar courseContent si está disponible
    if (purchase.courseContent?.[0]?._id) {
      const firstSection = purchase.courseContent[0];
      const sectionId = firstSection._id;
      
      // Manejar tanto subSection como subSections
      const subSections = firstSection.subSection || (firstSection as any).subSections;
      const firstSubSection = Array.isArray(subSections) && subSections.length > 0 ? subSections[0] : null;
      const subSectionId = firstSubSection?._id || (firstSubSection as any)?.id;

      if (sectionId && subSectionId) {
        router.push(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`
        );
        return;
      }
    }

    // Si no tenemos los IDs completos, cargar los datos del curso primero
    try {
      const { getFullDetailsOfCourse } = await import("@shared/services/courseDetailsAPI");
      const courseData = await getFullDetailsOfCourse(courseId, token);
      
      if (courseData?.courseDetails?.courseContent) {
        const courseContent = courseData.courseDetails.courseContent;
        const firstSec = courseContent[0];
        const secId = firstSec?._id || (firstSec as any)?.id;
        
        // Manejar tanto subSection como subSections
        const subs = firstSec?.subSection || (firstSec as any)?.subSections;
        const firstSub = Array.isArray(subs) && subs.length > 0 ? subs[0] : null;
        const subSecId = firstSub?._id || (firstSub as any)?.id;
        
        if (secId && subSecId) {
          router.push(
            `/view-course/${courseId}/section/${secId}/sub-section/${subSecId}`
          );
        } else {
          // Si no hay lecciones, navegar al curso de todas formas (vista de estudiante)
          router.push(`/view-course/${courseId}`);
        }
      } else {
        // Si no hay contenido, navegar al curso de todas formas (vista de estudiante)
        router.push(`/view-course/${courseId}`);
      }
    } catch (error) {
      console.error("Error loading course details:", error);
      // En caso de error, intentar navegar al curso de todas formas
      router.push(`/view-course/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5 mb-2">
            Mis Compras
          </h1>
          <p className="text-richblack-400 text-sm">
            {purchases && purchases.length > 0
              ? `${purchases.length} curso${purchases.length !== 1 ? "s" : ""} comprado${purchases.length !== 1 ? "s" : ""}`
              : "Gestiona tus compras y accede a tus cursos"}
          </p>
        </div>
      </div>

      {/* Content */}
      {!purchases ? (
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-12 text-center">
          <p className="text-richblack-300">Cargando...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="bg-richblack-800 rounded-xl border border-richblack-700 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-richblack-700 flex items-center justify-center">
              <FiDollarSign className="w-10 h-10 text-richblack-400" />
            </div>
            <h3 className="text-xl font-semibold text-richblack-5 mb-2">
              No hay compras aún
            </h3>
            <p className="text-richblack-400 mb-6">
              Tus compras aparecerán aquí cuando adquieras un curso.
            </p>
            <button
              onClick={() => router.push("/catalog")}
              className="px-6 py-3 bg-yellow-50 hover:bg-yellow-100 text-richblack-900 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              Explorar Cursos
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase._id}
              className="bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden hover:border-richblack-600 transition-all duration-200 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Course Image and Info */}
                  <div
                    className="flex gap-4 flex-1 cursor-pointer group"
                    onClick={() => handleCourseClick(purchase)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-richblack-900 border border-richblack-700 group-hover:border-yellow-50/30 transition-colors">
                        <Img
                          src={purchase.thumbnail}
                          alt={purchase.courseName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-richblack-5 mb-2 group-hover:text-yellow-50 transition-colors line-clamp-2">
                        {purchase.courseName}
                      </h3>
                      <p className="text-sm text-richblack-400 line-clamp-2 mb-3">
                        {purchase.courseDescription.length > 100
                          ? `${purchase.courseDescription.slice(0, 100)}...`
                          : purchase.courseDescription}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-richblack-500">
                        <FiExternalLink className="w-3.5 h-3.5" />
                        <span>Haz clic para ver el curso</span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Details */}
                  <div className="lg:w-80 flex flex-col gap-4 lg:border-l lg:border-richblack-700 lg:pl-6">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <FiDollarSign className="w-4 h-4 text-yellow-50" />
                      </div>
                      <div>
                        <p className="text-xs text-richblack-400">Precio</p>
                        <p className="text-lg font-bold text-yellow-50">
                          Rs. {formatPrice(purchase.price)}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <FiCalendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-richblack-400">Fecha</p>
                        <p className="text-sm font-medium text-richblack-300">
                          {formatDate(purchase.purchaseDate)}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <FiCheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-richblack-400 mb-1">Estado</p>
                        {getStatusBadge(purchase.status)}
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-lg bg-purple-500/10 mt-0.5">
                        <FiHash className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-richblack-400 mb-1">ID de Transacción</p>
                        <p className="text-xs font-mono text-richblack-400 break-all bg-richblack-900/50 px-2 py-1.5 rounded border border-richblack-700">
                          {purchase.transactionId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
