"use client";

import React from "react";
import { useAppSelector } from "@shared/store/hooks";
import ContactMessagesTable from "../components/ContactMessagesTable";

export default function ContactMessagesContainer() {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No autorizado. Por favor, inicia sesión.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-richblack-5 mb-2">
          Mensajes de Contacto
        </h1>
        <p className="text-richblack-400">
          Gestiona los mensajes recibidos a través del formulario de contacto
        </p>
      </div>

      <ContactMessagesTable token={token} />
    </div>
  );
}

