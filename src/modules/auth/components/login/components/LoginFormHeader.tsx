import React from "react";

interface LoginFormHeaderProps {
  title: string;
  subtitle: string;
}

const LoginFormHeader: React.FC<LoginFormHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-center w-full mb-8 lg:mb-10">
      <h1 className="font-bold text-[32px] md:text-[40px] leading-tight text-[#2D2D2D] mb-3 m-0">
        {title}
      </h1>
      <p className="text-base md:text-lg text-gray-500 font-medium m-0">
        {subtitle}
      </p>
    </div>
  );
};

export default LoginFormHeader;
