"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import { useRouter } from "next/navigation";

import useOnClickOutside from "@shared/hooks/useOnClickOutside";
import { Img } from "@shared/components";

import { logout } from "../services/authAPI";

import { VscSignOut, VscAccount } from "react-icons/vsc";
import { AiOutlineCaretDown } from "react-icons/ai";

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
        <AiOutlineCaretDown className="text-sm text-cem-neutral-gray-600" />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute min-w-[180px] top-[118%] right-0 z-[1000] overflow-hidden rounded-xl border border-cem-neutral-gray-200 bg-white shadow-lg"
          ref={ref}
        >
          <Link href="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-3 px-4 text-sm font-medium text-cem-neutral-gray-800 hover:bg-cem-teal-50 hover:text-cem-primary transition-colors">
              <VscAccount className="text-lg" />
              My Profile
            </div>
          </Link>

          <div
            onClick={() => {
              dispatch(logout(router.push));
              setOpen(false);
            }}
            className="flex w-full items-center gap-x-2 py-3 px-4 text-sm font-medium text-cem-neutral-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border-t border-cem-neutral-gray-200"
          >
            <VscSignOut className="text-lg" />
            Cerrar Sesión
          </div>

          {/* <CatalogDropDown subLinks={subLinks} /> */}
        </div>
      )}
    </button>
  );
}
