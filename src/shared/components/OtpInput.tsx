"use client";

import React, { useRef, useEffect, useState } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
  renderInput?: (props: any) => React.ReactElement;
  containerStyle?: React.CSSProperties;
}

/**
 * OtpInput - Componente nativo para entrada de código OTP
 * Reemplaza react-otp-input para evitar problemas de dependencias
 */
const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  numInputs = 6,
  renderInput,
  containerStyle,
}) => {
  const [otp, setOtp] = useState<string[]>(() => {
    // Inicializar con el valor actual o array vacío
    const initialValue = value || "";
    return initialValue.split("").slice(0, numInputs);
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sincronizar con el valor externo
  useEffect(() => {
    const newOtp = (value || "").split("").slice(0, numInputs);
    setOtp(newOtp);
  }, [value, numInputs]);

  const handleChange = (index: number, newValue: string) => {
    // Solo permitir números
    if (newValue && !/^\d$/.test(newValue)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    // Llamar onChange con el valor completo
    const otpString = newOtp.join("");
    onChange(otpString);

    // Auto-focus al siguiente input si hay un valor
    if (newValue && index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Manejar backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, numInputs);
    const pastedArray = pastedData.split("").filter((char) => /^\d$/.test(char));
    
    if (pastedArray.length > 0) {
      const newOtp = [...otp];
      pastedArray.forEach((char, i) => {
        if (index + i < numInputs) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      onChange(newOtp.join(""));
      
      // Focus en el siguiente input disponible
      const nextIndex = Math.min(index + pastedArray.length, numInputs - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const defaultInputProps = (index: number) => ({
    type: "text",
    inputMode: "numeric" as const,
    maxLength: 1,
    value: otp[index] || "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(index, e.target.value);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      handleKeyDown(index, e);
    },
    onPaste: handlePaste(index),
    ref: (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    placeholder: "-",
    style: {
      boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
    },
    className:
      "w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "0 6px",
        ...containerStyle,
      }}
    >
      {Array.from({ length: numInputs }).map((_, index) => {
        const inputProps = defaultInputProps(index);
        
        if (renderInput) {
          return <React.Fragment key={index}>{renderInput(inputProps)}</React.Fragment>;
        }
        
        return <input key={index} {...inputProps} />;
      })}
    </div>
  );
};

export default OtpInput;

