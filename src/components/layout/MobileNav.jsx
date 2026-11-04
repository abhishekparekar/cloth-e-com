import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useUIStore } from "../../store/uiStore";

export const MobileNav = () => {
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { openCart } = useUIStore();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Shop", path: "/shop", icon: Sparkles },
    { label: "Wishlist", path: "/wishlist", icon: Heart, badge: wishlistCount },
    { label: "Bag", action: openCart, icon: ShoppingBag, badge: cartCount },
    { label: "Account", path: "/account", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-primary-light/50 shadow-lg px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;

          if (item.action) {
            return (
              <button
                key={index}
                onClick={item.action}
                className="relative flex flex-col items-center justify-center py-1 px-3 text-mauve hover:text-primary transition-colors focus:outline-none"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gradient-cta text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={index}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                isActive ? "text-primary font-semibold" : "text-mauve hover:text-primary"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

