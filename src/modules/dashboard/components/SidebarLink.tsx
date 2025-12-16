"use client";

import { useState, useEffect } from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { resetCourseState } from "../../course/store/courseSlice";
import { RootState } from "../../../shared/store/store";
import { setOpenSideMenu } from "../store/sidebarSlice";
import { SidebarLinkProps } from '../types'

export default function SidebarLink({ link, iconName }: SidebarLinkProps) {
  const Icon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  const pathname = usePathname();
  const dispatch = useDispatch();
  // Initialize mounted state to false to ensure consistent SSR/client rendering
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { openSideMenu, screenSize } = useSelector((state: RootState) => state.sidebar);

  const matchRoute = (route: string) => {
    if (!mounted || !pathname) return false; // Evitar diferencias durante SSR
    if (route.includes(":")) {
      const routePattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route + "/");
  };

  const handleClick = () => {
    dispatch(resetCourseState());
    if (openSideMenu && screenSize !== undefined && screenSize <= 640) dispatch(setOpenSideMenu(false));
  };

  const isActive = mounted ? matchRoute(link.path) : false;

  // Usar className estático durante SSR para evitar diferencias
  const baseClasses = "relative px-8 py-2 text-sm font-medium transition-all flex items-center gap-x-2"
  const activeClasses = isActive
    ? "bg-yellow-800 text-yellow-50"
    : "text-richblack-300 hover:bg-richblack-700 duration-200"

  return (
    <Link
      href={link.path || "#"}
      onClick={handleClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${isActive ? "opacity-100" : "opacity-0"
          }`}
      ></span>

      <Icon className="text-lg" />
      <span>{link.name}</span>
    </Link>
  );
}
