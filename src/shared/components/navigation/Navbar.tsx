"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../../store/hooks";
import { NavbarLinks } from "../../data/navbar-links";
import studyNotionLogo from "@shared/assets/Logo/logo2.svg";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { getImageUrl } from "../../utils/imageHelper";
import ProfileDropDown from "@modules/auth/components/ProfileDropDown";
import MobileProfileDropDown from "@modules/auth/components/MobileProfileDropDown";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import CatalogDropdown from "./CatalogDropdown";

interface SubLink {
  name: string;
  link?: string;
}

const Navbar = () => {
  const location = usePathname();
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const { totalItems } = useAppSelector((state) => state.cart);

  const [mounted, setMounted] = useState(false);
  const [subLinks, setSubLinks] = useState<SubLink[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSublinks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCourseCategories();
      setSubLinks(res);
    } catch (error) {
      console.error("Could not fetch the category list:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    fetchSublinks();

    const handleCategoriesUpdate = () => {
      fetchSublinks();
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, [mounted, fetchSublinks]);

  const matchRoute = useCallback((route: string | null | undefined) => {
    if (!route) return false;
    if (route.includes(":")) {
      const routePattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(location);
    }
    return location === route || location.startsWith(route + "/");
  }, [location]);

  const [showNavbar, setShowNavbar] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window === "undefined") return;

    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY) setShowNavbar("hide");
      else setShowNavbar("show");
    } else setShowNavbar("top");

    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  return (
    <nav
      className={`z-[10] flex h-14 w-full items-center justify-center border-b-[1px] border-b-richblack-700 text-white translate-y-0 transition-all ${showNavbar}`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link href="/">
          <Image
            src={getImageUrl(studyNotionLogo)}
            width={160}
            height={42}
            loading="lazy"
            alt="StudyNotion Logo"
            className="object-contain"
          />
        </Link>

        <ul className="hidden sm:flex gap-x-6 text-richblack-25">
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              {link.title === "Catalog" ? (
                <CatalogDropdown
                  subLinks={subLinks}
                  loading={loading}
                  isActive={matchRoute("/catalog/:catalogName")}
                />
              ) : (
                <Link href={link?.path || "/"}>
                  <p
                    className={`${
                      matchRoute(link?.path)
                        ? "bg-yellow-25 text-black"
                        : "text-richblack-25"
                    } rounded-xl p-1 px-3`}
                  >
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex gap-x-4 items-center">
          {mounted && (
            <>
              {user && user?.accountType !== "Instructor" && (
                <Link href="/dashboard/cart" className="relative">
                  <AiOutlineShoppingCart className="text-[2.35rem] text-richblack-5 hover:bg-richblack-700 rounded-full p-2 duration-200" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {token === null && (
                <Link href="/auth/login">
                  <button
                    className={`px-[12px] py-[8px] text-richblack-100 rounded-md ${
                      matchRoute("/auth/login")
                        ? "border-[2.5px] border-yellow-50"
                        : "border border-richblack-700 bg-richblack-800"
                    }`}
                  >
                    Log in
                  </button>
                </Link>
              )}
              {token === null && (
                <Link href="/auth/signup">
                  <button
                    className={`px-[12px] py-[8px] text-richblack-100 rounded-md ${
                      matchRoute("/auth/signup")
                        ? "border-[2.5px] border-yellow-50"
                        : "border border-richblack-700 bg-richblack-800"
                    }`}
                  >
                    Sign Up
                  </button>
                </Link>
              )}

              {token !== null && <ProfileDropDown />}
              {token !== null && <MobileProfileDropDown />}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

