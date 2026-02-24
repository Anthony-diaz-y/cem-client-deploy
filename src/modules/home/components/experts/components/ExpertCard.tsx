"use client";

import React from "react";
import Image from "next/image";
import type { Expert } from "../../../constants/experts.constants";
import socialIcon from "@shared/assets/social/social-Icon.webp";

import { ensureFullUrl } from "@shared/utils/urlHelper";

interface ExpertCardProps {
  expert: Expert;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  return (
    <div
      className="rounded-xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center justify-between w-full"
      style={{ backgroundColor: "#F9FAFB", minHeight: "250px" }}
    >
      {/* Imagen circular */}
      <div className="relative w-28 h-28 mb-3 flex-shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden bg-cem-neutral-gray-100 border-4 border-cem-neutral-gray-100">
          <Image
            src={expert.image}
            alt={expert.name}
            fill
            className="object-cover rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=0ea5e9&color=fff&size=128`;
            }}
          />
        </div>
      </div>

      {/* Nombre */}
      <h3 className="text-[18px] font-bold text-cem-neutral-gray-900 mb-1">
        {expert.name}
      </h3>

      {/* Título */}
      <p className="text-[16px] text-[#0B4653] mb-3">{expert.title}</p>

      {/* Iconos de enlaces */}
      <div className="flex items-center justify-center gap-3 w-full">
        {/* Icono ID */}
        <a
          href={ensureFullUrl(expert.links?.orcid)}
          className="w-7 h-7 rounded-full bg-cem-neutral-gray-200 flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ORCID"
        >
          <span className="text-[10px] font-bold text-cem-neutral-gray-600 leading-none relative">
            <span className="absolute -top-[2px] left-[2px] w-[2px] h-[2px] bg-cem-neutral-gray-600 rounded-full"></span>
            <span className="inline-block">i</span>
            <span className="inline-block">D</span>
          </span>
        </a>

        {/* Icono ResearchGate/Molecule - Icono de red/molecular */}
        <a
          href={ensureFullUrl(expert.links?.researchGate)}
          className="flex items-center justify-center hover:opacity-80 transition-opacity group"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ResearchGate"
        >
          <div className="relative w-5 h-5">
            <Image src={socialIcon} alt="ResearchGate" fill className="object-contain" />
          </div>
        </a>

        {/* LinkedIn */}
        <a
          href={ensureFullUrl(expert.links?.linkedin)}
          className="w-7 h-7 rounded-lg bg-cem-neutral-gray-200 flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <span className="text-[10px] font-bold text-cem-neutral-gray-600 leading-none relative">
            <span className="absolute -top-[2px] left-[2px] w-[2px] h-[2px] bg-cem-neutral-gray-600 rounded-full"></span>
            <span className="inline-block">i</span>
            <span className="inline-block">n</span>
          </span>
        </a>
      </div>
    </div>
  );
};

