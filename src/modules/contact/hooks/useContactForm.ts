// Hook para manejar el estado y lógica del formulario de contacto
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ContactFormData } from "../types";
import { sendContactMessage, type ContactAPIFormData } from "../services/contactAPI";
import { CONTACT_TEXTS } from "../constants/contact.constants";

export interface UseContactFormReturn {
  // Form methods
  register: ReturnType<typeof useForm<ContactFormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<ContactFormData>>["handleSubmit"];
  errors: ReturnType<typeof useForm<ContactFormData>>["formState"]["errors"];
  
  // State
  loading: boolean;
  success: boolean;
  countryCodeSearch: string;
  showCountryDropdown: boolean;
  selectedCountryCode: string;
  countryDropdownRef: React.RefObject<HTMLDivElement | null>;
  
  // Actions
  setCountryCodeSearch: (value: string) => void;
  setShowCountryDropdown: (value: boolean) => void;
  handleCountryCodeSelect: (code: string) => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
}

export function useContactForm(): UseContactFormReturn {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countryCodeSearch, setCountryCodeSearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(CONTACT_TEXTS.form.countryCode.default);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    defaultValues: {
      countrycode: CONTACT_TEXTS.form.countryCode.default,
    },
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

  // Resetear formulario después de envío exitoso
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
        countrycode: CONTACT_TEXTS.form.countryCode.default,
        subject: "",
      });
      setSelectedCountryCode(CONTACT_TEXTS.form.countryCode.default);
      setCountryCodeSearch("");
    }
  }, [reset, isSubmitSuccessful]);

  const handleCountryCodeSelect = (code: string) => {
    setSelectedCountryCode(code);
    setShowCountryDropdown(false);
    setCountryCodeSearch("");
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      setLoading(true);
      setSuccess(false);

      // Validar campos requeridos
      if (!data.firstname || !data.email || !data.message) {
        setLoading(false);
        return;
      }

      // Combinar firstname y lastname en name para el backend
      const name = `${data.firstname}${data.lastname ? ` ${data.lastname}` : ""}`.trim();

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
      const contactData: ContactAPIFormData = {
        name,
        email: data.email,
        phone: phone || undefined,
        subject: data.subject || undefined,
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
            countrycode: CONTACT_TEXTS.form.countryCode.default,
            subject: "",
          });
          setSelectedCountryCode(CONTACT_TEXTS.form.countryCode.default);
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

  return {
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
  };
}


