"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HiBookOpen, HiMagnifyingGlass } from "react-icons/hi2";
import { ProgressBar, Img } from "@shared/components";
import { Course, Section } from "../types";
import { RootState } from "@shared/store/store";
import { getUserEnrolledCourses } from "@shared/services/profileAPI";
import { getFullDetailsOfCourse } from "@shared/services/courseDetailsAPI";
import { formatTotalDuration } from "@shared/utils/durationHelper";
import { STUDENT_TEXTS } from "../constants/student.constants";

interface CourseWithId extends Course {
  id?: string;
}

interface SectionWithId extends Section {
  id?: string;
  subSections?: Section["subSection"];
}

interface SubSectionWithId {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

const CourseThumbnailSmall: React.FC<{
  thumbnail?: string;
  courseName?: string;
}> = ({ thumbnail, courseName }) => {
  if (!thumbnail) {
    return (
      <div className="h-14 w-14 rounded-lg overflow-hidden bg-cem-neutral-gray-100 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-cem-neutral-gray-50 to-cem-neutral-gray-100 text-cem-neutral-gray-400">
        <HiBookOpen size={20} className="opacity-60" />
      </div>
    );
  }

  return (
    <div className="h-14 w-14 rounded-lg overflow-hidden bg-cem-neutral-gray-100 relative flex-shrink-0">
      <Img
        src={thumbnail}
        alt={courseName || "course_img"}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

// Loading Skeleton Component - Isolated
const EnrolledCoursesSkeleton = () => {
  return (
    <div className="flex border border-cem-neutral-gray-200 px-5 py-3 w-full">
      <div className="flex flex-1 gap-x-4 ">
        <div className="h-14 w-14 rounded-lg skeleton "></div>

        <div className="flex flex-col w-[40%] ">
          <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
          <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
        </div>
      </div>

      <div className="flex flex-[0.4] flex-col ">
        <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
        <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
      </div>
    </div>
  );
};

const getCourseId = (course: CourseWithId): string | undefined => {
  return course.id || course._id;
};

const getSectionId = (section: SectionWithId): string | undefined => {
  return section.id || section._id;
};

const getSubSectionId = (subSection: SubSectionWithId): string | undefined => {
  return subSection.id || subSection._id;
};

const getSubSections = (section: SectionWithId): SubSectionWithId[] => {
  if (Array.isArray(section.subSections)) {
    return section.subSections;
  }
  if (Array.isArray(section.subSection)) {
    return section.subSection as SubSectionWithId[];
  }
  return [];
};

export default function EnrolledCourses() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const getEnrolledCourses = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getUserEnrolledCourses(token);

      if (res && Array.isArray(res)) {
        setEnrolledCourses(res as Course[]);
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error(STUDENT_TEXTS.errors.fetchEnrolledCourses, error);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getEnrolledCourses();
  }, [getEnrolledCourses, refreshKey]);

  // Recargar cursos cuando la página recibe foco (útil después de comprar)
  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        // Solo recargar si la página ha estado oculta por un tiempo
        setRefreshKey((prev) => prev + 1);
      }
    };

    // Escuchar evento personalizado para recargar cursos después de compra
    const handleCoursePurchased = () => {
      console.log(STUDENT_TEXTS.events.logPurchase);
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener(
      STUDENT_TEXTS.events.coursePurchased,
      handleCoursePurchased as EventListener,
    );

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener(
        STUDENT_TEXTS.events.coursePurchased,
        handleCoursePurchased as EventListener,
      );
    };
  }, [token]);

  const filteredAndSortedCourses = useMemo(() => {
    if (!enrolledCourses) return [];

    const filtered = enrolledCourses.filter((course) => {
      const matchesSearch = course.courseName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (filterStatus === "all") return matchesSearch;

      const isCompleted = (course.progressPercentage || 0) === 100;
      if (filterStatus === "completed") return matchesSearch && isCompleted;
      if (filterStatus === "pending")
        return (
          matchesSearch && !isCompleted && (course.progressPercentage || 0) > 0
        );

      return matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(
        (a as any).createdAt || (a as any)._id?.getTimestamp?.() || 0,
      ).getTime();
      const dateB = new Date(
        (b as any).createdAt || (b as any)._id?.getTimestamp?.() || 0,
      ).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [enrolledCourses, searchTerm, filterStatus, sortOrder]);

  return (
    <>
      <div className="text-4xl text-cem-neutral-gray-900 font-bold font-boogaloo text-center sm:text-left">
        {STUDENT_TEXTS.enrolledCourses.title}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-cem-cardbackground border border-cem-neutral-gray-100 rounded-lg w-fit shadow-sm">
          {(["all", "pending", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === status
                ? "bg-cem-primary text-white shadow-sm"
                : "text-cem-neutral-gray-500 hover:text-cem-primary"
                }`}
            >
              {STUDENT_TEXTS.enrolledCourses.filters[status]}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <input
              type="text"
              placeholder={
                STUDENT_TEXTS.enrolledCourses.filters.searchPlaceholder
              }
              className="w-full bg-cem-cardbackground text-cem-neutral-gray-900 rounded-full py-2 pl-10 pr-4 border border-cem-neutral-gray-200 focus:outline-none focus:border-cem-primary transition-colors text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <HiMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cem-neutral-gray-400"
              size={18}
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-cem-neutral-gray-500">
              {STUDENT_TEXTS.enrolledCourses.sort.label}:
            </span>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="bg-cem-cardbackground text-cem-neutral-gray-900 text-sm rounded-md px-3 py-1.5 border border-cem-neutral-gray-200 focus:outline-none focus:border-cem-primary cursor-pointer transition-colors shadow-sm"
            >
              <option value="newest">
                {STUDENT_TEXTS.enrolledCourses.sort.newest}
              </option>
              <option value="oldest">
                {STUDENT_TEXTS.enrolledCourses.sort.oldest}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="my-8 text-cem-neutral-gray-900 overflow-hidden rounded-2xl border border-cem-neutral-gray-100 shadow-sm bg-cem-cardbackground">
        {/* Headings */}
        <div className="flex bg-cem-neutral-gray-50 font-bold text-cem-neutral-gray-700 border-b border-cem-neutral-gray-100">
          <p className="w-[45%] px-5 py-4">
            {STUDENT_TEXTS.enrolledCourses.table.courseName}
          </p>
          <p className="w-1/4 px-2 py-4">
            {STUDENT_TEXTS.enrolledCourses.table.duration}
          </p>
          <p className="flex-1 px-2 py-4">
            {STUDENT_TEXTS.enrolledCourses.table.progress}
          </p>
        </div>

        {/* loading Skeleton */}
        {loading ? (
          <div>
            <EnrolledCoursesSkeleton />
            <EnrolledCoursesSkeleton />
            <EnrolledCoursesSkeleton />
            <EnrolledCoursesSkeleton />
            <EnrolledCoursesSkeleton />
          </div>
        ) : filteredAndSortedCourses.length === 0 ? (
          <div className="bg-cem-cardbackground p-12 text-center text-cem-neutral-gray-400">
            {searchTerm || filterStatus !== "all"
              ? "No se han encontrado cursos que coincidan con tu búsqueda."
              : STUDENT_TEXTS.enrolledCourses.emptyState}
          </div>
        ) : (
          filteredAndSortedCourses.map(
            (course: Course, i: number, arr: Course[]) => (
              <div
                className={`flex flex-col sm:flex-row sm:items-center border-b border-cem-neutral-gray-50 bg-cem-cardbackground last:border-b-0 transition-colors hover:bg-cem-neutral-gray-50/50`}
                key={i}
              >
                <div
                  className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-4"
                  onClick={async () => {
                    const courseWithId = course as CourseWithId;
                    const courseId = getCourseId(courseWithId);

                    if (!courseId) {
                      console.error(
                        STUDENT_TEXTS.errors.missingCourseId,
                        course,
                      );
                      return;
                    }

                    const firstSection = course.courseContent?.[0] as
                      | SectionWithId
                      | undefined;
                    const sectionId = firstSection
                      ? getSectionId(firstSection)
                      : undefined;

                    const subSections = firstSection
                      ? getSubSections(firstSection)
                      : [];
                    const firstSubSection =
                      subSections.length > 0 ? subSections[0] : null;
                    const subSectionId = firstSubSection
                      ? getSubSectionId(firstSubSection)
                      : undefined;

                    if (courseId && sectionId && subSectionId) {
                      router.push(
                        `/view-course/${courseId}/section/${sectionId}/sub-section/${subSectionId}`,
                      );
                    } else {
                      if (!token) {
                        console.error(STUDENT_TEXTS.errors.tokenRequired);
                        return;
                      }

                      try {
                        const courseData = await getFullDetailsOfCourse(
                          courseId,
                          token,
                        );

                        if (courseData?.courseDetails?.courseContent) {
                          const courseContent = courseData.courseDetails
                            .courseContent as SectionWithId[];
                          const firstSec = courseContent[0];
                          const secId = firstSec
                            ? getSectionId(firstSec)
                            : undefined;

                          const subs = firstSec ? getSubSections(firstSec) : [];
                          const firstSub = subs.length > 0 ? subs[0] : null;
                          const subSecId = firstSub
                            ? getSubSectionId(firstSub)
                            : undefined;

                          if (secId && subSecId) {
                            router.push(
                              `/view-course/${courseId}/section/${secId}/sub-section/${subSecId}`,
                            );
                          } else {
                            router.push(`/view-course/${courseId}`);
                          }
                        } else {
                          router.push(`/view-course/${courseId}`);
                        }
                      } catch (error) {
                        console.error(
                          STUDENT_TEXTS.errors.loadCourseDetails,
                          error,
                        );
                        router.push(`/view-course/${courseId}`);
                      }
                    }
                  }}
                >
                  {/* Imagen del curso - tamaño fijo y consistente */}
                  <CourseThumbnailSmall
                    thumbnail={course.thumbnail}
                    courseName={course.courseName}
                  />

                  <div className="flex max-w-xs flex-col gap-1.5">
                    <p className="font-bold text-cem-neutral-gray-900 group-hover:text-cem-primary transition-colors">{course.courseName}</p>
                    <p className="text-xs text-cem-neutral-gray-500 line-clamp-2">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>

                <div className="sm:hidden">
                  {(() => {
                    const totalDuration = course?.totalDuration;
                    const totalDurationNumber =
                      typeof totalDuration === "string"
                        ? isNaN(Number(totalDuration))
                          ? undefined
                          : Number(totalDuration)
                        : totalDuration;
                    return (
                      <div className="px-2 py-3">
                        {formatTotalDuration(totalDurationNumber)}
                      </div>
                    );
                  })()}

                  <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                    <p>
                      {STUDENT_TEXTS.enrolledCourses.table.progressLabel(
                        course.progressPercentage || 0,
                      )}
                    </p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </div>
                </div>

                {/* only for larger devices */}
                {/* duration -  progress */}
                <div className="hidden w-1/5 sm:flex px-2 py-3">
                  {(() => {
                    const totalDuration = course?.totalDuration;
                    const totalDurationNumber =
                      typeof totalDuration === "string"
                        ? isNaN(Number(totalDuration))
                          ? undefined
                          : Number(totalDuration)
                        : totalDuration;
                    return formatTotalDuration(totalDurationNumber);
                  })()}
                </div>
                <div className="hidden sm:flex w-1/5 flex-col gap-2 px-2 py-3">
                  <p>
                    {STUDENT_TEXTS.enrolledCourses.table.progressLabel(
                      course.progressPercentage || 0,
                    )}
                  </p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            ),
          )
        )}
      </div>
    </>
  );
}
