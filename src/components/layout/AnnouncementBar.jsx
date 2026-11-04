import React from "react";
import { Sparkles } from "lucide-react";

export const AnnouncementBar = () => {
  return (
    <div className="bg-gradient-brand text-white text-[11px] font-semibold py-2 px-4 overflow-hidden relative shadow-xs font-sans tracking-wider uppercase">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-14">
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-light" />
          Complimentary Express Shipping on Orders Above ₹999
        </span>
        <span className="flex items-center gap-2">
          🌸 Use Code <strong className="underline text-gold-light font-bold">WELCOME10</strong> for 10% Off Your First Order
        </span>
        <span className="flex items-center gap-2">
          ✨ Certified Authentic Handloom Silks & Bridal Lehengas
        </span>
        <span className="flex items-center gap-2">
          🛍️ 7-Day Doorstep Exchange & Returns
        </span>
        {/* Infinite Loop Repeat */}
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-light" />
          Complimentary Express Shipping on Orders Above ₹999
        </span>
        <span className="flex items-center gap-2">
          🌸 Use Code <strong className="underline text-gold-light font-bold">WELCOME10</strong> for 10% Off Your First Order
        </span>
      </div>
    </div>
  );
};
