import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { useAuthStore } from "../../store/authStore";
import { formatPrice, formatDate } from "../../utils/formatters";
import { ORDER_STATUS_LABELS } from "../../utils/constants";
import { Button } from "../../components/common/Button";
import { Package, ArrowRight, Truck, Clock } from "lucide-react";

export const OrdersPage = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders(user?.uid);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between pb-6 border-b border-primary-light/50 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
            My Orders
          </h1>
          <p className="text-xs text-mauve mt-1">Track active deliveries and view invoice history</p>
        </div>
        <Link to="/shop">
          <Button variant="secondary" size="sm">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary-light/40 space-y-4">
          <Package className="w-16 h-16 text-primary-light mx-auto" />
          <h3 className="font-heading text-xl font-bold text-plum">No Orders Placed Yet</h3>
          <p className="text-xs text-mauve max-w-sm mx-auto">
            You haven't placed any orders with us yet. Discover our latest festive collections today.
          </p>
          <Link to="/shop">
            <Button variant="primary" size="md">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = ORDER_STATUS_LABELS[order.status] || {
              label: order.status,
              color: "bg-gray-100 text-gray-800",
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-primary-light/50 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-plum text-sm font-heading">
                      {order.orderNumber}
                    </span>
                    <span className="text-mauve">•</span>
                    <span className="text-mauve">{formatDate(order.createdAt)}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-plum font-heading">
                      Total: {formatPrice(order.pricing?.total)}
                    </span>
                    <Link to={`/account/orders/${order.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-plum">{item.name}</h4>
                          <p className="text-[11px] text-mauve">
                            Size: {item.size} • Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-plum">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking bar if dispatched */}
                {order.tracking?.trackingId && (
                  <div className="p-3 bg-ivory rounded-2xl border border-primary-light/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-plum">
                      <Truck className="w-4 h-4 text-primary" />
                      <span>
                        Courier: <strong>{order.tracking.courier}</strong> ({order.tracking.trackingId})
                      </span>
                    </div>
                    <span className="text-primary font-semibold">Active Dispatch</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

