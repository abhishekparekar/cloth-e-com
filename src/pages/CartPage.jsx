import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { formatPrice } from "../utils/formatters";
import { STORE_CONFIG } from "../utils/constants";
import { Button } from "../components/common/Button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQty,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const { addToWishlist } = useWishlistStore();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  const amountNeeded = Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput("");
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
    toast.success("Saved to your wishlist ❤️");
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center space-y-5">
        <div className="w-24 h-24 rounded-full bg-primary-light/50 flex items-center justify-center text-primary mx-auto">
          <ShoppingBag className="w-12 h-12 opacity-60" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-plum">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-mauve max-w-md mx-auto">
          Indulge in our regal handloom silks, festive embroidered kurtis, and contemporary sets.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg" className="mt-4">
            Explore Collections
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum mb-8">
        Shopping Bag ({items.length} {items.length === 1 ? "Item" : "Items"})
      </h1>

      {/* Free Shipping Alert Bar */}
      <div className="bg-primary-light/40 rounded-2xl p-4 border border-primary-light/70 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-plum">
          <Sparkles className="w-4 h-4 text-primary" />
          {amountNeeded > 0 ? (
            <span>
              Add <strong className="text-primary font-bold">{formatPrice(amountNeeded)}</strong> more to unlock <strong>FREE Express Shipping</strong>!
            </span>
          ) : (
            <span className="text-emerald-700">
              🎉 Congratulations! You unlocked FREE Delivery across India!
            </span>
          )}
        </div>
        <div className="w-full sm:w-48 h-2 bg-white rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-brand transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Items Table / List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.sku}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-primary-light/40 shadow-xs flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover object-top rounded-xl shrink-0"
                />
                <div>
                  <h3 className="font-heading font-semibold text-sm sm:text-base text-plum">
                    {item.name}
                  </h3>
                  <div className="text-xs text-mauve mt-1 space-x-2">
                    <span>Size: <strong>{item.size}</strong></span>
                    {item.color && <span>• Color: <strong>{item.color}</strong></span>}
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading font-bold text-base text-plum">
                      {formatPrice(item.price)}
                    </span>
                    {item.mrp > item.price && (
                      <span className="text-xs line-through text-mauve">
                        {formatPrice(item.mrp)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity and Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-full bg-white px-2 py-1">
                  <button
                    onClick={() => updateQty(item.sku, item.qty - 1)}
                    className="p-1 text-gray-500 hover:text-primary"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-plum">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.sku, item.qty + 1)}
                    className="p-1 text-gray-500 hover:text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleMoveToWishlist(item)}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => removeItem(item.sku)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-primary-light/50 shadow-card space-y-6 sticky top-24">
          <h2 className="font-heading text-lg font-bold text-plum border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          {/* Coupon Input */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Tag className="w-4 h-4" />
                  <span>
                    Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discount)})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. WELCOME10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 uppercase focus:outline-none focus:border-primary"
                />
                <Button variant="secondary" size="sm" type="submit">
                  Apply
                </Button>
              </form>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-mauve">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-semibold text-plum">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-plum">
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST (5%)</span>
              <span className="font-semibold text-plum">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-plum pt-3 border-t border-gray-100">
              <span>Total Payable</span>
              <span className="text-primary font-heading text-xl font-bold">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-between px-6 shadow-md"
            onClick={() => navigate("/checkout")}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-mauve text-center pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

