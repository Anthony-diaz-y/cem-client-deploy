"use client";

import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import useOnClickOutside from "@shared/hooks/useOnClickOutside";

interface CEMModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    footer: React.ReactNode;
    loading?: boolean;
    centeredTitle?: boolean;
    width?: string;
    height?: string;
}

/**
 * Layout base universal para los modales del sistema CEM
 * Define la estructura visual premium, dimensiones y animaciones consistentes
 */
export const CEMModalLayout: React.FC<CEMModalLayoutProps> = ({
    isOpen,
    onClose,
    title,
    icon,
    children,
    footer,
    loading = false,
    centeredTitle = false,
    width = '792px',
    height = '512px'
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose);

    // Bloquear scroll del fondo cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Manejo para SSR
    if (typeof window === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-cem-neutral-gray-900/40 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl border border-cem-neutral-gray-100 flex flex-col shadow-2xl animate-scaleIn overflow-hidden transition-[height,min-height] duration-300 ease-in-out"
                style={{ width, minHeight: height, maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between flex-shrink-0 relative">
                    <div className={`flex items-center gap-4 ${centeredTitle ? 'w-full justify-center' : ''}`}>
                        {!centeredTitle && icon && (
                            <div className="w-12 h-12 rounded-2xl bg-cem-primary/10 flex items-center justify-center shadow-sm">
                                {icon}
                            </div>
                        )}
                        <h2 className={`text-2xl font-semibold text-cem-neutral-gray-900 ${centeredTitle ? 'text-center' : ''}`}>
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-cem-neutral-gray-400 hover:text-cem-neutral-gray-900 transition-all p-1"
                    >
                        <IoMdClose className="text-3xl" />
                    </button>
                    {/* Divider */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] h-[1px] bg-cem-neutral-gray-100" />
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                <div className="px-6 py-5 flex items-center justify-end gap-4 bg-white flex-shrink-0 relative">
                    {/* Divider */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] h-[1px] bg-cem-neutral-gray-100" />
                    {footer}
                </div>
            </div>
        </div>,
        document.body
    );
};
