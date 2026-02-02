import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const RegisterWarning: React.FC = () => {
  return (
    <div className="w-[296px] bg-gray-50 border border-gray-100 rounded-lg p-2.5 flex gap-2.5 items-start">
      <div className="mt-0.5">
        <AiOutlineInfoCircle className="w-5 h-5 text-teal-600" />
      </div>
      <p className="text-xs leading-relaxed text-gray-600 m-0">
        Escribe tu nombre tal como debe aparecer en tus certificados. Por
        seguridad y consistencia académica, este campo no podrá ser editado
        después del registro.
      </p>
    </div>
  );
};

export default RegisterWarning;
