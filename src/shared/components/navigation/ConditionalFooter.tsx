"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
    const pathname = usePathname();

    // No mostrar footer en rutas de autenticación u otras que no lo requieran
    const hideFooter = pathname === "/auth/signup" || pathname === "/auth/login";

    if (hideFooter) {
        return null;
    }

    return <Footer />;
}
