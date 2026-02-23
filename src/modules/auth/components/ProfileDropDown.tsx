"use client";

import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscSignOut, VscAccount } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";

import Link from "next/link";
import { useRouter } from "next/navigation";

import useOnClickOutside from "@shared/hooks/useOnClickOutside";
import { logout } from "../services/authAPI";
import { Img } from "@shared/components";

export default function ProfileDropdown() {
  const { user } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  if (!user) return null;
  // console.log('user data from store = ', user )

  return (
    // only for large devices

    <button className="relative hidden sm:flex" onClick={() => setOpen(true)}>
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
          className="absolute top-[118%] right-0 z-[1000] overflow-hidden rounded-xl border border-cem-neutral-gray-200 bg-white shadow-lg min-w-[180px]"
          ref={ref}
        >
          <Link href="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-3 px-4 text-sm font-medium text-cem-neutral-gray-800 hover:bg-cem-teal-50 hover:text-cem-primary transition-colors">
              <VscAccount className="text-lg" />
              Mi Perfil
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
        </div>
      )}
    </button>
  );
}
