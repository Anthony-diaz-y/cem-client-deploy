"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";
import { useRouter } from "next/navigation";

import { ConfirmationModal, type ConfirmationModalData } from "@shared/components";
import { deleteProfile } from "@shared/services/SettingsAPI";
import { SETTINGS_TEXTS } from "../constants/settings.constants";

export default function DeleteAccount() {
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalData | null>(null);
  const [check, setCheck] = useState(false);

  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-6 sm:px-12">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>

        <div className="flex flex-col ">
          <h2 className="text-lg font-semibold text-richblack-5 ">
            {SETTINGS_TEXTS.deleteAccount.title}
          </h2>

          <div className="sm:w-3/5 text-pink-25 flex flex-col gap-3 mt-1">
            <p>{SETTINGS_TEXTS.deleteAccount.message}</p>
            <p>
              {SETTINGS_TEXTS.deleteAccount.warning}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 rounded-full form-style cursor-pointer"
              checked={check}
              onChange={() => setCheck((prev) => !prev)}
            />

            <button
              type="button"
              className="w-fit italic text-pink-300  "
              onClick={() =>
                check &&
                token &&
                setConfirmationModal({
                  text1: SETTINGS_TEXTS.deleteAccount.modal.title,
                  text2: SETTINGS_TEXTS.deleteAccount.modal.message,
                  btn1Text: SETTINGS_TEXTS.deleteAccount.modal.confirm,
                  btn2Text: SETTINGS_TEXTS.deleteAccount.modal.cancel,
                  btn1Handler: () =>
                    dispatch(
                      deleteProfile(token, (path: string) => router.push(path))
                    ),
                  btn2Handler: () => {
                    setConfirmationModal(null);
                    setCheck(false);
                  },
                })
              }
            >
              {SETTINGS_TEXTS.deleteAccount.checkboxLabel}
            </button>
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
