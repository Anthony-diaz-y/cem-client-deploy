import React from 'react'
import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  linkto?: string;
}

const Button: React.FC<ButtonProps> = ({ children, active, linkto }) => {
  // Validar que linkto existe y no es vacío antes de renderizar Link
  const href = linkto || "#"

  return (
    <Link href={href}>

      <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold
        ${active ? "bg-yellow-50 text-black" : " bg-richblack-800"}
        hover:scale-95 transition-all duration-200
        `}>
        {children}
      </div>

    </Link>
  )
}

export default Button
