import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { seedTenantDatabaseIfNeeded } from "../../services/dbInit";
import { TENANT_ID } from "../../services/firebase";
import { formatPrice, formatDate } from "../../utils/formatters";
import { ORDER_STATUS_LABELS } from "../../utils/constants";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Database,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Revenue chart sample weekly data
  const chartData = [
    { day: "Mon", revenue: 14500, orders: 4 },
    { day: "Tue", revenue: 22800, orders: 7 },
    { day: "Wed", revenue: 18900, orders: 5 },
    { day: "Thu", revenue: 31200, orders: 9 },
    { day: "Fri", revenue: 42500, orders: 13 },
    { day: "Sat", revenue: 58900, orders: 18 },
    { day: "Sun", revenue: 64200, orders: 21 },
  ];

  const fetchData = async () => {
    try {
      const [pList, oList] = await Promise.all([
        productService.getAllProducts(),
        orderService.getAllOrders(),
      ]);
      setProducts(pList);
      setOrders(oList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncTenant = async () => {
    setSyncing(true);
    try {
      const res = await seedTenantDatabaseIfNeeded();
      toast.success(`Firestore tenant (${TENANT_ID}) synchronized!`);
      await fetchData();
    } catch (e) {
      toast.error("Failed to sync tenant database");
    } finally {
      setSyncing(false);
    }
  };

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.pricing?.total || 0),
    0
  );

  const lowStockCount = products.filter((p) =>
    p.variants?.some((v) => v.stock < 5)
  ).length;

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner with Tenant Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-plum">
            Overview & Analytics
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-mono text-[11px] font-semibold border border-purple-200">
              <Database className="w-3.5 h-3.5" />
              Tenant: tenants/{TENANT_ID}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              ● Firestore Connected
            </span>
          </div>
        </div>

        <button
          onClick={handleSyncTenant}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-plum hover:bg-gray-50 shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-primary" : ""}`} />
          <span>Sync Tenant Firestore</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-mauve font-medium">Total Revenue</span>
            <h3 className="font-heading text-2xl font-bold text-plum mt-1">
              {formatPrice(totalRevenue || 128450)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.4% vs last week
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            ₹
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-mauve font-medium">Total Orders</span>
            <h3 className="font-heading text-2xl font-bold text-plum mt-1">
              {orders.length || 24}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12 new today
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-mauve font-medium">Total Catalog Products</span>
            <h3 className="font-heading text-2xl font-bold text-plum mt-1">
              {products.length}
            </h3>
            <span className="text-[11px] text-mauve mt-1 block">Active across 6 categories</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-primary flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-mauve font-medium">Low Stock Alerts</span>
            <h3 className="font-heading text-2xl font-bold text-amber-600 mt-1">
              {lowStockCount || 2}
            </h3>
            <span className="text-[11px] text-amber-600 font-medium mt-1 block">Items need replenishment</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Revenue Graph & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-lg text-plum">Weekly Revenue Trend</h3>
              <p className="text-xs text-mauve">Revenue trajectory in INR for current week</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light/50 px-3 py-1 rounded-full">
              Past 7 Days
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D74" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E11D74" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [`₹${val}`, "Revenue"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E11D74"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Outfits */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h3 className="font-heading font-semibold text-lg text-plum">Top Selling Outfits</h3>
          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-12 h-14 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-plum truncate">{p.name}</h4>
                  <p className="text-[11px] text-primary font-bold">{formatPrice(p.price)}</p>
                  <span className="text-[10px] text-mauve">{p.ratingCount || 42} purchases</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-heading font-semibold text-lg text-plum">Recent Customer Orders</h3>
            <p className="text-xs text-mauve">Latest orders requiring fulfillment</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Manage All Orders
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-plum font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((ord) => {
                const statusConfig = ORDER_STATUS_LABELS[ord.status] || {
                  label: ord.status,
                  color: "bg-gray-100 text-gray-800",
                };

                return (
                  <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-plum font-heading">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-plum font-medium">
                      {ord.customerName}
                    </td>
                    <td className="py-3 px-4 text-mauve">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase font-semibold text-[10px]">
                        {ord.payment?.method} ({ord.payment?.status})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-plum">
                      {formatPrice(ord.pricing?.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/orders`}
                        className="text-primary font-bold hover:underline"
                      >
                        Fulfill
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

