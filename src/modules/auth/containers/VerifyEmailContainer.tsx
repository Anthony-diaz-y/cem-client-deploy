"use client";

import VerifyEmailForm from "../components/VerifyEmailForm";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

function VerifyEmailContainer() {
  const {
    otp,
    loading,
    setOtp,
    handleVerifyAndSignup,
    handleResendOtp,
  } = useVerifyEmail();

  return (
    <VerifyEmailForm
      otp={otp}
      loading={loading}
      onOtpChange={setOtp}
      onSubmit={handleVerifyAndSignup}
      onResendOtp={handleResendOtp}
    />
  );
}

export default VerifyEmailContainer;
