"use client";

import React from "react";
import LoginImagePanel from "./LoginImagePanel";
import LoginFormView from "./LoginFormView";

const LoginSection: React.FC = () => {
  return (
    <div className="fixed inset-0 flex bg-white overflow-hidden text-base">
      {/* Panel izquierdo - Imagen del estudiante */}
      <LoginImagePanel />

      {/* Panel derecho - Formulario de login */}
      <div className="h-full w-1/2 min-w-0 flex items-center justify-center bg-white overflow-y-auto p-8">
        <div className="w-full max-w-[28rem] flex flex-col items-center py-4">
          <LoginFormView />
        </div>
      </div>
    </div>
  );
};

export default LoginSection;

