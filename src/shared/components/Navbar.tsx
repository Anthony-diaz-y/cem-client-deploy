"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../store/hooks";

import { NavbarLinks } from "../data/navbar-links";
import studyNotionLogo from "@shared/assets/Logo/logo2.svg";
import { fetchCourseCategories } from "@shared/services/courseDetailsAPI";
import { getImageUrl } from "../utils/imageHelper";

import ProfileDropDown from "@modules/auth/components/ProfileDropDown";
import MobileProfileDropDown from "@modules/auth/components/MobileProfileDropDown";

import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
  // console.log("Printing base url: ", process.env.NEXT_PUBLIC_BASE_URL);
  const location = usePathname();
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  // console.log('USER data from Navbar (store) = ', user)
  const { totalItems } = useAppSelector((state) => state.cart);

  interface SubLink {
    name: string;
    link?: string;
  }

  // Evitar errores de hidratación: solo renderizar contenido dependiente del estado después de montar
  const [mounted, setMounted] = useState(false);
  const [subLinks, setSubLinks] = useState<SubLink[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSublinks = async () => {
    try {
      setLoading(true);
      const res = await fetchCourseCategories();
      // const result = await apiConnector("GET", categories.CATEGORIES_API);
      // const result = await apiConnector('GET', 'http://localhost:4000/api/v1/course/showAllCategories');
      // console.log("Printing Sublinks result:", result);
      setSubLinks(res);
    } catch (error) {
      console.log("Could not fetch the category list = ", error);
    }
    setLoading(false);
  };

  // console.log('data of store  = ', useSelector((state)=> state))

  useEffect(() => {
    setMounted(true);
    fetchSublinks();
  }, []);

  // when user click Navbar link then it will hold yellow color
  const matchRoute = (route: string | null | undefined) => {
    if (!route) return false;
    if (route.includes(":")) {
      // Handle dynamic routes like /catalog/:catalogName
      const routePattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(location);
    }
    return location === route || location.startsWith(route + "/");
  };

  // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar
  const [showNavbar, setShowNavbar] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);

  // control Navbar
  const controlNavbar = () => {
    if (typeof window === "undefined") return;

    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY) setShowNavbar("hide");
      else setShowNavbar("show");
    } else setShowNavbar("top");

    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`z-[10] flex h-14 w-full items-center justify-center border-b-[1px] border-b-richblack-700 text-white translate-y-0 transition-all ${showNavbar} `}
    >
      {/* <nav className={` fixed flex items-center justify-center w-full h-16 z-[10] translate-y-0 transition-all text-white ${showNavbar}`}> */}
      <div className="flex w-11/12 max-w-maxContent items-center justify-between ">
        {/* logo */}
        <Link href="/">
          <img
            src={getImageUrl(studyNotionLogo)}
            width={160}
            height={42}
            loading="lazy"
            alt="StudyNotion Logo"
          />
        </Link>

        {/* Nav Links - visible for only large devices*/}
        <ul className="hidden sm:flex gap-x-6 text-richblack-25">
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              {link.title === "Catalog" ? (
                <div
                  className={`group relative flex cursor-pointer items-center gap-1 ${
                    matchRoute("/catalog/:catalogName")
                      ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
                      : "text-richblack-25 rounded-xl p-1 px-3"
                  }`}
                >
                  <p>{link.title}</p>
                  <MdKeyboardArrowDown />
                  {/* drop down menu */}
                  <div
                    className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                    flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                    group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                  >
                    <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                    {loading ? (
                      <p className="text-center ">Loading...</p>
                    ) : subLinks.length ? (
                      <>
                        {subLinks?.map((subLink, i) => (
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
              ) : (
                <Link href={link?.path || "/"}>
                  <p
                    className={`${
                      matchRoute(link?.path)
                        ? "bg-yellow-25 text-black"
                        : "text-richblack-25"
                    } rounded-xl p-1 px-3 `}
                  >
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Login/SignUp/Dashboard */}
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
                  {/* <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md focus:outline-8 outline-yellow-50'> */}
                  <button
                    className={` px-[12px] py-[8px] text-richblack-100 rounded-md 
                                         ${
                                           matchRoute("/auth/login")
                                             ? "border-[2.5px] border-yellow-50"
                                             : "border border-richblack-700 bg-richblack-800"
                                         } `}
                  >
                    Log in
                  </button>
                </Link>
              )}
              {token === null && (
                <Link href="/auth/signup">
                  {/* <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'> */}
                  <button
                    className={` px-[12px] py-[8px] text-richblack-100 rounded-md 
                                         ${
                                           matchRoute("/auth/signup")
                                             ? "border-[2.5px] border-yellow-50"
                                             : "border border-richblack-700 bg-richblack-800"
                                         } `}
                  >
                    Sign Up
                  </button>
                </Link>
              )}

              {/* for large devices */}
              {token !== null && <ProfileDropDown />}

              {/* for small devices */}
              {token !== null && <MobileProfileDropDown />}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
