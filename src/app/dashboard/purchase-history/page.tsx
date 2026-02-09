"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Img, Loading } from "@shared/components";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiExternalLink,
  FiCalendar,
  FiDollarSign,
  FiHash,
} from "react-icons/fi";

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
        if (typeof window !== "undefined") {
          const tokenStr = localStorage.getItem("token");
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
        const { getUserEnrolledCourses } =
          await import("@shared/services/profileAPI");
        const enrolledCourses = await getUserEnrolledCourses(token);

        // Adaptar los datos de cursos inscritos a la estructura de PurchaseItem
        if (enrolledCourses && Array.isArray(enrolledCourses)) {
          const purchases: PurchaseItem[] = enrolledCourses.map(
            (course: any, index: number) => {
              // Asegurar que siempre haya un ID único para evitar keys duplicadas
              const courseId =
                course._id ||
                course.courseId ||
                course.id ||
                `course-${index}-${Date.now()}`;
              // Asegurar que el precio sea un número
              const price =
                typeof course.price === "number"
                  ? course.price
                  : parseFloat(course.price) || 0;

              return {
                _id: courseId,
                courseName: course.courseName || "",
                courseDescription: course.courseDescription || "",
                thumbnail: course.thumbnail || "",
                price: price,
                purchaseDate:
                  course.createdAt ||
                  course.purchaseDate ||
                  new Date().toISOString().split("T")[0],
                status: "Completed" as const,
                transactionId: course.transactionId || `TXN-${courseId}`,
                courseContent: course.courseContent || [],
              };
            },
          );

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
    if (typeof price === "number") {
      return price.toFixed(2);
    }
    if (typeof price === "string") {
      const parsed = parseFloat(price);
      if (!isNaN(parsed)) {
        return parsed.toFixed(2);
      }
    }
    return "0.00";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cem-teal-50 text-cem-primary border border-cem-teal-100">
            <FiCheckCircle className="w-3 h-3" />
            Completado
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-600 border border-yellow-100">
            <FiClock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
            <FiXCircle className="w-3 h-3" />
            Reembolsado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cem-neutral-gray-50 text-cem-neutral-gray-500 border border-cem-neutral-gray-100">
            {status}
          </span>
        );
    }
  };

  const handleCourseClick = async (purchase: PurchaseItem) => {
    // Obtener token del localStorage
    let token: string | null = null;
    if (typeof window !== "undefined") {
      const tokenStr = localStorage.getItem("token");
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
      const subSections =
        firstSection.subSection || (firstSection as any).subSections;
      const firstSubSection =
        Array.isArray(subSections) && subSections.length > 0
          ? subSections[0]
          : null;
      const subSectionId = firstSubSection?._id || (firstSubSection as any)?.id;

      if (sectionId && subSectionId) {
        router.push(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`,
        );
        return;
      }
    }

    // Si no tenemos los IDs completos, cargar los datos del curso primero
    try {
      const { getFullDetailsOfCourse } =
        await import("@shared/services/courseDetailsAPI");
      const courseData = await getFullDetailsOfCourse(courseId, token);

      if (courseData?.courseDetails?.courseContent) {
        const courseContent = courseData.courseDetails.courseContent;
        const firstSec = courseContent[0];
        const secId = firstSec?._id || (firstSec as any)?.id;

        // Manejar tanto subSection como subSections
        const subs = firstSec?.subSection || (firstSec as any)?.subSections;
        const firstSub =
          Array.isArray(subs) && subs.length > 0 ? subs[0] : null;
        const subSecId = firstSub?._id || (firstSub as any)?.id;

        if (secId && subSecId) {
          router.push(
            `/view-course/${courseId}/section/${secId}/sub-section/${subSecId}`,
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
          <h1 className="text-4xl font-bold text-cem-neutral-gray-900 mb-2 font-boogaloo">
            Mis Compras
          </h1>
          <p className="text-cem-neutral-gray-500 text-sm font-medium">
            {purchases && purchases.length > 0
              ? `${purchases.length} curso${purchases.length !== 1 ? "s" : ""} comprado${purchases.length !== 1 ? "s" : ""}`
              : "Gestiona tus compras y accede a tus cursos"}
          </p>
        </div>
      </div>

      {/* Content */}
      {!purchases ? (
        <div className="bg-cem-cardbackground rounded-2xl border border-cem-neutral-gray-100 p-12 text-center shadow-sm">
          <p className="text-cem-neutral-gray-400 font-medium">Cargando compras...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="bg-cem-cardbackground rounded-2xl border border-cem-neutral-gray-100 p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cem-neutral-gray-50 flex items-center justify-center border border-cem-neutral-gray-100">
              <FiDollarSign className="w-10 h-10 text-cem-primary/40" />
            </div>
            <h3 className="text-2xl font-bold text-cem-neutral-gray-900 mb-2">
              No hay compras aún
            </h3>
            <p className="text-cem-neutral-gray-500 mb-8">
              Tus compras aparecerán aquí cuando adquieras un curso.
            </p>
            <button
              onClick={() => router.push("/courses")}
              className="px-8 py-3 bg-cem-primary hover:bg-cem-primary-dark text-white rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cem-primary/20"
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
              className="bg-cem-cardbackground rounded-2xl border border-cem-neutral-gray-100 overflow-hidden hover:border-cem-primary/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group/card"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Course Image and Info */}
                  <div
                    className="flex flex-col sm:flex-row gap-6 flex-1 cursor-pointer group"
                    onClick={() => handleCourseClick(purchase)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-40 h-24 sm:w-48 sm:h-28 rounded-xl overflow-hidden bg-cem-neutral-gray-100 border border-cem-neutral-gray-100 group-hover:border-cem-primary/20 transition-all shadow-inner">
                        <Img
                          src={purchase.thumbnail}
                          alt={purchase.courseName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-cem-neutral-gray-900 mb-2 group-hover:text-cem-primary transition-colors line-clamp-2">
                        {purchase.courseName}
                      </h3>
                      <p className="text-sm text-cem-neutral-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {purchase.courseDescription}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-cem-primary uppercase tracking-tight">
                        <FiExternalLink className="w-3.5 h-3.5" />
                        <span>Ir al curso</span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Details */}
                  <div className="lg:w-72 flex flex-col gap-5 lg:border-l lg:border-cem-neutral-gray-100 lg:pl-8">
                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cem-teal-50 text-cem-primary">
                        <FiDollarSign size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-tight">Precio</p>
                        <p className="text-xl font-black text-cem-primary">
                          S/ {formatPrice(purchase.price)}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cem-neutral-gray-50 text-cem-neutral-gray-400">
                        <FiCalendar size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-tight">Fecha</p>
                        <p className="text-sm font-bold text-cem-neutral-gray-700">
                          {formatDate(purchase.purchaseDate)}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cem-neutral-gray-50 text-cem-neutral-gray-400">
                        <FiCheckCircle size={18} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-tight">
                          Estado
                        </p>
                        {getStatusBadge(purchase.status)}
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-cem-neutral-gray-50 text-cem-neutral-gray-400 mt-0.5">
                        <FiHash size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-tight mb-1">
                          ID de Transacción
                        </p>
                        <p className="text-[10px] font-mono text-cem-neutral-gray-500 break-all bg-cem-neutral-gray-50 px-3 py-2 rounded-lg border border-cem-neutral-gray-100">
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
