"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoCEM from "@shared/assets/Logo/Logo-CEM.png";
import { ImLinkedin2 } from "react-icons/im";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Main Footer Content */}
      <div
        className="w-full py-16 md:py-20"
        style={{ backgroundColor: "#01343F" }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-12 xl:gap-8">
            {/* Brand Section */}
            <div className="xl:col-span-2 flex flex-col items-center xl:items-start gap-6">
              <Image
                src={LogoCEM}
                alt="CEM Logo"
                className="object-contain brightness-0 invert"
                width={140}
                height={60}
              />
              <p className="text-white text-base md:text-lg leading-relaxed max-w-sm text-center xl:text-left opacity-90">
                Las mejores experiencias de aprendizaje que crean más talento en
                el mundo.
              </p>
            </div>

            {/* Aprendizaje Column */}
            <div className="flex flex-col items-center xl:items-start gap-6">
              <h3 className="text-cem-neutral-gray-300 font-medium text-sm uppercase tracking-wider">
                Aprendizaje
              </h3>
              <div className="flex flex-col items-center xl:items-start gap-4">
                <Link
                  href="/courses"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  Cursos
                </Link>
                <Link
                  href="/programas"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  Programas
                </Link>
              </div>
            </div>

            {/* CEM Column */}
            <div className="flex flex-col items-center xl:items-start gap-6">
              <h3 className="text-cem-neutral-gray-300 font-medium text-sm uppercase tracking-wider">
                CEM
              </h3>
              <div className="flex flex-col items-center xl:items-start gap-4">
                <Link
                  href="/nosotros"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  Nosotros
                </Link>
                <Link
                  href="/trabaja-con-nosotros"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  Trabaja con nosotros
                </Link>
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col items-center xl:items-start gap-6">
              <h3 className="text-cem-neutral-gray-300 font-medium text-sm uppercase tracking-wider">
                Legal
              </h3>
              <div className="flex flex-col items-center xl:items-start gap-4">
                <Link
                  href="/terminos"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  Términos
                </Link>
                <Link
                  href="/privacidad"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  Privacidad
                </Link>
                <Link
                  href="/cookies"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>

            {/* Contacto Column */}
            <div className="flex flex-col items-center xl:items-start gap-6">
              <h3 className="text-cem-neutral-gray-300 font-medium text-sm uppercase tracking-wider">
                Contacto
              </h3>
              <div className="flex flex-col items-center xl:items-start gap-4">
                <a
                  href="tel:98058554"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  98058554
                </a>
                <a
                  href="mailto:info@cem.edu.pe"
                  className="text-white font-bold text-base hover:text-[#02819E] transition-colors"
                >
                  info@cem.edu.pe
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Copyright and Social Media */}
      <div
        className="w-full py-10 md:py-8 border-t"
        style={{
          backgroundColor: "#001A20",
          borderColor: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {/* Copyright and Credit */}
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left text-white/60 text-sm md:text-base">
              <p>© 2026 CEM. Todos los derechos reservados.</p>
              <p className="flex items-center gap-1">
                <span>Diseñado por</span>
                <span className="text-[#02819E] font-medium">
                  Crisva Design Lab.
                </span>
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/company/cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <ImLinkedin2 size={22} />
              </a>
              <a
                href="https://www.facebook.com/cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://www.instagram.com/cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://www.tiktok.com/@cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
