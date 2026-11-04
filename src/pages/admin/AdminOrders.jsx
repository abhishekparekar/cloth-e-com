import React, { useState, useEffect } from "react";
import { orderService } from "../../services/orderService";
import { formatPrice, formatDate } from "../../utils/formatters";
import { ORDER_STATUS_LABELS } from "../../utils/constants";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Search, Package, Truck, Printer, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("placed");
  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    const data = await orderService.getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenManage = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setCourierName(ord.tracking?.courier || "");
    setTrackingId(ord.tracking?.trackingId || "");
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const trackingInfo = {
      courier: courierName,
      trackingId: trackingId,
      url: courierName ? `https://track.example.com/${trackingId}` : "",
    };

    await orderService.updateOrderStatus(selectedOrder.id, newStatus, trackingInfo);
    toast.success(`Order ${selectedOrder.orderNumber} updated to ${newStatus}`);
    setModalOpen(false);
    loadOrders();
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone?.includes(search);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-plum">
          Orders & Fulfillment
        </h1>
        <p className="text-xs text-mauve mt-1">
          Fulfillment directory under tenant: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">tenants/ladie-cloth-ecom-product/orders</code>
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by order #, customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-mauve absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-mauve">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-plum focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-plum font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ord) => {
                const statusConfig = ORDER_STATUS_LABELS[ord.status] || {
                  label: ord.status,
                  color: "bg-gray-100 text-gray-800",
                };

                return (
                  <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-plum font-heading">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-plum block">{ord.customerName}</span>
                      <span className="text-[10px] text-mauve">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-plum">
                        {ord.items?.length || 1} {ord.items?.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-mauve">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase font-semibold text-[10px]">
                        {ord.payment?.method} ({ord.payment?.status})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-plum font-heading">
                      {formatPrice(ord.pricing?.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenManage(ord)}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedOrder ? `Manage ${selectedOrder.orderNumber}` : "Manage Order"}
      >
        {selectedOrder && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div className="p-3 bg-ivory rounded-xl border border-primary-light/40 space-y-1">
              <p className="font-semibold text-plum">
                Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})
              </p>
              <p className="text-mauve">
                Delivery: {selectedOrder.address?.line1}, {selectedOrder.address?.city} ({selectedOrder.address?.pincode})
              </p>
              <p className="font-bold text-primary">
                Order Value: {formatPrice(selectedOrder.pricing?.total)} via {selectedOrder.payment?.method}
              </p>
            </div>

            <div>
              <label className="text-plum font-semibold block mb-1">Update Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-plum font-bold focus:outline-none focus:border-primary"
              >
                {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-plum font-semibold block mb-1">Courier Partner</label>
                <input
                  type="text"
                  placeholder="e.g. BlueDart Express"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-plum font-semibold block mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  placeholder="e.g. BLUEDART-992102"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" className="flex-1">
                Save & Update Milestone
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

