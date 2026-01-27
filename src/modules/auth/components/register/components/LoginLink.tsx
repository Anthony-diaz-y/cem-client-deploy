import React from "react";
import Link from "next/link";

const LoginLink: React.FC = () => {
  return (
    <div className="text-center w-full pt-6">
      <p className="text-sm leading-5 text-gray-600 m-0">
        Ya tengo una cuenta,{" "}
        <Link
          href="/auth/login"
          className="font-medium text-[#02819E] underline"
        >
          iniciar sesión
        </Link>
      </p>
    </div>
  );
};

export default LoginLink;

