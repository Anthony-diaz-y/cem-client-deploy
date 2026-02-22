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
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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
            <span className="-mt-1 text-[12px] text-red-500 font-medium">
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
            <span className="text-red-500">*</span>
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
          <span className="-mt-1 text-[12px] text-red-500 font-medium">
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

        <div className="flex gap-4">
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

          <div className="flex flex-1 flex-col gap-1">
            <input
              type="tel"
              id="phonenumber"
              placeholder={CONTACT_TEXTS.form.fields.phone.placeholder}
              className="form-style w-full"
              {...register("phoneNo")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          {CONTACT_TEXTS.form.fields.message.label}{" "}
          {CONTACT_TEXTS.form.fields.message.required && (
            <span className="text-red-500">*</span>
          )}
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder={CONTACT_TEXTS.form.fields.message.placeholder}
          className="form-style resize-none"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-red-500 font-medium">
            {CONTACT_TEXTS.form.fields.message.error}
          </span>
        )}
      </div>

      {success && (
        <div className="rounded-xl bg-cem-teal-50 border border-cem-teal-200 px-4 py-3 text-sm text-cem-primary font-semibold text-center animate-fadeIn">
          {CONTACT_TEXTS.form.success.message}
        </div>
      )}

      <button
        disabled={loading}
        type="submit"
        className={`rounded-xl bg-cem-primary px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-cem-primary/20
         ${
           !loading &&
           "transition-all duration-300 hover:scale-[0.99] hover:bg-cem-primary-dark hover:shadow-xl active:scale-95"
         }  disabled:bg-cem-neutral-gray-300 disabled:shadow-none disabled:cursor-not-allowed`}
      >
        {loading
          ? CONTACT_TEXTS.form.button.submitting
          : CONTACT_TEXTS.form.button.submit}
      </button>
    </form>
  );
};

export default ContactUsForm;
