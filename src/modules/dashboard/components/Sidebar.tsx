'use client'

import { useEffect, useState } from "react"
import { VscSignOut } from "react-icons/vsc"


import { useRouter } from "next/navigation"

import { sidebarLinks } from './../../../shared/data/dashboard-links';
import { logout } from "../../auth/services/authAPI"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import SidebarLink from "./SidebarLink"
import Loading from './../../../shared/components/Loading';

import { HiMenuAlt1 } from 'react-icons/hi'
import { IoMdClose } from 'react-icons/io'

import { setOpenSideMenu, setScreenSize } from "../store/sidebarSlice";
import { useAppDispatch, useAppSelector } from "../../../shared/store/hooks"

interface ConfirmationModalData {
  text1: string
  text2: string
  btn1Text: string
  btn2Text: string
  btn1Handler: () => any
  btn2Handler: () => any
}

export default function Sidebar() {
  const { user, loading: profileLoading } = useAppSelector((state) => state.profile)
  const { loading: authLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalData | null>(null)

  // Evitar errores de hidratación: solo renderizar contenido dependiente del estado después de montar
  const [mounted, setMounted] = useState(false)

  // handle side bar menu - open / close
  // const [openSideMenu, setOpenSideMenu] = useState(false)
  // const [screenSize, setScreenSize] = useState(undefined)

  const { openSideMenu, screenSize } = useAppSelector((state) => state.sidebar)
  // console.log('openSideMenu ======' , openSideMenu)
  // console.log('screenSize ======' , screenSize)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return;

    const handleResize = () => dispatch(setScreenSize(window.innerWidth))

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // If screen size is small then close the side bar
  useEffect(() => {
    if (screenSize && screenSize <= 640) {
      dispatch(setOpenSideMenu(false))
    }
    else dispatch(setOpenSideMenu(true))
  }, [screenSize])



  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <Loading />
      </div>
    )
  }

  return (
    <>
      {mounted && (
        <div className="sm:hidden text-white absolute left-7 top-3 cursor-pointer " onClick={() => dispatch(setOpenSideMenu(!openSideMenu))}>
          {
            openSideMenu ? <IoMdClose size={33} /> : <HiMenuAlt1 size={33} />
          }
        </div>
      )}


      {/* Sidebar: visible en pantallas grandes siempre, en móviles solo si openSideMenu es true (después de montar) */}
      <div className={`hidden sm:flex ${mounted && screenSize && screenSize <= 640 ? (openSideMenu ? 'flex' : 'hidden') : ''} h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10`}>
        <div className="flex flex-col mt-6">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} setOpenSideMenu={setOpenSideMenu} />
            )
          })}
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName={"VscSettingsGear"}
            setOpenSideMenu={setOpenSideMenu}
          />

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure ?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(router.push)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className=" "
          >
            <div className="flex items-center gap-x-2 px-8 py-2 text-sm font-medium text-richblack-300 hover:bg-richblack-700 relative">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>

        </div>
      </div>


      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}