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
      <div className="w-full h-[280px] flex items-center" style={{ backgroundColor: '#01343F' }}>
        <div className="w-11/12 max-w-maxContent mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Image
                src={LogoCEM}
                alt="CEM Logo"
                className="object-contain brightness-0 invert"
                width={120}
                height={50}
              />
              <p className="text-white text-sm md:text-base leading-relaxed max-w-md">
                Las mejores experiencias de aprendizaje que crean más talento en el mundo.
              </p>
            </div>

            {/* Aprendizaje Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-cem-neutral-gray-300 font-semibold text-sm md:text-base">
                Aprendizaje
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/cursos" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  Cursos
                </Link>
                <Link href="/programas" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  Programas
                </Link>
              </div>
            </div>

            {/* CEM Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-cem-neutral-gray-300 font-semibold text-sm md:text-base">
                CEM
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/nosotros" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  Nosotros
                </Link>
                <Link href="/trabaja-con-nosotros" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  Trabaja con nosotros
                </Link>
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-cem-neutral-gray-300 font-semibold text-sm md:text-base">
                Legal
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/terminos" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  Términos
                </Link>
                <Link href="/privacidad" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  Privacidad
                </Link>
                <Link href="/cookies" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  Cookies
                </Link>
              </div>
            </div>

            {/* Contacto Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-cem-neutral-gray-300 font-semibold text-sm md:text-base">
                Contacto
              </h3>
              <div className="flex flex-col gap-3">
                <a href="tel:98058554" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  98058554
                </a>
                <a href="mailto:info@cem.edu.pe" className="text-white font-bold text-sm md:text-base hover:opacity-80 transition-opacity">
                  info@cem.edu.pe
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Copyright and Social Media */}
      <div className="w-full h-[120px] flex items-center border-t" style={{ backgroundColor: '#001A20', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="w-11/12 max-w-maxContent mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-white text-sm md:text-base">
              <span>© 2026 CEM. Todos los derechos reservados. Diseñado por </span>
              <span className="text-[#02819E]">Crisva Design Lab.</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="LinkedIn"
              >
                <ImLinkedin2 size={20} />
              </a>
              <a
                href="https://www.facebook.com/cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@cem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="TikTok"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
