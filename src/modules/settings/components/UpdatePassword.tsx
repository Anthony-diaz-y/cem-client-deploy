"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { changePassword } from "@shared/services/SettingsAPI";
import { IconBtn } from "@shared/components";
import { RootState } from "@shared/store/store";
import { PasswordFormData } from "../types";
import { SETTINGS_TEXTS } from "../constants/settings.constants";

export default function UpdatePassword() {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>();

  const submitPasswordForm = async (data: PasswordFormData) => {
    // console.log("password Data - ", data)
    if (!token) return;
    try {
      await changePassword(token, data as unknown as Record<string, unknown>);
    } catch (error) {
      console.log("ERROR MESSAGE - ", (error as Error).message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-2xl border border-cem-neutral-gray-100 bg-cem-cardbackground p-8 px-6 sm:px-12 shadow-sm">
          <h2 className="text-2xl font-bold text-cem-neutral-gray-900">{SETTINGS_TEXTS.updatePassword.title}</h2>

          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Current Password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="oldPassword" className="lable-style">
                {SETTINGS_TEXTS.updatePassword.fields.currentPassword}
              </label>

              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder={SETTINGS_TEXTS.updatePassword.placeholders.currentPassword}
                className="form-style"
                {...register("oldPassword", { required: true })}
              />

              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#6b7280" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#6b7280" />
                )}
              </span>

              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                  {SETTINGS_TEXTS.updatePassword.validation.currentPasswordRequired}
                </span>
              )}
            </div>

            {/* new password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newPassword" className="lable-style">
                {SETTINGS_TEXTS.updatePassword.fields.newPassword}
              </label>

              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder={SETTINGS_TEXTS.updatePassword.placeholders.newPassword}
                className="form-style"
                {...register("newPassword", { required: true })}
              />

              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#6b7280" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#6b7280" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                  {SETTINGS_TEXTS.updatePassword.validation.newPasswordRequired}
                </span>
              )}
            </div>

            {/*confirm new password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="confirmNewPassword" className="lable-style">
                {SETTINGS_TEXTS.updatePassword.fields.confirmNewPassword}
              </label>

              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                placeholder={SETTINGS_TEXTS.updatePassword.placeholders.confirmNewPassword}
                className="form-style"
                {...register("confirmNewPassword", { required: true })}
              />

              <span
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#6b7280" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#6b7280" />
                )}
              </span>
              {errors.confirmNewPassword && (
                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                  {SETTINGS_TEXTS.updatePassword.validation.confirmNewPasswordRequired}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              router.push(SETTINGS_TEXTS.updatePassword.links.myProfile);
            }}
            className="cursor-pointer rounded-xl bg-cem-neutral-gray-100 py-2.5 px-6 font-bold text-cem-neutral-gray-700 hover:bg-cem-neutral-gray-200 border border-cem-neutral-gray-200 transition-all shadow-sm"
          >
            {SETTINGS_TEXTS.updatePassword.buttons.cancel}
          </button>
          <IconBtn type="submit" text={SETTINGS_TEXTS.updatePassword.buttons.update} />
        </div>
      </form>
    </>
  );
}
