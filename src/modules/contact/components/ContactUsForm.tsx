"use client";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

import CountryCode from "@shared/data/countrycode.json";
import { ContactFormData } from "../types";
import { sendContactMessage } from "@shared/services/contactAPI";
import { FaChevronDown } from "react-icons/fa";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countryCodeSearch, setCountryCodeSearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+51"); // Default: Perú
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    defaultValues: {
      countrycode: "+51",
    },
  });

  const submitContactForm = async (data: ContactFormData) => {
    try {
      setLoading(true);
      setSuccess(false);
      
      // Validar campos requeridos
      if (!data.firstname || !data.email || !data.message) {
        setLoading(false);
        return;
      }
      
      // Combinar firstname y lastname en name para el backend
      const name = `${data.firstname}${data.lastname ? ` ${data.lastname}` : ''}`.trim();
      
      // Preparar teléfono combinando código de país y número
      let phone: string | undefined = undefined;
      if (data.phoneNo && selectedCountryCode) {
        // Limpiar el número de teléfono (quitar espacios y caracteres especiales)
        const cleanPhone = data.phoneNo.replace(/\s+/g, "").trim();
        if (cleanPhone) {
          phone = `${selectedCountryCode} ${cleanPhone}`;
        }
      }

      // Preparar datos para el backend
      const contactData = {
        name,
        email: data.email,
        phone: phone || undefined, // Opcional
        subject: data.subject || undefined, // Opcional
        message: data.message,
      };

      const result = await sendContactMessage(contactData);
      
      // Si el resultado existe, el mensaje se envió exitosamente
      if (result) {
        setSuccess(true);
        // Limpiar formulario después de éxito
        setTimeout(() => {
          reset({
            email: "",
            firstname: "",
            lastname: "",
            message: "",
            phoneNo: "",
            countrycode: "+51",
            subject: "",
          });
          setSelectedCountryCode("+51");
          setCountryCodeSearch("");
          setSuccess(false); // Ocultar mensaje de éxito después de limpiar
        }, 3000); // Limpiar después de 3 segundos
      }
    } catch (error: unknown) {
      setSuccess(false);
      // El error ya se maneja en sendContactMessage con toast
    } finally {
      setLoading(false);
    }
  };

  // Filtrar códigos de país basado en la búsqueda
  const filteredCountryCodes = CountryCode.filter((country) => {
    const searchLower = countryCodeSearch.toLowerCase();
    return (
      country.code.toLowerCase().includes(searchLower) ||
      country.country.toLowerCase().includes(searchLower)
    );
  });

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sincronizar selectedCountryCode con el formulario
  useEffect(() => {
    setValue("countrycode", selectedCountryCode);
  }, [selectedCountryCode, setValue]);

  const handleCountryCodeSelect = (code: string) => {
    setSelectedCountryCode(code);
    setShowCountryDropdown(false);
    setCountryCodeSearch("");
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
        countrycode: "+51",
        subject: "",
      });
      setSelectedCountryCode("+51");
      setCountryCodeSearch("");
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter first name"
            className="form-style"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your name.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter last name"
            className="form-style"
            {...register("lastname")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style">
          Email Address <span className="text-pink-200">*</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          className="form-style"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Email address.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="lable-style">
          Subject (Optional)
        </label>
        <input
          type="text"
          id="subject"
          placeholder="Enter subject"
          className="form-style"
          {...register("subject")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
          Phone Number (Optional)
        </label>

        <div className="flex gap-5">
          <div className="flex w-[200px] flex-col gap-2 relative" ref={countryDropdownRef}>
            <div
              className="form-style cursor-pointer flex items-center justify-between"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            >
              <span className="text-richblack-200">
                {selectedCountryCode || "Seleccionar"}
              </span>
              <FaChevronDown
                className={`text-richblack-400 transition-transform ${
                  showCountryDropdown ? "rotate-180" : ""
                }`}
                size={12}
              />
            </div>
            {showCountryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-richblack-800 border border-richblack-700 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
                <input
                  type="text"
                  placeholder="Buscar código o país..."
                  value={countryCodeSearch}
                  onChange={(e) => setCountryCodeSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 bg-richblack-900 text-richblack-200 border-b border-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                />
                <div className="overflow-y-auto max-h-48 custom-scrollbar">
                  {filteredCountryCodes.length > 0 ? (
                    filteredCountryCodes.map((country, i) => (
                      <div
                        key={i}
                        onClick={() => handleCountryCodeSelect(country.code)}
                        className={`px-3 py-2 cursor-pointer hover:bg-richblack-700 text-richblack-200 text-sm ${
                          selectedCountryCode === country.code
                            ? "bg-richblack-700 text-yellow-50"
                            : ""
                        }`}
                      >
                        <span className="font-medium">{country.code}</span> -{" "}
                        {country.country}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-richblack-400 text-sm text-center">
                      No se encontraron resultados
                    </div>
                  )}
                </div>
              </div>
            )}
            <input
              type="hidden"
              {...register("countrycode")}
              value={selectedCountryCode}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <input
              type="tel"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style"
              {...register("phoneNo")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          Message <span className="text-pink-200">*</span>
        </label>
        <textarea
          id="message"
          cols={30}
          rows={7}
          placeholder="Enter your message here"
          className="form-style"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>

      {success && (
        <div className="rounded-md bg-caribbeangreen-500/20 border border-caribbeangreen-500 px-4 py-3 text-sm text-caribbeangreen-200">
          ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
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
        {loading ? "Enviando..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
