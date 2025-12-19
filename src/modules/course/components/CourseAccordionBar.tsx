import { useEffect, useRef, useState, useMemo } from "react";
import CourseSubSectionAccordion from "./CourseSubSectionAccordion";
import { IoMdArrowDropdown } from "react-icons/io";
import { CourseAccordionBarProps, SubSection } from "../types";

export default function CourseAccordionBar({
  course,
  isActive,
  handleActive,
}: CourseAccordionBarProps) {
  const contentEl = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState(0);

  // Calculate active state directly from props instead of using useState + useEffect
  const active = useMemo(
    () => isActive?.includes(course._id) ?? false,
    [isActive, course._id]
  );

  // Manejar tanto subSection como subSections (del backend)
  const subSectionsArray = useMemo(() => {
    // Log para depuración
    if (process.env.NODE_ENV === 'development') {
      console.log('CourseAccordionBar - Section data:', {
        sectionName: course?.sectionName,
        subSection: course?.subSection,
        subSections: (course as any)?.subSections,
        hasSubSection: !!course?.subSection,
        hasSubSections: !!(course as any)?.subSections,
      });
    }
    
    if (course.subSection && Array.isArray(course.subSection)) {
      return course.subSection;
    }
    if ((course as any).subSections && Array.isArray((course as any).subSections)) {
      return (course as any).subSections;
    }
    return [];
  }, [course]);

  useEffect(() => {
    // Use a callback to measure height after render
    const updateHeight = () => {
      if (contentEl.current) {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0);
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(updateHeight, 0);

    return () => clearTimeout(timeoutId);
  }, [active, subSectionsArray]);

  return (
    <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 hover:bg-richblack-600 text-richblack-5 last:mb-0 duration-200 ">
      <div>
        <div
          className={`flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]`}
          onClick={() => {
            handleActive(course._id);
          }}
        >
          <div className="flex items-center gap-2">
            <i
              className={
                isActive.includes(course._id)
                  ? "rotate-180 duration-300"
                  : "rotate-0 duration-300"
              }
            >
              <IoMdArrowDropdown size={25} />
            </i>
            <p>{course?.sectionName}</p>
          </div>
          <div className="space-x-4">
            <span className="text-yellow-25">
              {`${subSectionsArray.length} ${subSectionsArray.length === 1 ? 'lección' : 'lecciones'}`}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={contentEl}
        className={`relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
        style={{ height: sectionHeight }}
      >
        <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
          {subSectionsArray.length > 0 
            ? subSectionsArray.map((subSec: SubSection, i: number) => {
                return <CourseSubSectionAccordion subSec={subSec} key={i} />;
              })
            : (
              <div className="text-richblack-400 text-sm">
                No hay lecciones disponibles en esta sección
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
