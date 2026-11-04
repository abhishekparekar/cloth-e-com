import React from "react";
import { MessageCircle } from "lucide-react";
import { STORE_CONFIG } from "../../utils/constants";

export const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hi Aanya Boutique! I would like some assistance with my order."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 lg:bottom-8 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-semibold transition-all duration-300 ease-in-out text-white">
        Chat with Stylist
      </span>
    </a>
  );
};

