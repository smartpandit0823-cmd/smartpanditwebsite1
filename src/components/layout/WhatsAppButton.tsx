"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const DEFAULT_MSG = "Hi, I need help with SmartPandit booking.";

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({ message = DEFAULT_MSG }: WhatsAppButtonProps) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-110 active:scale-95
        bottom-[84px] right-4 md:bottom-6 md:right-6 md:size-14"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} strokeWidth={2} />
    </a>
  );
}
