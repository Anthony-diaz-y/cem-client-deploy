"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // No mostrar navbar en signup y login
  const hideNavbar = pathname === "/auth/signup" || pathname === "/auth/login";
  
  if (hideNavbar) {
    return null;
  }
  
  return <Navbar />;
}

