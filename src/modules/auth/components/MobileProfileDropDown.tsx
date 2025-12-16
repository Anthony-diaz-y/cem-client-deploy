"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import { useRouter } from "next/navigation";

import useOnClickOutside from "../../../shared/hooks/useOnClickOutside";
import Img from "./../../../shared/components/Img";

import { logout } from "../services/authAPI";

import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { AiOutlineCaretDown, AiOutlineHome } from "react-icons/ai";
import { MdOutlineContactPhone } from "react-icons/md";
import { TbMessage2Plus } from "react-icons/tb";
import { PiNotebook } from "react-icons/pi";

// const CatalogDropDown = ({ subLinks }) => {
//     if (!subLinks) return

//     return (
//         <div>

//         </div>
//     )
// }

import { RootState, AppDispatch } from "../../../shared/store/store";

export default function MobileProfileDropDown() {
  const { user } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useOnClickOutside(ref, () => setOpen(false));

  if (!user) return null;
  // console.log('user data from store = ', user )

  return (
    // only for small devices

    <button className="relative sm:hidden" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <Img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className={"aspect-square w-[30px] rounded-full object-cover"}
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute min-w-[120px] top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-lg border-[1px] border-richblack-700 bg-richblack-800"
          ref={ref}
        >
          <Link href="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>

          <Link href="/" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 border-y border-richblack-700 ">
              <AiOutlineHome className="text-lg" />
              Home
            </div>
          </Link>

          <Link href="/" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100">
              <PiNotebook className="text-lg" />
              Catalog
            </div>
          </Link>

          <Link href="/about" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 border-y border-richblack-700 ">
              <TbMessage2Plus className="text-lg" />
              About Us
            </div>
          </Link>

          <Link href="/contact" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 ">
              <MdOutlineContactPhone className="text-lg" />
              Contact Us
            </div>
          </Link>

          <div
            onClick={() => {
              dispatch(logout(router.push));
              setOpen(false);
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>

          {/* <CatalogDropDown subLinks={subLinks} /> */}
        </div>
      )}
    </button>
  );
}
