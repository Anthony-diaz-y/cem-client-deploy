"use client";

import { useEffect, useState } from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import { useRouter } from "next/router";

import { resetCourseState } from "../../course/store/courseSlice";
import { RootState } from "../../../shared/store/store";
import { setOpenSideMenu } from "../store/sidebarSlice";

interface SidebarLinkProps {
  link: {
    id?: string | number;
    name: string;
    path: string;
    type?: string;
  };
  iconName: string;
  setOpenSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarLink({ link, iconName }: SidebarLinkProps) {
  const Icon = (Icons as any)[iconName];
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  const { openSideMenu, screenSize } = useSelector((state: RootState) => state.sidebar);

  useEffect(() => {
    setMounted(true);
  }, []);

  const matchRoute = (route: string) => {
    if (!mounted) return false; // Evitar diferencias durante SSR
    if (route.includes(":")) {
      const routePattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(router.asPath);
    }
    return router.asPath === route || router.asPath.startsWith(route + "/");
  };

  const handleClick = () => {
    dispatch(resetCourseState());
    if (openSideMenu && screenSize !== undefined && screenSize <= 640) dispatch(setOpenSideMenu(false));
  };

  const isActive = matchRoute(link.path);

  // Usar className estático durante SSR para evitar diferencias
  const baseClasses = "relative px-8 py-2 text-sm font-medium transition-all"
  const activeClasses = mounted && isActive
    ? "bg-yellow-800 text-yellow-50"
    : "text-richblack-300 hover:bg-richblack-700 duration-200"

  return (
    <Link
      href={link.path || "#"}
      legacyBehavior
      passHref
    >
      <a
        onClick={handleClick}
        className={`${baseClasses} ${activeClasses}`}
        suppressHydrationWarning
      >
        <span
          className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${isActive ? "opacity-100" : "opacity-0"
            }`}
        ></span>

        <div className="flex items-center gap-x-2">
          <Icon className="text-lg" />
          <span>{link.name}</span>
        </div>
      </a>
    </Link>
  );
}
