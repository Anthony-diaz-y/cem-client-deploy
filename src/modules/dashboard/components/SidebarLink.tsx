"use client";

import { useState, useEffect } from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { resetCourseState } from "@modules/course/store/courseSlice";
import { RootState } from "@shared/store/store";
import { setOpenSideMenu } from "../store/sidebarSlice";
import { SidebarLinkProps } from "../types";
import { DASHBOARD_TEXTS } from "../constants/dashboard.constants";

export default function SidebarLink({ link, iconName }: SidebarLinkProps) {
  const Icon = (
    Icons as Record<string, React.ComponentType<{ className?: string }>>
  )[iconName];
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { openSideMenu, screenSize } = useSelector(
    (state: RootState) => state.sidebar
  );

  const matchRoute = (route: string) => {
    if (!pathname) return false;
    if (route.includes(":")) {
      const routePattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    // Comparación exacta: solo activar si la ruta coincide exactamente
    // Esto evita que rutas padre se activen cuando estás en rutas hijas
    return pathname === route;
  };

  const handleClick = () => {
    dispatch(resetCourseState());
    if (openSideMenu && screenSize !== undefined && screenSize <= DASHBOARD_TEXTS.breakpoints.mobile)
      dispatch(setOpenSideMenu(false));
  };

  const isActive = matchRoute(link.path || "");

  // Usar className estático durante SSR para evitar diferencias
  const baseClasses =
    "relative px-8 py-4 text-[1.1rem] font-semibold transition-all flex items-center gap-x-4";
  const activeClasses = isActive
    ? "bg-[#DEF4FA] text-cem-primary shadow-sm"
    : "text-cem-neutral-gray-600 hover:bg-cem-neutral-gray-50 hover:text-cem-primary duration-200";

  return (
    <Link
      href={link.path || "#"}
      onClick={handleClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[4px] bg-cem-primary ${isActive ? "opacity-100" : "opacity-0"
          }`}
      ></span>

      <Icon className="text-[1.5rem]" />
      <span>{link.name}</span>
    </Link>
  );
}
