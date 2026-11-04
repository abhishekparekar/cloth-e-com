import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { orderService } from "../services/orderService";
import { formatPrice } from "../utils/formatters";
import { Button } from "../components/common/Button";
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle,
  Truck,
  Plus,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getDiscount, getShipping, getTax, getTotal, appliedCoupon, clearCart } =
    useCartStore();
  const { user, addAddress } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses?.[0]?.id || "new"
  );
  const [newAddress, setNewAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' or 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const getActiveAddress = () => {
    if (selectedAddressId === "new") {
      return newAddress;
    }
    return user?.addresses?.find((a) => a.id === selectedAddressId) || newAddress;
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const addr = getActiveAddress();
    if (!addr.name || !addr.phone || !addr.line1 || !addr.city || !addr.pincode) {
      toast.error("Please fill in all mandatory address fields");
      return;
    }
    if (selectedAddressId === "new") {
      addAddress(newAddress);
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const activeAddr = getActiveAddress();

      const orderData = {
        userId: user?.uid || "guest",
        customerName: activeAddr.name,
        customerEmail: user?.email || "customer@example.com",
        customerPhone: activeAddr.phone,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          sku: i.sku,
          size: i.size,
          color: i.color,
          qty: i.qty,
          price: i.price,
        })),
        address: activeAddr,
        pricing: {
          subtotal,
          discount,
          shipping,
          tax,
          total,
        },
        coupon: appliedCoupon?.code || null,
        payment: {
          method: paymentMethod,
          status: paymentMethod === "razorpay" ? "paid" : "pending",
          transactionId:
            paymentMethod === "razorpay"
              ? `pay_demo_${Math.random().toString(36).substring(7)}`
              : "cod",
        },
        status: "placed",
      };

      const created = await orderService.createOrder(orderData);
      clearCart();
      toast.success("Order placed successfully! 🎉", {
        icon: "🌸",
        style: { borderRadius: "16px", background: "#2D1B36", color: "#fff" },
      });
      navigate(`/order-success/${created.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Checkout Steps Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 1 ? "text-primary" : "text-mauve"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 1
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-mauve"
              }`}
            >
              1
            </div>
            <span>Shipping Address</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-200 mx-4" />

          <div
            className={`flex items-center gap-2 ${
              currentStep >= 2 ? "text-primary" : "text-mauve"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 2
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-mauve"
              }`}
            >
              2
            </div>
            <span>Payment</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-200 mx-4" />

          <div
            className={`flex items-center gap-2 ${
              currentStep === 3 ? "text-primary" : "text-mauve"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                currentStep === 3
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-mauve"
              }`}
            >
              3
            </div>
            <span>Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Step Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: Address */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-primary-light/50 shadow-card space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-xl font-bold text-plum">
                  Select Delivery Address
                </h2>
              </div>

              {/* Saved Addresses list */}
              {user?.addresses?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-plum uppercase tracking-wider block">
                    Saved Addresses
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-primary bg-primary-light/20 shadow-xs ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-primary"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-plum">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-mauve line-clamp-2">{addr.line1}, {addr.city}</p>
                        <p className="text-xs text-plum font-semibold mt-1">Pin: {addr.pincode}</p>
                        <p className="text-xs text-mauve mt-0.5">Ph: {addr.phone}</p>
                      </div>
                    ))}
                    <div
                      onClick={() => setSelectedAddressId("new")}
                      className={`p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center cursor-pointer min-h-[110px] text-center transition-all ${
                        selectedAddressId === "new"
                          ? "border-primary bg-primary-light/20"
                          : "border-gray-300 text-mauve hover:border-primary"
                      }`}
                    >
                      <Plus className="w-5 h-5 text-primary mb-1" />
                      <span className="text-xs font-semibold text-plum">Add New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add New Address Form if selected */}
              {(selectedAddressId === "new" || !user?.addresses?.length) && (
                <form onSubmit={handleAddressSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-mauve block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-mauve block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-mauve block mb-1">
                      Street Address / Flat / Floor *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4B, Silver Oak Heights, MG Road"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-mauve block mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near City Mall"
                      value={newAddress.line2}
                      onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-mauve block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-mauve block mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-mauve block mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="400052"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="primary" size="lg" type="submit" className="w-full">
                      Deliver to this Address
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              )}

              {selectedAddressId !== "new" && user?.addresses?.length > 0 && (
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setCurrentStep(2)}
                  >
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Payment */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-primary-light/50 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-xl font-bold text-plum">
                    Choose Payment Option
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Change Address
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                {/* Razorpay Online */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                    paymentMethod === "razorpay"
                      ? "border-primary bg-primary-light/20 shadow-xs ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-primary"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center mt-0.5">
                    {paymentMethod === "razorpay" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold text-sm text-plum">
                        Online Payment (Razorpay)
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-plum">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">UPI</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">Cards</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">Netbanking</span>
                      </div>
                    </div>
                    <p className="text-xs text-mauve mt-1">
                      Pay instantly with Google Pay, PhonePe, Paytm, Credit/Debit card or Netbanking. Zero convenience fees.
                    </p>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary-light/20 shadow-xs ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-primary"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center mt-0.5">
                    {paymentMethod === "cod" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold text-sm text-plum">
                        Cash on Delivery (COD)
                      </h3>
                      <Banknote className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-mauve mt-1">
                      Pay in cash or digital UPI upon doorstep delivery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="secondary" size="md" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setCurrentStep(3)}
                >
                  Review Order
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Place */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-primary-light/50 shadow-card space-y-6">
              <h2 className="font-heading text-xl font-bold text-plum pb-4 border-b border-gray-100">
                Review & Confirm Your Order
              </h2>

              {/* Delivery Details Recap */}
              <div className="p-4 bg-ivory rounded-2xl border border-primary-light/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-plum uppercase tracking-wider">
                    Delivering To
                  </span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs font-semibold text-plum">{getActiveAddress().name}</p>
                <p className="text-xs text-mauve">
                  {getActiveAddress().line1}, {getActiveAddress().city}, {getActiveAddress().state} - {getActiveAddress().pincode}
                </p>
                <p className="text-xs text-mauve">Phone: {getActiveAddress().phone}</p>
              </div>

              {/* Payment Method Recap */}
              <div className="p-4 bg-ivory rounded-2xl border border-primary-light/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-plum uppercase tracking-wider block">
                    Payment Method
                  </span>
                  <p className="text-xs font-semibold text-plum mt-1">
                    {paymentMethod === "razorpay"
                      ? "Razorpay Secure Gateway (Instant UPI / Cards)"
                      : "Cash on Delivery"}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-plum uppercase tracking-wider block">
                  Items in this order ({items.length})
                </span>
                {items.map((item) => (
                  <div key={item.sku} className="flex gap-3 items-center text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-plum truncate">{item.name}</p>
                      <p className="text-mauve text-[11px]">
                        Size: {item.size} • Qty: {item.qty}
                      </p>
                    </div>
                    <span className="font-bold text-plum font-heading">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-3">
                <Button variant="secondary" size="md" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 shadow-lg"
                  loading={isSubmitting}
                  onClick={handlePlaceOrder}
                >
                  Place Order • {formatPrice(total)}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Sticky Price Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-primary-light/50 shadow-card space-y-5 sticky top-24">
          <h3 className="font-heading text-lg font-bold text-plum border-b border-gray-100 pb-3">
            Summary ({items.length} items)
          </h3>

          <div className="space-y-2 text-xs text-mauve">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-plum">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-plum">
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold text-plum">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-plum pt-3 border-t border-gray-100">
              <span>Total Payable</span>
              <span className="text-primary font-heading text-xl font-bold">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Estimated delivery in 3 to 5 business days</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-mauve pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

