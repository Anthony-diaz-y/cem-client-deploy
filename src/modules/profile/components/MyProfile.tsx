"use client";

import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@shared/store/store";

import { formattedDate } from "@shared/utils/dateFormatter";
import { IconBtn, Img } from "@shared/components";
import { PROFILE_TEXTS } from "../constants/profile.constants";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function MyProfile() {
  const { user } = useSelector((state: RootState) => state.profile);
  const router = useRouter();

  useScrollToTop();

  return (
    <>
      <h1 className="mb-14 text-5xl font-semibold text-cem-neutral-gray-900 font-boogaloo text-center sm:text-left">
        {PROFILE_TEXTS.myProfile.title}
      </h1>

      <div className="flex items-center justify-between rounded-2xl border border-cem-neutral-gray-200 bg-[#F8FDFE] p-8 px-5 sm:px-12 shadow-sm shadow-cem-neutral-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center gap-x-6">
          <Img
            src={user?.image}
            alt={`profile-${user?.name}`}
            className="aspect-square w-[85px] rounded-full object-cover border-4 border-white shadow-sm"
          />
          <div className="space-y-1">
            <p className="text-3xl font-semibold text-cem-neutral-gray-900 capitalize tracking-tight">
              {user?.name || "Usuario CEM"}
            </p>
            <p className="text-base font-medium text-cem-neutral-gray-500 opacity-80">{user?.email}</p>
          </div>
        </div>

        <IconBtn
          text={PROFILE_TEXTS.myProfile.edit}
          onclick={() => {
            router.push(PROFILE_TEXTS.links.settings);
          }}
          customClasses="rounded-2xl px-8"
        >
          <RiEditBoxLine size={20} />
        </IconBtn>
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-2xl border border-cem-neutral-gray-200 bg-[#F8FDFE] p-8 px-7 sm:px-12 shadow-sm shadow-cem-neutral-gray-100">
        <div className="flex w-full items-center justify-between">
          <p className="text-2xl font-semibold text-cem-neutral-gray-900 tracking-tight">{PROFILE_TEXTS.myProfile.sections.about}</p>
          <IconBtn
            text={PROFILE_TEXTS.myProfile.edit}
            onclick={() => {
              router.push(PROFILE_TEXTS.links.settings);
            }}
            customClasses="rounded-xl px-6 py-2"
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <p
          className={`${user?.additionalDetails?.biography
            ? "text-cem-neutral-gray-700"
            : "text-cem-neutral-gray-400"
            } text-lg font-medium leading-relaxed italic`}
        >
          {user?.additionalDetails?.biography ?? PROFILE_TEXTS.myProfile.placeholders.about}
        </p>
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-2xl border border-cem-neutral-gray-200 bg-[#F8FDFE] p-8 px-7 sm:px-12 shadow-sm shadow-cem-neutral-gray-100">
        <div className="flex w-full items-center justify-between">
          <p className="text-2xl font-semibold text-cem-neutral-gray-900 tracking-tight">
            {PROFILE_TEXTS.myProfile.sections.personalDetails}
          </p>
          <IconBtn
            text={PROFILE_TEXTS.myProfile.edit}
            onclick={() => {
              router.push(PROFILE_TEXTS.links.settings);
            }}
            customClasses="rounded-xl px-6 py-2"
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">
          <div className="flex flex-col gap-y-6">
            <div className="group">
              <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">{PROFILE_TEXTS.myProfile.fields.firstName}</p>
              <p className="text-lg font-semibold text-cem-neutral-gray-900 capitalize bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100">
                {user?.name || "Sin nombre"}
              </p>
            </div>
            <div className="group">
              <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">{PROFILE_TEXTS.myProfile.fields.accountType}</p>
              <p className="text-lg font-semibold text-cem-neutral-gray-900 capitalize bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100">
                {user?.accountType}
              </p>
            </div>
            <div className="group">
              <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">{PROFILE_TEXTS.myProfile.fields.email}</p>
              <p className="text-lg font-semibold text-cem-neutral-gray-900 bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-6">
            <div className="group">
              <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">{PROFILE_TEXTS.myProfile.fields.phoneNumber}</p>
              <p className="text-lg font-semibold text-cem-neutral-gray-900 bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100">
                {user?.additionalDetails?.contactNumber ?? PROFILE_TEXTS.myProfile.placeholders.contactNumber}
              </p>
            </div>
            <div className="group">
              <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">{PROFILE_TEXTS.myProfile.fields.gender}</p>
              <p className="text-lg font-semibold text-cem-neutral-gray-900 bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100">
                {user?.additionalDetails?.gender ?? PROFILE_TEXTS.myProfile.placeholders.gender}
              </p>
            </div>
            <div className="group">
              <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">{PROFILE_TEXTS.myProfile.fields.dateOfBirth}</p>
              <p className="text-lg font-semibold text-cem-neutral-gray-900 bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  PROFILE_TEXTS.myProfile.placeholders.dateOfBirth}
              </p>
            </div>
          </div>
        </div>

        {/* Social Networks Section - Only for Instructors */}
        {user?.accountType === "Instructor" && (
          <div className="mt-6 pt-10 border-t border-cem-neutral-gray-100">
            <p className="text-2xl font-semibold text-cem-neutral-gray-900 tracking-tight mb-8">
              Redes Académicas y Profesionales
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">
              <div className="flex flex-col gap-y-6">
                <div className="group">
                  <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                    {PROFILE_TEXTS.myProfile.fields.linkedin}
                  </p>
                  <p className="text-lg font-semibold text-cem-neutral-gray-900 bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100 overflow-hidden text-ellipsis">
                    {user?.additionalDetails?.linkedin || PROFILE_TEXTS.myProfile.placeholders.linkedin}
                  </p>
                </div>
                <div className="group">
                  <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                    {PROFILE_TEXTS.myProfile.fields.orcid}
                  </p>
                  <p className="text-lg font-semibold text-cem-neutral-gray-900 bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100 overflow-hidden text-ellipsis">
                    {user?.additionalDetails?.orcid || PROFILE_TEXTS.myProfile.placeholders.orcid}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-y-6">
                <div className="group">
                  <p className="mb-1 text-[11px] font-bold text-cem-neutral-gray-400 uppercase tracking-widest">
                    {PROFILE_TEXTS.myProfile.fields.cti_vitae}
                  </p>
                  <p className="text-lg font-semibold text-cem-neutral-gray-900 bg-white/50 p-3 rounded-xl border border-cem-neutral-gray-100 overflow-hidden text-ellipsis">
                    {user?.additionalDetails?.cti_vitae || PROFILE_TEXTS.myProfile.placeholders.cti_vitae}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
