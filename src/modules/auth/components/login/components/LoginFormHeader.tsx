import React from "react";

interface LoginFormHeaderProps {
  title: string;
  subtitle: string;
}

const LoginFormHeader: React.FC<LoginFormHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center w-full mb-6">
      <h1 className="font-bold text-[2.25rem] leading-[2.75rem] text-[#333333] mb-2 m-0">
        {title}
      </h1>
      <p className="text-base leading-6 text-gray-500 m-0">
        {subtitle}
      </p>
    </div>
  );
};

export default LoginFormHeader;

