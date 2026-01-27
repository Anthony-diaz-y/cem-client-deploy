import React from "react";
import Link from "next/link";

const RegisterLink: React.FC = () => {
  return (
    <div className="text-center w-full pt-4">
      <p className="text-sm leading-5 text-gray-600 m-0">
        Aun no tengo una cuenta,{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-[#14b8a6] no-underline"
        >
          regístrate
        </Link>
      </p>
    </div>
  );
};

export default RegisterLink;
