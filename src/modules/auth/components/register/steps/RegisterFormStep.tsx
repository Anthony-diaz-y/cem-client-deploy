import React, { useState } from "react";
import FormHeader from "../components/FormHeader";
import FormInput from "../components/FormInput";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import FormButton from "../components/FormButton";
import LoginLink from "../components/LoginLink";
import RegisterWarning from "../components/RegisterWarning";
import { RegisterFormData } from "../hooks/useRegisterForm";

interface RegisterFormStepProps {
  formData: RegisterFormData;
  isLoading: boolean;
  onInputChange: (field: keyof RegisterFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack?: () => void;
  isValidEmail: (email: string) => boolean;
  isValidPassword: (password: string) => boolean;
}

const RegisterFormStep: React.FC<RegisterFormStepProps> = ({
  formData,
  isLoading,
  onInputChange,
  onSubmit,
  onBack,
  isValidEmail,
  isValidPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    correo: boolean;
    contraseña: boolean;
  }>({
    correo: false,
    contraseña: false,
  });
  const [isNameConfirmed, setIsNameConfirmed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInputChange(name as keyof RegisterFormData, value);

    if (name === "correo" || name === "contraseña") {
      setTouchedFields((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const handleBlur = (field: "correo" | "contraseña") => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const isFormValid =
    formData.nombres.trim() &&
    isValidEmail(formData.correo) &&
    isValidPassword(formData.contraseña);

  const emailIsValid = formData.correo === "" || isValidEmail(formData.correo);
  const passwordIsValid =
    formData.contraseña === "" || isValidPassword(formData.contraseña);

  return (
    <div className="w-full flex flex-col items-center">
      <FormHeader title="Regístrate" subtitle="Ingresa los siguientes datos" />

      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col items-center gap-4"
      >
        <FormInput
          name="nombres"
          value={formData.nombres}
          onChange={handleInputChange}
          placeholder="Nombres"
          required
          disabled={isLoading}
        />

        <RegisterWarning />

        <EmailInput
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          onBlur={() => handleBlur("correo")}
          placeholder="Correo"
          required
          disabled={isLoading}
          isValid={emailIsValid}
          showValidationMessage={touchedFields.correo}
        />

        <PasswordInput
          name="contraseña"
          value={formData.contraseña}
          onChange={handleInputChange}
          onBlur={() => handleBlur("contraseña")}
          required
          disabled={isLoading}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword(!showPassword)}
          showValidationMessage={touchedFields.contraseña}
          isValid={passwordIsValid}
        />

        <div className="w-[296px] flex items-start gap-3 mt-2">
          <input
            type="checkbox"
            id="confirmName"
            checked={isNameConfirmed}
            onChange={(e) => setIsNameConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            disabled={isLoading}
          />
          <label
            htmlFor="confirmName"
            className="text-[11px] leading-tight text-gray-500 cursor-pointer select-none"
          >
            Confirmo que mi nombre es correcto y entiendo que se utilizará para
            la emisión de mis certificados.
          </label>
        </div>

        <div className="mt-2">
          <FormButton
            type="submit"
            disabled={!isFormValid || !isNameConfirmed}
            isLoading={isLoading}
          >
            {isLoading ? "Enviando código..." : "Regístrate"}
          </FormButton>
        </div>
      </form>

      {onBack && (
        <div className="mt-6">
          <FormButton
            type="button"
            variant="text"
            onClick={onBack}
            disabled={isLoading}
          >
            ← Volver
          </FormButton>
        </div>
      )}

      <div className="mt-8">
        <LoginLink />
      </div>
    </div>
  );
};

export default RegisterFormStep;
