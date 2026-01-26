"use client";

import { useRouter } from "next/navigation";
import UpdatePasswordForm from "../components/UpdatePasswordForm";
import { useUpdatePassword } from "../hooks/useUpdatePassword";

function UpdatePasswordContainer() {
  const router = useRouter();
  const {
    formData,
    showPassword,
    showConfirmPassword,
    loading,
    isValidToken,
    handleOnChange,
    handleOnSubmit,
    setShowPassword,
    setShowConfirmPassword,
  } = useUpdatePassword();

  return (
    <UpdatePasswordForm
      formData={formData}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      loading={loading}
      isValidToken={isValidToken}
      onFormDataChange={handleOnChange}
      onSubmit={(e) => handleOnSubmit(e, router.push)}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
    />
  );
}

export default UpdatePasswordContainer;
