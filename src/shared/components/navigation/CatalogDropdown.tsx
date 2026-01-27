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
          ? "text-cem-primary-DEFAULT font-semibold"
          : "text-cem-neutral-gray-800 hover:text-cem-primary-DEFAULT"
      } transition-colors text-sm font-medium`}
    >
      <p>Cursos</p>
      <MdKeyboardArrowDown className="h-4 w-4" />
      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-white p-4 text-gray-700 shadow-lg border border-gray-200 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
        <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-white border-l border-t border-gray-200"></div>
        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : subLinks.length ? (
          <>
            {subLinks.map((subLink, i) => (
              <Link
                href={`/catalog/${subLink.name
                  .split(" ")
                  .join("-")
                  .toLowerCase()}`}
                className="rounded-lg bg-transparent py-3 pl-4 hover:bg-cem-teal-50 hover:text-cem-primary-DEFAULT transition-colors"
                key={i}
              >
                <p>{subLink.name}</p>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-center text-gray-500">No se encontraron cursos</p>
        )}
      </div>
    </div>
  );
};

export default CatalogDropdown;

