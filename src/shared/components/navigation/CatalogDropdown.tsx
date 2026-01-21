"use client";

import Link from "next/link";
import { MdKeyboardArrowDown } from "react-icons/md";

interface SubLink {
  name: string;
  link?: string;
}

interface CatalogDropdownProps {
  subLinks: SubLink[];
  loading: boolean;
  isActive: boolean;
}

const CatalogDropdown = ({ subLinks, loading, isActive }: CatalogDropdownProps) => {
  return (
    <div
      className={`group relative flex cursor-pointer items-center gap-1 ${
        isActive
          ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
          : "text-richblack-25 rounded-xl p-1 px-3"
      }`}
    >
      <p>Catalog</p>
      <MdKeyboardArrowDown />
      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
        <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : subLinks.length ? (
          <>
            {subLinks.map((subLink, i) => (
              <Link
                href={`/catalog/${subLink.name
                  .split(" ")
                  .join("-")
                  .toLowerCase()}`}
                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                key={i}
              >
                <p>{subLink.name}</p>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-center">No Courses Found</p>
        )}
      </div>
    </div>
  );
};

export default CatalogDropdown;

