"use client";
import React from "react";
import { useContactForm } from "../hooks/useContactForm";
import { CONTACT_TEXTS } from "../constants/contact.constants";
import CountryCodeDropdown from "./CountryCodeDropdown";

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    success,
    countryCodeSearch,
    showCountryDropdown,
    selectedCountryCode,
    countryDropdownRef,
    setCountryCodeSearch,
    setShowCountryDropdown,
    handleCountryCodeSelect,
    onSubmit,
  } = useContactForm();

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">
            {CONTACT_TEXTS.form.fields.firstname.label}
          </label>
          <input
            type="text"
            id="firstname"
            placeholder={CONTACT_TEXTS.form.fields.firstname.placeholder}
            className="form-style"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              {CONTACT_TEXTS.form.fields.firstname.error}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">
            {CONTACT_TEXTS.form.fields.lastname.label}
          </label>
          <input
            type="text"
            id="lastname"
            placeholder={CONTACT_TEXTS.form.fields.lastname.placeholder}
            className="form-style"
            {...register("lastname")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style">
          {CONTACT_TEXTS.form.fields.email.label}{" "}
          {CONTACT_TEXTS.form.fields.email.required && (
            <span className="text-pink-200">*</span>
          )}
        </label>
        <input
          type="email"
          id="email"
          placeholder={CONTACT_TEXTS.form.fields.email.placeholder}
          className="form-style"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {CONTACT_TEXTS.form.fields.email.error}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="lable-style">
          {CONTACT_TEXTS.form.fields.subject.label}
        </label>
        <input
          type="text"
          id="subject"
          placeholder={CONTACT_TEXTS.form.fields.subject.placeholder}
          className="form-style"
          {...register("subject")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
          {CONTACT_TEXTS.form.fields.phone.label}
        </label>

        <div className="flex gap-5">
          <CountryCodeDropdown
            selectedCountryCode={selectedCountryCode}
            countryCodeSearch={countryCodeSearch}
            showCountryDropdown={showCountryDropdown}
            countryDropdownRef={countryDropdownRef}
            onToggle={() => setShowCountryDropdown(!showCountryDropdown)}
            onSearchChange={setCountryCodeSearch}
            onSelect={handleCountryCodeSelect}
            register={register}
          />

          <div className="flex flex-1 flex-col gap-2">
            <input
              type="tel"
              id="phonenumber"
              placeholder={CONTACT_TEXTS.form.fields.phone.placeholder}
              className="form-style"
              {...register("phoneNo")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          {CONTACT_TEXTS.form.fields.message.label}{" "}
          {CONTACT_TEXTS.form.fields.message.required && (
            <span className="text-pink-200">*</span>
          )}
        </label>
        <textarea
          id="message"
          cols={30}
          rows={7}
          placeholder={CONTACT_TEXTS.form.fields.message.placeholder}
          className="form-style"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {CONTACT_TEXTS.form.fields.message.error}
          </span>
        )}
      </div>

      {success && (
        <div className="rounded-md bg-caribbeangreen-500/20 border border-caribbeangreen-500 px-4 py-3 text-sm text-caribbeangreen-200">
          {CONTACT_TEXTS.form.success.message}
        </div>
      )}

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        {loading
          ? CONTACT_TEXTS.form.button.submitting
          : CONTACT_TEXTS.form.button.submit}
      </button>
    </form>
  );
};

export default ContactUsForm;
