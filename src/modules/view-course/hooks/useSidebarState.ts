import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Section, SubSection } from "../types";

/**
 * Custom hook for sidebar state management
 * Separates sidebar state logic from component
 */
export const useSidebarState = (courseSectionData: Section[]) => {
  const params = useParams();
  const sectionId = params?.sectionId as string;
  const subSectionId = params?.subSectionId as string;

  // Calculate initial values using useMemo
  const calculatedValues = useMemo(() => {
    if (!courseSectionData.length) {
      return { activeStatus: "", videoBarActive: "" };
    }

    const currentSectionIndx = courseSectionData.findIndex(
      (data: Section) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.subSection.findIndex((data: SubSection) => data._id === subSectionId);
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]
        ?._id;

    return {
      activeStatus: courseSectionData?.[currentSectionIndx]?._id || "",
      videoBarActive: activeSubSectionId || "",
    };
  }, [courseSectionData, sectionId, subSectionId]);

  // Initialize state with calculated values
  const [activeStatus, setActiveStatus] = useState(
    calculatedValues.activeStatus
  );
  const [videoBarActive, setVideoBarActive] = useState(
    calculatedValues.videoBarActive
  );

  // Update state asynchronously when calculated values change
  useEffect(() => {
    // Use queueMicrotask to avoid synchronous setState
    queueMicrotask(() => {
      setActiveStatus(calculatedValues.activeStatus);
      setVideoBarActive(calculatedValues.videoBarActive);
    });
  }, [calculatedValues.activeStatus, calculatedValues.videoBarActive]);

  return {
    activeStatus,
    videoBarActive,
    setActiveStatus,
    setVideoBarActive,
  };
};
