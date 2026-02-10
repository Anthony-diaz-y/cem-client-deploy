"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { MdClose } from "react-icons/md";
import { COURSE_TEXTS } from "../../constants/course.constants";

interface PaymentModalProps {
    onClose: () => void;
    createPayPalOrder: (data: any, actions: any) => Promise<string>;
    onPayPalApprove: (data: any, actions: any) => Promise<void>;
    price: number;
    priceUSD?: number;
}

/**
 * PaymentModal - Modal to select payment method (PayPal or Izipay)
 * Uses React Portal to avoid stacking context issues with sticky/absolute parents
 */
const PaymentModal = ({
    onClose,
    createPayPalOrder,
    onPayPalApprove,
    price,
    priceUSD
}: PaymentModalProps) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Prevent scrolling on the body and html while modal is open
        const originalBodyStyle = window.getComputedStyle(document.body).overflow;
        const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        // Handle Escape key to close modal
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalBodyStyle;
            document.documentElement.style.overflow = originalHtmlStyle;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const modalContent = (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="relative w-full max-w-md bg-cem-cardbackground rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-cem-neutral-gray-900">
                        {COURSE_TEXTS.actions.paymentModal.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        aria-label="Close"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Price Summary */}
                    <div className="p-4 bg-cem-celeste-light/30 rounded-xl border border-cem-celeste-light/50">
                        <p className="text-xs font-bold text-cem-primary uppercase tracking-wider mb-2">
                            Resumen de compra
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-cem-primary">
                                    {COURSE_TEXTS.detailsCard.pricePrefix}{price}
                                </span>
                                <span className="text-[10px] font-bold text-cem-neutral-gray-500 uppercase">PEN</span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-cem-neutral-gray-600">
                                    $ {priceUSD ? Number(priceUSD).toFixed(2) : (price / 3.75).toFixed(2)}
                                </p>
                                <p className="text-[9px] text-cem-neutral-gray-400 font-medium uppercase tracking-tighter">
                                    USD aprox.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PayPal Option */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between ml-1">
                            <p className="text-sm font-bold text-cem-neutral-gray-700">
                                {COURSE_TEXTS.actions.paymentModal.paypal}
                            </p>
                        </div>
                        <div className="relative min-h-[48px] z-0">
                            {isPending ? (
                                <div className="w-full h-[48px] bg-gray-100 animate-pulse rounded-lg" />
                            ) : (
                                <PayPalButtons
                                    style={{
                                        layout: "horizontal",
                                        height: 48,
                                        tagline: false,
                                        shape: "rect",
                                        color: "gold"
                                    }}
                                    createOrder={createPayPalOrder}
                                    onApprove={onPayPalApprove}
                                />
                            )}
                        </div>
                    </div>

                    <div className="relative h-px bg-gray-100 flex items-center justify-center">
                        <span className="bg-white px-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider">O</span>
                    </div>

                    {/* Izipay Option (Disabled) */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-cem-neutral-gray-700 ml-1">
                            Izipay (PEN)
                        </p>
                        <button
                            disabled
                            className="w-full h-[48px] rounded-lg bg-gray-50 border border-gray-200 text-gray-400 font-bold flex items-center justify-center cursor-not-allowed transition-all"
                        >
                            {COURSE_TEXTS.actions.paymentModal.izipay}
                        </button>
                    </div>
                </div>

                {/* Footer info/safety */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 italic text-[11px] text-gray-500 text-center uppercase tracking-tighter">
                    Tus transacciones están protegidas con encriptación de extremo a extremo.
                </div>
            </div>
            {/* Click outside to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
};

export default PaymentModal;
