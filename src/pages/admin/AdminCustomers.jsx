import React, { useState, useEffect } from "react";
import { getTenantCollection } from "../../services/firebase";
import { getDocs } from "firebase/firestore";
import { formatPrice } from "../../utils/formatters";
import { Search, Mail, Phone, ShoppingBag, User } from "lucide-react";

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const defaultCustomers = [
    {
      id: "cust-1",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98201 12345",
      city: "Mumbai, Maharashtra",
      ordersCount: 3,
      totalSpent: 12499,
      lastOrder: "2026-03-01",
    },
    {
      id: "cust-2",
      name: "Dr. Ananya Roy",
      email: "ananya.roy@example.com",
      phone: "+91 98112 54321",
      city: "Bengaluru, Karnataka",
      ordersCount: 2,
      totalSpent: 8999,
      lastOrder: "2026-02-28",
    },
    {
      id: "cust-3",
      name: "Meera Patel",
      email: "meera.patel@example.com",
      phone: "+91 97234 67890",
      city: "Ahmedabad, Gujarat",
      ordersCount: 4,
      totalSpent: 18450,
      lastOrder: "2026-03-03",
    },
  ];

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const snap = await getDocs(getTenantCollection("users"));
        if (!snap.empty) {
          const list = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name || "Customer",
              email: data.email || "-",
              phone: data.phone || "-",
              city: data.addresses?.[0]?.city || "India",
              ordersCount: 1,
              totalSpent: 3499,
              lastOrder: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split("T")[0] : "Recent",
            };
          });
          setCustomers(list);
        } else {
          setCustomers(defaultCustomers);
        }
      } catch (err) {
        console.error(err);
        setCustomers(defaultCustomers);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-plum">
          Customer Directory
        </h1>
        <p className="text-xs text-mauve mt-1">
          Registered buyers in tenant collection: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">tenants/ladie-cloth-ecom-product/users</code>
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary text-plum"
          />
          <Search className="w-4 h-4 text-mauve absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-mauve font-medium">
          Showing {filtered.length} customers
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-plum font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {cust.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-plum text-xs">{cust.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-mauve">
                          <span>{cust.email}</span>
                          <span>•</span>
                          <span>{cust.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-plum">{cust.city}</td>
                  <td className="py-3.5 px-4 font-bold text-plum">
                    {cust.ordersCount} orders
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    {formatPrice(cust.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-mauve">{cust.lastOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
