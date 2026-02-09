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
      <h1 className="mb-14 text-4xl font-medium text-cem-neutral-gray-900 font-boogaloo text-center sm:text-left">
        {PROFILE_TEXTS.myProfile.title}
      </h1>

      <div className="flex items-center justify-between rounded-2xl border border-cem-neutral-gray-200 bg-cem-cardbackground p-8 px-3 sm:px-12 shadow-sm">
        <div className="flex items-center gap-x-4">
          <Img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[75px] rounded-full object-cover border-2 border-cem-neutral-gray-100"
          />
          <div className="space-y-1">
            <p className="text-xl font-bold text-cem-neutral-gray-900 capitalize">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm font-medium text-cem-neutral-gray-500">{user?.email}</p>
          </div>
        </div>

        <IconBtn
          text={PROFILE_TEXTS.myProfile.edit}
          onclick={() => {
            router.push(PROFILE_TEXTS.links.settings);
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-2xl border border-cem-neutral-gray-200 bg-cem-cardbackground p-8 px-7 sm:px-12 shadow-sm">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-bold text-cem-neutral-gray-900">{PROFILE_TEXTS.myProfile.sections.about}</p>
          <IconBtn
            text={PROFILE_TEXTS.myProfile.edit}
            onclick={() => {
              router.push(PROFILE_TEXTS.links.settings);
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <p
          className={`${user?.additionalDetails?.about
              ? "text-cem-neutral-gray-700"
              : "text-cem-neutral-gray-400"
            } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? PROFILE_TEXTS.myProfile.placeholders.about}
        </p>
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-2xl border border-cem-neutral-gray-200 bg-cem-cardbackground p-8 px-7 sm:px-12 shadow-sm">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-bold text-cem-neutral-gray-900">
            {PROFILE_TEXTS.myProfile.sections.personalDetails}
          </p>
          <IconBtn
            text={PROFILE_TEXTS.myProfile.edit}
            onclick={() => {
              router.push(PROFILE_TEXTS.links.settings);
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex max-w-[500px] justify-between ">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-tight">{PROFILE_TEXTS.myProfile.fields.firstName}</p>
              <p className="text-sm font-bold text-cem-neutral-gray-900 capitalize">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-tight">{PROFILE_TEXTS.myProfile.fields.accountType}</p>
              <p className="text-sm font-bold text-cem-neutral-gray-900 capitalize">
                {user?.accountType}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-tight">{PROFILE_TEXTS.myProfile.fields.email}</p>
              <p className="text-sm font-bold text-cem-neutral-gray-900">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-tight">{PROFILE_TEXTS.myProfile.fields.gender}</p>
              <p className="text-sm font-bold text-cem-neutral-gray-900">
                {user?.additionalDetails?.gender ?? PROFILE_TEXTS.myProfile.placeholders.gender}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-tight">{PROFILE_TEXTS.myProfile.fields.lastName}</p>
              <p className="text-sm font-bold text-cem-neutral-gray-900 capitalize">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-tight">{PROFILE_TEXTS.myProfile.fields.phoneNumber}</p>
              <p className="text-sm font-bold text-cem-neutral-gray-900">
                {user?.additionalDetails?.contactNumber ?? PROFILE_TEXTS.myProfile.placeholders.contactNumber}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-cem-neutral-gray-400 uppercase tracking-tight">{PROFILE_TEXTS.myProfile.fields.dateOfBirth}</p>
              <p className="text-sm font-bold text-cem-neutral-gray-900">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  PROFILE_TEXTS.myProfile.placeholders.dateOfBirth}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
