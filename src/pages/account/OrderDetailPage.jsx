import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { formatPrice, formatDate } from "../../utils/formatters";
import { ORDER_STATUS_LABELS } from "../../utils/constants";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const steps = [
    { key: "placed", label: "Placed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "packed", label: "Packed" },
    { key: "shipped", label: "Shipped" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await orderService.getOrderById(id);
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

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
        <Link to="/account/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  const handleRequestReturn = (e) => {
    e.preventDefault();
    if (!returnReason) {
      toast.error("Please provide a reason for return/exchange");
      return;
    }
    setReturnModalOpen(false);
    toast.success("Return request submitted! Our courier partner will schedule doorstep pickup.");
  };

  return (
    <div className="py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/account/orders"
        className="inline-flex items-center text-xs text-mauve hover:text-primary mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to All Orders
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-primary-light/50 shadow-card space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-plum">
                {order.orderNumber}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${ORDER_STATUS_LABELS[order.status]?.color}`}>
                {ORDER_STATUS_LABELS[order.status]?.label}
              </span>
            </div>
            <p className="text-xs text-mauve mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
              Print Invoice
            </Button>
            {order.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={() => setReturnModalOpen(true)}
              >
                Return / Exchange
              </Button>
            )}
          </div>
        </div>

        {/* Order Status Timeline Tracker */}
        <div className="p-6 bg-ivory rounded-2xl border border-primary-light/40 space-y-4">
          <h3 className="font-heading text-sm font-semibold text-plum uppercase tracking-wider">
            Live Order Timeline
          </h3>

          <div className="relative flex items-center justify-between pt-4 pb-2">
            {/* Progress line */}
            <div className="absolute top-7 left-3 right-3 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-gradient-brand transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
                }}
              />
            </div>

            {steps.map((st, i) => {
              const isPassed = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={st.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPassed
                        ? "bg-primary text-white shadow-sm ring-4 ring-primary-light"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium text-center ${
                      isCurrent ? "text-primary font-bold" : isPassed ? "text-plum" : "text-gray-400"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {order.tracking?.trackingId && (
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-plum gap-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span>
                  Courier Partner: <strong>{order.tracking.courier}</strong> (AWB: {order.tracking.trackingId})
                </span>
              </div>
              {order.tracking.url && (
                <a
                  href={order.tracking.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Track on Courier Website →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Address and Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl border border-gray-100 space-y-1 text-xs">
            <h4 className="font-bold text-plum uppercase tracking-wider mb-2">
              Delivery Destination
            </h4>
            <p className="font-semibold text-plum">{order.address?.name}</p>
            <p className="text-mauve">
              {order.address?.line1}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
            </p>
            <p className="text-mauve">Phone: {order.address?.phone}</p>
          </div>

          <div className="p-4 rounded-2xl border border-gray-100 space-y-1 text-xs">
            <h4 className="font-bold text-plum uppercase tracking-wider mb-2">
              Payment Summary
            </h4>
            <p className="text-mauve">Method: <strong className="uppercase text-plum">{order.payment?.method}</strong></p>
            <p className="text-mauve">Status: <strong className="uppercase text-emerald-600">{order.payment?.status}</strong></p>
            <p className="text-mauve">Transaction ID: <strong>{order.payment?.transactionId || "N/A"}</strong></p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h4 className="font-bold text-plum text-xs uppercase tracking-wider">
            Items in this Package
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
      </div>

      {/* Return Request Modal */}
      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Request Return or Exchange"
      >
        <form onSubmit={handleRequestReturn} className="space-y-4 text-xs">
          <p className="text-mauve">
            Items are eligible for return or exchange within 7 days of delivery. Please ensure tags are intact.
          </p>
          <div>
            <label className="text-plum font-semibold block mb-1">Reason for Return</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
            >
              <option value="">Select a reason</option>
              <option value="size">Size didn't fit properly</option>
              <option value="color">Color differed from photos</option>
              <option value="quality">Fabric or stitch quality issue</option>
              <option value="changed_mind">Changed my mind</option>
            </select>
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Additional Notes</label>
            <textarea
              rows={3}
              placeholder="Tell us more about what you'd prefer (e.g. exchange for Size L)..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setReturnModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Return Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

