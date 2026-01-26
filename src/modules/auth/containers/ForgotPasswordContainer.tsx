"use client";

import OpenRoute from "../components/OpenRoute";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { useForgotPassword } from "../hooks/useForgotPassword";

function ForgotPasswordContainer() {
  const {
    email,
    emailSent,
    loading,
    setEmail,
    handleOnSubmit,
  } = useForgotPassword();

  return (
    <OpenRoute>
      <ForgotPasswordForm
        email={email}
        emailSent={emailSent}
        loading={loading}
        onEmailChange={setEmail}
        onSubmit={handleOnSubmit}
      />
    </OpenRoute>
  );
}

export default ForgotPasswordContainer;
