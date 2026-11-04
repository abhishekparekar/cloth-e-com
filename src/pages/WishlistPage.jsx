import React from "react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../utils/formatters";
import { Button } from "../components/common/Button";
import { Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export const WishlistPage = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToBag = (product) => {
    const defaultVariant = product.variants?.[0] || {
      sku: `${product.id}-DEF`,
      size: "Free Size",
      color: "Default",
      stock: 10,
    };
    addItem(product, defaultVariant, 1);
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to your bag!`, {
      icon: "🛍️",
      style: { borderRadius: "16px", background: "#2D1B36", color: "#fff" },
    });
  };

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10 fill-red-500 text-red-500" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-plum">Your Wishlist is Empty</h1>
        <p className="text-xs sm:text-sm text-mauve max-w-sm mx-auto">
          Save your favourite handloom sarees and festive kurtis here to purchase whenever you're ready.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg" className="mt-2">
            Discover Outfits
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between pb-6 border-b border-primary-light/50 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs text-mauve mt-1">Saved items you adore</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-mauve hover:text-red-500 transition-colors"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden border border-primary-light/40 shadow-xs flex flex-col justify-between group"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
              <Link to={`/product/${product.slug || product.id}`}>
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-mauve hover:text-red-500 flex items-center justify-center shadow-xs"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <Link to={`/product/${product.slug || product.id}`}>
                  <h3 className="font-heading font-semibold text-sm text-plum truncate hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-heading font-bold text-base text-plum">
                    {formatPrice(product.price)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-xs line-through text-mauve">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={ShoppingBag}
                className="w-full"
                onClick={() => handleMoveToBag(product)}
              >
                Move to Bag
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

