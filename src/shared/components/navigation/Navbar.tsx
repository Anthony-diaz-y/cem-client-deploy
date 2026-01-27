"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "../../store/hooks";
import { NavbarLinks } from "../../data/navbar-links";
import logoCEM from "@shared/assets/Logo/Logo-CEM.png";
import ProfileDropDown from "@modules/auth/components/ProfileDropDown";
import MobileProfileDropDown from "@modules/auth/components/MobileProfileDropDown";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
  const location = usePathname();
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.profile);
  const { totalItems } = useAppSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState("");

  const matchRoute = useCallback((route: string | null | undefined) => {
    if (!route) return false;
    if (route.includes(":")) {
      const routePattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(location);
    }
    return location === route || location.startsWith(route + "/");
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
      className={`z-[10] flex h-16 w-full items-center justify-center bg-cem-neutral-white border-b-cem-neutral-gray-200 translate-y-0 transition-all ${showNavbar}`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between gap-6">
        {/* Logo CEM */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Image 
            src={logoCEM} 
            alt="CEM Logo" 
            width={100} 
            height={40}
            className="object-contain h-10"
            priority
          />
        </Link>

        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full flex items-center bg-white border border-cem-neutral-gray-200 rounded-lg overflow-hidden">
            <div className="absolute left-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-cem-neutral-gray-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué quieres aprender?"
              className="w-full pl-10 pr-28 py-2.5 bg-transparent text-cem-neutral-gray-700 placeholder-cem-neutral-gray-500 focus:outline-none text-sm"
            />
            <button
              type="button"
              className="absolute right-2 flex items-center gap-1 px-3 py-1.5 bg-cem-teal-50 text-cem-primary rounded-md hover:bg-cem-teal-100 transition-colors text-sm font-medium"
            >
              Explora
              <MdKeyboardArrowDown className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Enlaces de navegación */}
        <ul className="hidden lg:flex gap-x-6 items-center flex-shrink-0 mr-8">
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              <Link href={link?.path || "/"}>
                <p
                className={`${
                  matchRoute(link?.path)
                    ? "text-cem-primary font-semibold"
                    : "text-cem-neutral-gray-800 hover:text-cem-primary"
                } transition-colors text-sm font-medium`}
                >
                  {link.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* Botones de autenticación / Usuario - Separados del resto */}
        <div className="flex items-center flex-shrink-0 ml-8">
          {user && user?.accountType !== "Instructor" && (
            <Link href="/dashboard/cart" className="relative mr-6">
              <AiOutlineShoppingCart className="text-2xl text-cem-neutral-gray-700 hover:text-cem-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-cem-primary text-center text-xs font-bold text-cem-neutral-white">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          
          {!token || token === null ? (
            <>
              <Link href="/auth/signup" className="mr-6">
                <span className="text-cem-neutral-gray-800 hover:text-cem-primary transition-colors text-sm font-medium cursor-pointer whitespace-nowrap">
                  Regístrate
                </span>
              </Link>
              <Link href="/auth/login">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg bg-cem-primary text-white font-medium text-sm"
                >
                  Acceder
                </button>
              </Link>
            </>
          ) : (
            <>
              <ProfileDropDown />
              <MobileProfileDropDown />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

