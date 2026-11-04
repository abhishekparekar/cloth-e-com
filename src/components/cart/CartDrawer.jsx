import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { formatPrice } from "../../utils/formatters";
import { STORE_CONFIG } from "../../utils/constants";
import { Button } from "../common/Button";
import toast from "react-hot-toast";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { isCartOpen, closeCart } = useUIStore();
  const {
    items,
    removeItem,
    updateQty,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const { addToWishlist } = useWishlistStore();
  const [couponCode, setCouponCode] = useState("");

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const discount = getDiscount();

  const amountNeededForFreeShipping = Math.max(
    0,
    STORE_CONFIG.freeShippingThreshold - subtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode);
    if (res.success) {
      toast.success(res.message);
      setCouponCode("");
    } else {
      toast.error(res.message);
    }
  };

  const handleMoveToWishlist = (item) => {
    addToWishlist({
      id: item.productId,
      name: item.name,
      price: item.price,
      mrp: item.mrp,
      images: [item.image],
      slug: item.productId,
    });
    removeItem(item.sku);
    toast.success("Moved to wishlist!");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-plum/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-ivory/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-lg font-bold text-plum">
                    Shopping Bag ({items.length})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 rounded-full text-mauve hover:text-plum hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="bg-primary-light/40 px-6 py-3 border-b border-primary-light/60">
                <div className="flex items-center justify-between text-xs font-medium text-plum mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    {amountNeededForFreeShipping > 0 ? (
                      <>
                        Add <strong className="text-primary font-bold">{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>!
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        🎉 Yay! You qualified for FREE Express Shipping!
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-brand transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-20 h-20 rounded-full bg-primary-light/50 flex items-center justify-center text-primary">
                      <ShoppingBag className="w-10 h-10 opacity-70" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-plum">Your bag is empty</h3>
                      <p className="text-xs text-mauve mt-1 max-w-xs">
                        Looks like you haven't added anything to your cart yet. Explore our latest handloom sarees & festive kurtis!
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        closeCart();
                        navigate("/shop");
                      }}
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.sku}
                      className="flex gap-4 p-3 bg-ivory/60 rounded-2xl border border-primary-light/40 relative group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-24 object-cover object-top rounded-xl bg-gray-100 shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-semibold text-plum line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.sku)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-mauve mt-0.5 space-x-2">
                            <span>Size: <strong>{item.size}</strong></span>
                            {item.color && <span>• Color: <strong>{item.color}</strong></span>}
                          </div>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xs font-bold text-plum">
                              {formatPrice(item.price)}
                            </span>
                            {item.mrp > item.price && (
                              <span className="text-[10px] line-through text-mauve">
                                {formatPrice(item.mrp)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center border border-gray-200 rounded-full bg-white px-1">
                            <button
                              onClick={() => updateQty(item.sku, item.qty - 1)}
                              className="p-1 text-gray-500 hover:text-primary transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-plum">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.sku, item.qty + 1)}
                              className="p-1 text-gray-500 hover:text-primary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                  {/* Coupon section */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Tag className="w-3.5 h-3.5" />
                        <span>
                          Code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discount)})
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 font-semibold text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code (e.g. WELCOME10)"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-primary uppercase"
                      />
                      <Button variant="secondary" size="sm" type="submit">
                        Apply
                      </Button>
                    </form>
                  )}

                  {/* Price breakdown */}
                  <div className="space-y-1.5 text-xs text-mauve">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-plum">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium text-plum">
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-plum pt-2 border-t border-gray-100">
                      <span>Estimated Total</span>
                      <span className="text-primary font-heading text-base font-bold">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="space-y-2 pt-1">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full flex items-center justify-between px-6"
                      onClick={() => {
                        closeCart();
                        navigate("/checkout");
                      }}
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="block text-center text-xs text-mauve hover:text-primary transition-colors pt-1"
                    >
                      View Detailed Cart Page
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

