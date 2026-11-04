import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useUIStore } from "../../store/uiStore";
import { formatPrice } from "../../utils/formatters";
import { Badge } from "../common/Badge";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { openQuickView } = useUIStore();

  const isWish = isInWishlist(product.id);
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    toast(added ? "Saved to your wishlist ❤️" : "Removed from wishlist", {
      style: { borderRadius: "16px", background: "#1F1124", color: "#fff" },
    });
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants?.[0] || {
      sku: `${product.id}-DEF`,
      size: "Free Size",
      color: "Default",
      stock: 10,
    };

    addItem(product, defaultVariant, 1);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);

    toast.success("Added to shopping bag!", {
      icon: "🛍️",
      style: { borderRadius: "16px", background: "#1F1124", color: "#fff" },
    });
  };

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 flex flex-col h-full border border-primary-light/40 hover:-translate-y-1.5 font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Product Showcase */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {/* Primary Look */}
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered && hasMultipleImages ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />

          {/* Alternate Angle Crossfade */}
          {hasMultipleImages && (
            <img
              src={product.images[1]}
              alt={`${product.name} angle`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}
        </Link>

        {/* Minimal Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercent > 0 && (
            <Badge variant="pink">{product.discountPercent}% OFF</Badge>
          )}
          {product.isNew && <Badge variant="gold">NEW</Badge>}
        </div>

        {/* Floating Action Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
              isWish
                ? "bg-red-50 text-red-500 fill-red-500"
                : "bg-white/90 backdrop-blur-md text-plum hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWish ? "fill-red-500 text-red-500" : ""}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleQuickViewClick}
            aria-label="Quick View"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-plum hover:text-primary hover:bg-white flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100 hidden sm:flex"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Quick Sizes Strip on Hover */}
        {product.variants?.some((v) => v.size && v.size !== "Free Size") && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-2xl py-1.5 px-2.5 text-[10px] text-mauve font-semibold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
            <span className="text-gray-400">Sizes:</span>
            {Array.from(new Set(product.variants.map((v) => v.size))).map((size) => (
              <span key={size} className="text-plum font-bold">
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Minimal Product Meta */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-mauve font-medium mb-1">
            <span className="uppercase tracking-widest text-primary font-bold text-[10px]">
              {product.categoryId}
            </span>
            {product.fabric && (
              <span className="text-[11px] text-mauve truncate max-w-[120px]">
                {product.fabric}
              </span>
            )}
          </div>

          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-plum line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base sm:text-lg text-plum tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs line-through text-mauve">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 shadow-xs active:scale-95 ${
              isAddedAnim
                ? "bg-emerald-500 text-white"
                : "bg-primary-light/60 text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {isAddedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
