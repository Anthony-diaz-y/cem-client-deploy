"use client";

import { useEffect, useState } from "react";

import { sidebarLinks } from "@shared/data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { Loading } from "@shared/components";

import { HiMenuAlt1 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

import { setOpenSideMenu, setScreenSize } from "../store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";

export default function Sidebar() {
  const { user, loading: profileLoading } = useAppSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Inicializar mounted como false para que el render inicial sea idéntico en servidor y cliente
  const [mounted, setMounted] = useState(false);

  // handle side bar menu - open / close
  // const [openSideMenu, setOpenSideMenu] = useState(false)
  // const [screenSize, setScreenSize] = useState(undefined)

  const { openSideMenu, screenSize } = useAppSelector((state) => state.sidebar);
  // console.log('openSideMenu ======' , openSideMenu)
  // console.log('screenSize ======' , screenSize)

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Marcar como montado solo en el cliente
    setMounted(true);

    const handleResize = () => dispatch(setScreenSize(window.innerWidth));

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // If screen size is small then close the side bar
  useEffect(() => {
    if (screenSize && screenSize <= 640) {
      dispatch(setOpenSideMenu(false));
    } else dispatch(setOpenSideMenu(true));
  }, [screenSize, dispatch]);

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* Botón de menú móvil - usar suppressHydrationWarning porque solo se muestra en móviles después del mount */}
      <div
        suppressHydrationWarning
        className={`sm:hidden text-white absolute left-7 top-3 cursor-pointer ${
          mounted ? "" : "hidden"
        }`}
        onClick={() => dispatch(setOpenSideMenu(!openSideMenu))}
      >
        {mounted && (openSideMenu ? <IoMdClose size={33} /> : <HiMenuAlt1 size={33} />)}
      </div>

      {/* Sidebar móvil: overlay cuando está abierto */}
      {mounted && screenSize !== undefined && screenSize <= 640 && openSideMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => dispatch(setOpenSideMenu(false))}
        />
      )}

      {/* Sidebar: visible en pantallas grandes siempre, en móviles solo si openSideMenu es true (después de montar) */}
      {/* Usar suppressHydrationWarning porque las clases cambian después del mount en móviles */}
      <div
        suppressHydrationWarning
        className={`${
          mounted && screenSize !== undefined && screenSize <= 640
            ? openSideMenu
              ? "flex fixed left-0 top-[3.5rem] z-50"
              : "hidden"
            : "hidden sm:flex"
        } h-[calc(100vh-3.5rem)] min-w-[220px] max-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10 flex-shrink-0`}
      >
        <div className="flex flex-col mt-6">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink
                key={link.id}
                link={link}
                iconName={link.icon}
                setOpenSideMenu={setOpenSideMenu}
              />
            );
          })}
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Configuración", path: "/dashboard/settings" }}
            iconName={"VscSettingsGear"}
            setOpenSideMenu={setOpenSideMenu}
          />
        </div>
      </div>
    </>
  );
}
