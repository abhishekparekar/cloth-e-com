import React from "react";
import { Truck, RotateCcw, ShieldCheck, Award } from "lucide-react";

export const WhyChooseUs = () => {
  const perks = [
    {
      icon: Truck,
      title: "Free Express Delivery",
      subtitle: "On all orders above ₹999 across India",
    },
    {
      icon: RotateCcw,
      title: "7-Day Easy Returns",
      subtitle: "Doorstep size exchange & pickup",
    },
    {
      icon: Award,
      title: "100% Handloom Silk",
      subtitle: "Certified Silk Mark authenticity",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      subtitle: "UPI, Cards, Netbanking & COD",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-ivory font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-primary-light/50 shadow-card hover:shadow-card-hover transition-all duration-300 text-center flex flex-col items-center space-y-2 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-light/50 flex items-center justify-center text-primary mb-1">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-plum tracking-tight">
                  {perk.title}
                </h3>
                <p className="text-xs text-mauve">
                  {perk.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
