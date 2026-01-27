import React from "react";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  email?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle, email }) => {
  return (
    <div className="text-center w-full mb-8">
      <h1 className="font-bold text-[2.25rem] leading-[2.75rem] text-[#333333]">
        {title}
      </h1>
      <p className="text-base leading-6 text-gray-500">{subtitle}</p>
      {email && (
        <p className="text-sm leading-5 mt-2 mb-0 text-[#02819E] font-medium">
          {email}
        </p>
      )}
    </div>
  );
};

export default FormHeader;

