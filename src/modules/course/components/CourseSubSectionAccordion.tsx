import { HiOutlineVideoCamera } from "react-icons/hi";
import { SubSection } from "../types";

function CourseSubSectionAccordion({ subSec }: { subSec: SubSection }) {
  return (
    <div>
      <div className="flex justify-between py-2">
        <div className={`flex items-center gap-2`}>
          <span>
            <HiOutlineVideoCamera />
          </span>
          <p>{subSec?.title}</p>
        </div>
      </div>
    </div>
  );
}

export default CourseSubSectionAccordion;
