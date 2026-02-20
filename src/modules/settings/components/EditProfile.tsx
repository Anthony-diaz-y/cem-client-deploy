"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { updateProfile } from "@shared/services/SettingsAPI";
import { IconBtn } from "@shared/components";
import { RootState, AppDispatch } from "@shared/store/store";
import { ProfileFormData } from "../types";
import { SETTINGS_TEXTS } from "../constants/settings.constants";

export default function EditProfile() {
    const { user } = useSelector((state: RootState) => state.profile);
    const { token } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>();

    // Sincronizar el formulario cuando los datos del usuario estén disponibles
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                dateOfBirth: user.additionalDetails?.dateOfBirth || "",
                gender: user.additionalDetails?.gender || "Male",
                contactNumber: user.additionalDetails?.contactNumber?.toString() || "",
                about: user.additionalDetails?.about || user.additionalDetails?.biography || "",
            });
        }
    }, [user, reset]);

    const submitProfileForm = async (data: ProfileFormData) => {
        if (!token) return;
        try {
            // Pasamos la función de navegación explícitamente
            dispatch(updateProfile(token, data, (path) => {
                router.push(path);
            }));
        } catch (error) {
            console.log("ERROR MESSAGE - ", (error as Error).message);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit(submitProfileForm)}>
                {/* Profile Information */}
                <div className="my-10 flex flex-col gap-y-6 rounded-2xl border border-cem-neutral-gray-100 bg-cem-cardbackground p-8 px-6 sm:px-12 shadow-sm">
                    <h2 className="text-2xl font-semibold text-cem-neutral-gray-900">
                        {SETTINGS_TEXTS.editProfile.title}
                    </h2>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="firstName" className="lable-style">
                                {SETTINGS_TEXTS.editProfile.fields.firstName}
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder={SETTINGS_TEXTS.editProfile.placeholders.firstName}
                                className="form-style"
                                {...register("firstName", { required: true })}
                                defaultValue={user?.firstName}
                            />
                            {errors.firstName && (
                                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                                    {SETTINGS_TEXTS.editProfile.validation.firstNameRequired}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="lastName" className="lable-style">
                                {SETTINGS_TEXTS.editProfile.fields.lastName}
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder={SETTINGS_TEXTS.editProfile.placeholders.lastName}
                                className="form-style"
                                {...register("lastName", { required: true })}
                                defaultValue={user?.lastName}
                            />
                            {errors.lastName && (
                                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                                    {SETTINGS_TEXTS.editProfile.validation.lastNameRequired}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="dateOfBirth" className="lable-style">
                                {SETTINGS_TEXTS.editProfile.fields.dateOfBirth}
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                className="form-style"
                                {...register("dateOfBirth", {
                                    required: {
                                        value: true,
                                        message: SETTINGS_TEXTS.editProfile.validation.dateOfBirthRequired,
                                    },
                                    max: {
                                        value: new Date().toISOString().split("T")[0],
                                        message: SETTINGS_TEXTS.editProfile.validation.dateOfBirthFuture,
                                    },
                                })}
                                defaultValue={user?.additionalDetails?.dateOfBirth}
                            />
                            {errors.dateOfBirth && (
                                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                                    {errors.dateOfBirth.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="gender" className="lable-style">
                                {SETTINGS_TEXTS.editProfile.fields.gender}
                            </label>
                            <select
                                id="gender"
                                className="form-style"
                                {...register("gender", { required: true })}
                                defaultValue={user?.additionalDetails?.gender}
                            >
                                {SETTINGS_TEXTS.editProfile.genders.map((ele, i) => {
                                    return (
                                        <option key={i} value={ele}>
                                            {ele}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.gender && (
                                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                                    {SETTINGS_TEXTS.editProfile.validation.genderRequired}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="contactNumber" className="lable-style">
                                {SETTINGS_TEXTS.editProfile.fields.contactNumber}
                            </label>
                            <input
                                type="tel"
                                id="contactNumber"
                                placeholder={SETTINGS_TEXTS.editProfile.placeholders.contactNumber}
                                className="form-style"
                                {...register("contactNumber", {
                                    required: {
                                        value: true,
                                        message: SETTINGS_TEXTS.editProfile.validation.contactNumberRequired,
                                    },
                                    maxLength: { value: 12, message: SETTINGS_TEXTS.editProfile.validation.contactNumberInvalid },
                                    minLength: { value: 10, message: SETTINGS_TEXTS.editProfile.validation.contactNumberInvalid },
                                })}
                                defaultValue={user?.additionalDetails?.contactNumber}
                            />
                            {errors.contactNumber && (
                                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                                    {errors.contactNumber.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="about" className="lable-style">
                                {SETTINGS_TEXTS.editProfile.fields.about}
                            </label>
                            <input
                                type="text"
                                id="about"
                                placeholder={SETTINGS_TEXTS.editProfile.placeholders.about}
                                className="form-style"
                                {...register("about", { required: true })}
                                defaultValue={user?.additionalDetails?.about}
                            />
                            {errors.about && (
                                <span className="-mt-1 text-[12px] text-red-500 font-medium">
                                    {SETTINGS_TEXTS.editProfile.validation.aboutRequired}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            router.push(SETTINGS_TEXTS.editProfile.links.myProfile);
                        }}
                        className="cursor-pointer rounded-xl bg-cem-neutral-gray-100 py-2.5 px-6 font-semibold text-cem-neutral-gray-700 hover:bg-cem-neutral-gray-200 border border-cem-neutral-gray-200 transition-all shadow-sm"
                    >
                        {SETTINGS_TEXTS.editProfile.buttons.cancel}
                    </button>
                    <IconBtn type="submit" text={SETTINGS_TEXTS.editProfile.buttons.save} />
                </div>
            </form>
        </>
    );
}
