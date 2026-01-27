import React from "react";
import OtpInput from "../components/OtpInput";
import FormButton from "../components/FormButton";
import LoginLink from "../components/LoginLink";

interface VerifyOtpStepProps {
  email: string;
  otp: string;
  isLoading: boolean;
  onOtpChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResendOtp: () => void;
  onBack: () => void;
}

const VerifyOtpStep: React.FC<VerifyOtpStepProps> = ({
  email,
  otp,
  isLoading,
  onOtpChange,
  onSubmit,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center w-full mb-8">
        <h1 className="font-bold text-[2.25rem] leading-[2.75rem] text-[#333333] mb-4 m-0">
          Revisa tu correo
        </h1>
        <p className="text-base leading-6 text-gray-500 m-0">
          Te hemos enviado un código único a{" "}
          <span className="text-[#02819E] font-medium">{email}</span>
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col items-center gap-6 mb-8"
      >
        <OtpInput
          value={otp}
          onChange={onOtpChange}
          placeholder="Código de 6 carácteres"
          required
          disabled={isLoading}
        />

        <FormButton
          type="submit"
          disabled={otp.length !== 6}
          isLoading={isLoading}
        >
          {isLoading ? "Validando..." : "Validar"}
        </FormButton>
      </form>

      <div className="mt-auto pt-8">
        <LoginLink />
      </div>
    </div>
  );
};

export default VerifyOtpStep;
