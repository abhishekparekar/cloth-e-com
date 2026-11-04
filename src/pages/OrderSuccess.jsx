import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../services/orderService";
import { formatPrice, formatDate } from "../utils/formatters";
import { Button } from "../components/common/Button";
import { CheckCircle2, Package, Printer, ArrowRight, Truck, Home } from "lucide-react";
import confetti from "canvas-confetti";

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E11D74", "#7C3AED", "#D4AF37", "#10B981"],
      });
    } catch (e) {
      // ignore
    }

    const loadOrder = async () => {
      const data = await orderService.getOrderById(id);
      setOrder(data);
      setLoading(false);
    };
    loadOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-heading font-bold text-plum">Order Not Found</h2>
        <Link to="/">
          <Button variant="primary">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-primary-light/50 shadow-card space-y-8 print:shadow-none print:border-none">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Order Confirmed
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-mauve max-w-md mx-auto">
            We have received your order <strong>{order.orderNumber}</strong>. A confirmation email and WhatsApp notification have been dispatched.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-ivory rounded-2xl border border-primary-light/40 text-xs text-plum">
          <div>
            <span className="text-mauve block text-[11px]">Order Number</span>
            <span className="font-bold">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-mauve block text-[11px]">Date</span>
            <span className="font-bold">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-mauve block text-[11px]">Payment</span>
            <span className="font-bold uppercase">{order.payment?.method} ({order.payment?.status})</span>
          </div>
          <div>
            <span className="text-mauve block text-[11px]">Total Paid</span>
            <span className="font-bold text-primary">{formatPrice(order.pricing?.total)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-4 rounded-2xl border border-gray-100 space-y-1 text-xs">
          <h4 className="font-bold text-plum uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-primary" />
            Shipping Address
          </h4>
          <p className="font-semibold text-plum">{order.address?.name}</p>
          <p className="text-mauve">
            {order.address?.line1}, {order.address?.line2 ? `${order.address.line2}, ` : ""}
            {order.address?.city}, {order.address?.state} - {order.address?.pincode}
          </p>
          <p className="text-mauve">Phone: {order.address?.phone}</p>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h4 className="font-bold text-plum text-xs uppercase tracking-wider">
            Order Items
          </h4>
          <div className="divide-y divide-gray-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <h5 className="font-semibold text-plum">{item.name}</h5>
                    <p className="text-[11px] text-mauve">
                      Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-plum font-heading text-sm">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-mauve">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-plum">{formatPrice(order.pricing?.subtotal)}</span>
          </div>
          {order.pricing?.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Coupon Discount ({order.coupon})</span>
              <span>-{formatPrice(order.pricing?.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-plum">
              {order.pricing?.shipping === 0 ? "FREE" : formatPrice(order.pricing?.shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span className="font-semibold text-plum">{formatPrice(order.pricing?.tax)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-plum pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-primary font-heading text-lg font-bold">
              {formatPrice(order.pricing?.total)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100 print:hidden">
          <Button
            variant="secondary"
            size="md"
            icon={Printer}
            onClick={handlePrint}
            className="w-full sm:w-auto"
          >
            Print Tax Invoice
          </Button>
          <Link to="/account/orders" className="w-full sm:w-auto flex-1">
            <Button variant="secondary" size="md" icon={Package} className="w-full">
              Track Order Status
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto flex-1">
            <Button variant="primary" size="md" icon={Home} className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

