"use client";

import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { resetPassword } from "@shared/services/authAPI";
import { RootState, AppDispatch } from "@shared/store/store";
import Loading from "@shared/components/Loading";

function UpdatePasswordContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string>("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { password, confirmPassword } = formData;

  // Obtener el token inmediatamente y en el cliente para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
    if (pathname) {
      // Manejar tanto /update-password/{token} como /auth/update-password/{token}
      const pathParts = pathname.split("/").filter(Boolean);
      const tokenIndex = pathParts.findIndex(part => 
        part === "update-password" || part === "auth"
      );
      const extractedToken = tokenIndex >= 0 && pathParts[tokenIndex + 1] 
        ? pathParts[tokenIndex + 1] 
        : pathname.split("/").at(-1) || "";
      setToken(extractedToken);
    }
  }, [pathname]);

  // Extraer token también de forma síncrona para renderizar inmediatamente
  // Manejar tanto /update-password/{token} como /auth/update-password/{token}
  const getTokenFromPath = () => {
    if (!pathname) return "";
    const pathParts = pathname.split("/").filter(Boolean);
    const tokenIndex = pathParts.findIndex(part => 
      part === "update-password" || part === "auth"
    );
    if (tokenIndex >= 0 && pathParts[tokenIndex + 1]) {
      return pathParts[tokenIndex + 1];
    }
    return pathname.split("/").at(-1) || "";
  };
  
  const currentToken = mounted && token ? token : getTokenFromPath();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan antes de enviar
    if (password !== confirmPassword) {
      return; // El error se mostrará en la función resetPassword
    }

    // Validar que el token exista
    const tokenToUse = token || currentToken;
    if (!tokenToUse || tokenToUse.trim() === "") {
      return; // El error se mostrará en la función resetPassword
    }

    dispatch(
      resetPassword(
        password,
        confirmPassword,
        tokenToUse,
        router.push as (path: string) => void
      )
    );
  };

  // Renderizar siempre el formulario inmediatamente para evitar que Next.js muestre 404
  // La validación del token se hace dentro del render para no bloquear la renderización inicial
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="max-w-[500px] p-4 lg:p-8">
          <Loading />
        </div>
      ) : mounted && token && token.trim() === "" ? (
        <div className="max-w-[500px] p-4 lg:p-8 text-center">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5 mb-4">
            Token inválido
          </h1>
          <p className="text-richblack-300 mb-6">
            El link de reset de contraseña no es válido. Por favor, solicita un nuevo link.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-colors"
          >
            Solicitar nuevo link
          </Link>
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose new password
          </h1>

          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter your new password and you&apos;re all set.
          </p>

          <form onSubmit={handleOnSubmit}>
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 "
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <label className="relative mt-3 block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 "
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link href="/auth/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePasswordContainer;
