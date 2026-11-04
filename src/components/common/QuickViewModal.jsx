import React, { useState } from "react";
import { Modal } from "./Modal";
import { useUIStore } from "../../store/uiStore";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { formatPrice } from "../../utils/formatters";
import { Rating } from "./Rating";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Heart, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const QuickViewModal = () => {
  const { quickViewProduct, closeQuickView, openCart } = useUIStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWish = isInWishlist(product.id);

  // Default selection if not set
  const currentVariant =
    product.variants?.find(
      (v) =>
        (!selectedSize || v.size === selectedSize) &&
        (!selectedColor || v.color === selectedColor)
    ) || product.variants?.[0];

  const handleAddToCart = () => {
    addItem(product, currentVariant, quantity);
    toast.success(`${product.name} added to bag!`, {
      icon: "🛍️",
      style: { borderRadius: "16px", background: "#2D1B36", color: "#fff" },
    });
    closeQuickView();
    openCart();
  };

  return (
    <Modal isOpen={Boolean(quickViewProduct)} onClose={closeQuickView} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-ivory shadow-inner">
            <img
              src={product.images?.[selectedImageIdx] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.discountPercent > 0 && (
              <div className="absolute top-3 left-3">
                <Badge variant="pink">{product.discountPercent}% OFF</Badge>
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIdx === idx ? "border-primary shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between h-full space-y-5">
          <div className="space-y-3">
            <span className="text-xs uppercase font-semibold tracking-widest text-primary">
              {product.categoryId}
            </span>
            <h2 className="font-heading text-2xl font-semibold text-plum leading-snug">
              {product.name}
            </h2>

            <div className="flex items-center gap-3">
              <Rating rating={product.ratingAvg || 4.8} count={product.ratingCount || 42} />
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                In Stock
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-bold text-plum font-heading">
                {formatPrice(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm line-through text-mauve">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>

            <p className="text-xs text-mauve line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            {/* Color Swatches */}
            {product.variants?.some((v) => v.color) && (
              <div>
                <span className="text-xs font-semibold text-plum block mb-2">
                  Color: <span className="font-normal text-mauve">{currentVariant?.color}</span>
                </span>
                <div className="flex items-center gap-2">
                  {Array.from(new Set(product.variants.map((v) => v.color))).map((colorName) => {
                    const match = product.variants.find((v) => v.color === colorName);
                    const isSelected = (selectedColor || currentVariant?.color) === colorName;
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        title={colorName}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected ? "border-primary scale-110 shadow-sm" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: match?.colorHex || "#E11D74" }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.variants?.some((v) => v.size && v.size !== "Free Size") && (
              <div>
                <span className="text-xs font-semibold text-plum block mb-2">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(product.variants.map((v) => v.size))).map((size) => {
                    const isSelected = (selectedSize || currentVariant?.size) === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-plum border-gray-200 hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-plum">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-sm hover:bg-gray-100 text-plum font-semibold"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-plum">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-1 text-sm hover:bg-gray-100 text-plum font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                icon={ShoppingBag}
                onClick={handleAddToCart}
              >
                Add to Shopping Bag
              </Button>
              <button
                onClick={() => {
                  const added = toggleWishlist(product);
                  toast(added ? "Added to wishlist ❤️" : "Removed from wishlist", {
                    style: { borderRadius: "16px" },
                  });
                }}
                className={`p-3 rounded-full border transition-all ${
                  isWish
                    ? "bg-red-50 border-red-200 text-red-500 fill-red-500"
                    : "border-gray-200 text-mauve hover:text-red-500 hover:border-red-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWish ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={closeQuickView}
              className="inline-flex items-center justify-center w-full text-xs font-medium text-mauve hover:text-primary pt-2 transition-colors group"
            >
              View Full Product Details & Size Chart
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

