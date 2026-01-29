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


  // Evita hydration mismatch:
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthed = mounted && Boolean(token);
  const canShowCart = mounted && user && user?.accountType !== "Instructor";
  const cartCount = mounted ? totalItems : 0;

  const matchRoute = useCallback(
    (route: string | null | undefined) => {
      if (!route) return false;
      if (route.includes(":")) {
        const routePattern = route.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(location);
      }
      return location === route || location.startsWith(route + "/");
    },
    [location],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}&page=1`);
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

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`z-[100] flex h-16 w-full items-center justify-center bg-cem-neutral-white border-b-cem-neutral-gray-200 translate-y-0 transition-all ${showNavbar}`}
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

          {/* Barra de búsqueda - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-sm mx-4"
          >
            <div className="relative w-full flex items-center bg-cem-neutral-gray-50 border border-cem-neutral-gray-200 rounded-lg overflow-hidden">
              <div className="absolute left-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-cem-neutral-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué quieres aprender?"
                className="w-full pl-10 pr-28 py-2.5 bg-transparent text-cem-neutral-gray-700 placeholder-cem-neutral-gray-400 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 flex items-center gap-1 px-3 py-1.5 bg-cem-teal-50 text-cem-primary rounded-md hover:bg-cem-teal-100 transition-colors text-sm font-medium"
              >
                Explora
                <MdKeyboardArrowDown className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Elementos Mobile - Búsqueda, Acceder, Hamburguesa */}
          <div className="md:hidden flex items-center gap-3 ml-auto">
            {/* Ícono de búsqueda - Mobile */}
            <button className="flex items-center justify-center p-2 hover:bg-cem-neutral-gray-50 rounded-md transition-colors">
              <FiSearch className="h-6 w-6 text-cem-neutral-gray-500" />
            </button>

            {/* Usuario - Mobile */}
            {isAuthed && <MobileProfileDropDown />}

            {/* Botón Acceder - Mobile */}
            {!isAuthed && (
              <Link href="/auth/login">
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-cem-primary text-white font-medium text-sm hover:bg-cem-primary-dark transition-colors whitespace-nowrap"
                >
                  Acceder
                </button>
              </Link>
            )}

            {/* Menú hamburguesa - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center p-2 hover:bg-cem-neutral-gray-50 rounded-md transition-colors"
            >
              <svg
                className="w-6 h-6 text-cem-neutral-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Enlaces de navegación - Desktop */}
          <ul className="hidden lg:flex gap-x-6 items-center flex-shrink-0 mr-8">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                <Link href={link?.path || "/"}>
                  <p
                    className={`${matchRoute(link?.path)
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

          {/* Botones de autenticación / Usuario - Desktop */}
          <div className="hidden md:flex items-center flex-shrink-0 ml-8">
            {canShowCart && (
              <Link href="/dashboard/cart" className="relative mr-6">
                <AiOutlineShoppingCart className="text-2xl text-cem-neutral-gray-700 hover:text-cem-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-cem-primary text-center text-xs font-bold text-cem-neutral-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {!isAuthed ? (
              <>
                <Link
                  href="/auth/signup"
                  className="mr-6 hidden md:inline-block"
                >
                  <span className="text-cem-neutral-gray-800 hover:text-cem-primary transition-colors text-sm font-medium cursor-pointer whitespace-nowrap">
                    Regístrate
                  </span>
                </Link>
                <Link href="/auth/login">
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-lg bg-cem-primary text-white font-medium text-sm hover:bg-cem-primary-dark transition-colors"
                  >
                    Acceder
                  </button>
                </Link>
              </>
            ) : (
              <>
                <ProfileDropDown />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Outside nav to cover entire page */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in - Outside nav to cover entire page */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-cem-neutral-gray-200">
            <h2 className="text-lg font-bold text-cem-neutral-gray-900">
              Menú
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-cem-neutral-gray-50 rounded-md transition-colors"
            >
              <svg
                className="w-6 h-6 text-cem-neutral-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-4 px-4">
            {NavbarLinks.map((link, index) => (
              <Link
                key={index}
                href={link?.path || "/"}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className={`px-4 py-3 rounded-lg mb-2 transition-colors ${matchRoute(link?.path) ? "bg-cem-teal-50 text-cem-primary font-semibold" : "text-cem-neutral-gray-700 hover:bg-cem-neutral-gray-50"}`}
                >
                  {link.title}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
