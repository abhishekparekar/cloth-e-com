import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs tracking-wide",
    md: "px-6 py-2.5 text-sm tracking-wide",
    lg: "px-8 py-3.5 text-base tracking-wide font-semibold",
    icon: "p-2.5 rounded-full",
  };

  const variantStyles = {
    primary:
      "bg-gradient-cta text-white shadow-soft hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
    secondary:
      "bg-white text-plum border border-primary/20 hover:border-primary hover:bg-primary-light/40 shadow-sm hover:-translate-y-0.5",
    outline:
      "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white",
    gold:
      "bg-gradient-gold text-plum font-semibold shadow-soft hover:shadow-gold/40 hover:-translate-y-0.5",
    dark:
      "bg-plum text-white hover:bg-black shadow-md hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-plum hover:bg-primary-light/50 hover:text-primary",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
};

