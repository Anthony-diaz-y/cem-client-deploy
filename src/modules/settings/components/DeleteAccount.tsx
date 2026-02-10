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
      <div className="my-10 flex flex-row gap-x-5 rounded-2xl border-2 border-red-200 bg-red-50 p-8 px-6 sm:px-12 shadow-sm">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-red-100 border-2 border-red-200">
          <FiTrash2 className="text-3xl text-red-600" />
        </div>

        <div className="flex flex-col ">
          <h2 className="text-2xl font-bold text-red-700 ">
            {SETTINGS_TEXTS.deleteAccount.title}
          </h2>

          <div className="sm:w-3/5 text-red-700 flex flex-col gap-3 mt-2 font-medium">
            <p>{SETTINGS_TEXTS.deleteAccount.message}</p>
            <p className="font-bold">
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
              className="w-fit italic text-red-600 font-bold hover:text-red-800 transition-colors"
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
