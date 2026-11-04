import React from "react";

export const Badge = ({ children, variant = "pink", className = "" }) => {
  const styles = {
    pink: "bg-primary text-white shadow-sm",
    gold: "bg-gradient-gold text-plum font-semibold shadow-sm",
    soft: "bg-primary-light text-primary font-medium",
    dark: "bg-plum text-white font-medium",
    green: "bg-emerald-500 text-white font-medium",
    outline: "border border-primary text-primary bg-white/80",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

