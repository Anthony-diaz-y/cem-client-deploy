"use client";

import { useEffect, useState } from "react";

import { sidebarLinks } from "@shared/data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { Loading } from "@shared/components";

import { HiMenuAlt1 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

import { setOpenSideMenu, setScreenSize } from "../store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";
import { DASHBOARD_TEXTS } from "../constants/dashboard.constants";

export default function Sidebar() {
  const { user, loading: profileLoading } = useAppSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();



  // handle side bar menu - open / close
  // const [openSideMenu, setOpenSideMenu] = useState(false)
  // const [screenSize, setScreenSize] = useState(undefined)

  const { openSideMenu, screenSize } = useAppSelector((state) => state.sidebar);
  // console.log('openSideMenu ======' , openSideMenu)
  // console.log('screenSize ======' , screenSize)

  // 1. Efecto para manejar el tamaño de la pantalla
  useEffect(() => {
    // Al estar dentro de DashboardLayout que ya tiene guardia de 'mounted', 
    // sabemos que estamos en el cliente.
    const handleResize = () => {
      dispatch(setScreenSize(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    // Llamada asíncrona inicial para evitar el warning de "cascading renders"
    // al disparar una acción de Redux durante el ciclo de vida del mount.
    const timeout = setTimeout(handleResize, 0);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [dispatch]);

  // 2. Lógica de auto-apertura/cierre según el tamaño detectado
  useEffect(() => {
    if (screenSize === undefined) return;

    const isMobile = screenSize <= DASHBOARD_TEXTS.breakpoints.mobile;

    // Solo disparamos si el estado actual es diferente al deseado
    if (isMobile && openSideMenu) {
      dispatch(setOpenSideMenu(false));
    } else if (!isMobile && !openSideMenu) {
      dispatch(setOpenSideMenu(true));
    }
  }, [screenSize, dispatch, openSideMenu]); // openSideMenu incluido para reaccionar a cambios de tamaño correctamente

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-5rem)] min-w-[220px] items-center border-r border-cem-neutral-gray-100 bg-cem-cardbackground">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {/* Botón de menú móvil */}
      <div
        suppressHydrationWarning
        className={`sm:hidden text-cem-primary absolute left-7 top-3 cursor-pointer`}
        onClick={() => dispatch(setOpenSideMenu(!openSideMenu))}
      >
        {openSideMenu ? <IoMdClose size={33} /> : <HiMenuAlt1 size={33} />}
      </div>

      {/* Sidebar móvil: overlay cuando está abierto */}
      {screenSize !== undefined && screenSize <= DASHBOARD_TEXTS.breakpoints.mobile && openSideMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => dispatch(setOpenSideMenu(false))}
        />
      )}

      {/* Sidebar */}
      <div
        suppressHydrationWarning
        className={`${screenSize !== undefined && screenSize <= DASHBOARD_TEXTS.breakpoints.mobile
          ? openSideMenu
            ? "flex fixed left-0 top-20 z-50"
            : "hidden"
          : "hidden sm:flex"
          } min-h-[calc(100vh-5rem)] w-[300px] flex-col border-r border-cem-neutral-gray-200 bg-white py-10 flex-shrink-0 shadow-sm`}
      >
        <div className="flex flex-col mt-10">
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

        <div className="mx-auto mt-10 mb-8 h-[1px] w-10/12 bg-cem-neutral-gray-100" />

        <div className="flex flex-col">
          <SidebarLink
            link={{ name: DASHBOARD_TEXTS.sidebar.settings.name, path: DASHBOARD_TEXTS.sidebar.settings.path }}
            iconName={DASHBOARD_TEXTS.sidebar.settings.icon}
            setOpenSideMenu={setOpenSideMenu}
          />
        </div>
      </div>
    </>
  );
}
