import React, { useState, useEffect } from "react";
import { getTenantCollection, getTenantDoc } from "../../services/firebase";
import { getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { INITIAL_COUPONS } from "../../services/mockData";
import { formatPrice } from "../../utils/formatters";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Plus, Tag, Trash2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: 15,
    minCartValue: 999,
    maxDiscount: 500,
    description: "",
  });

  const loadCoupons = async () => {
    try {
      const snap = await getDocs(getTenantCollection("coupons"));
      if (!snap.empty) {
        setCoupons(snap.docs.map((d) => ({ ...d.data() })));
      } else {
        setCoupons(INITIAL_COUPONS);
      }
    } catch (e) {
      console.error(e);
      setCoupons(INITIAL_COUPONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggle = async (code) => {
    const target = coupons.find((c) => c.code === code);
    if (!target) return;
    const newStatus = !target.isActive;

    try {
      await setDoc(
        getTenantDoc("coupons", code),
        { isActive: newStatus, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setCoupons(
        coupons.map((c) => (c.code === code ? { ...c, isActive: newStatus } : c))
      );
      toast.success(`Coupon ${code} status updated`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update coupon status");
    }
  };

  const handleDelete = async (code) => {
    if (window.confirm(`Delete coupon ${code} from tenant database?`)) {
      try {
        await deleteDoc(getTenantDoc("coupons", code));
        setCoupons(coupons.filter((c) => c.code !== code));
        toast.success("Coupon removed from tenant Firestore");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete coupon");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code) {
      toast.error("Please enter a coupon code");
      return;
    }
    const cleanCode = form.code.toUpperCase().trim();
    const newCoupon = {
      ...form,
      code: cleanCode,
      isActive: true,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(getTenantDoc("coupons", cleanCode), newCoupon);
      setCoupons([newCoupon, ...coupons]);
      setModalOpen(false);
      toast.success(`Coupon ${cleanCode} created in tenant Firestore!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create coupon in Firestore");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-plum">
            Promotional Coupons & Offers
          </h1>
          <p className="text-xs text-mauve mt-1">
            Tenant collection: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">tenants/ladie-cloth-ecom-product/coupons</code>
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setForm({
              code: "",
              type: "percent",
              value: 15,
              minCartValue: 999,
              maxDiscount: 500,
              description: "",
            });
            setModalOpen(true);
          }}
        >
          Create New Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.code}
            className={`bg-white rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between ${
              c.isActive ? "border-primary-light/60" : "border-gray-200 opacity-60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-plum tracking-wider font-mono">
                  {c.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    c.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="text-2xl font-bold text-primary">
                {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
              </div>

              <p className="text-xs text-mauve">{c.description || "Applicable on eligible orders."}</p>

              <div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-plum">
                <div>Min Cart Value: <strong>{formatPrice(c.minCartValue)}</strong></div>
                {c.maxDiscount && <div>Max Discount Cap: <strong>{formatPrice(c.maxDiscount)}</strong></div>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => handleToggle(c.code)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {c.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(c.code)}
                className="text-gray-400 hover:text-red-500 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Discount Coupon">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-plum font-semibold block mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. DIWALI30"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 uppercase font-mono font-bold focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-plum font-semibold block mb-1">Discount Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
              >
                <option value="percent">Percentage (% OFF)</option>
                <option value="flat">Flat Amount (₹ OFF)</option>
              </select>
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">Discount Value *</label>
              <input
                type="number"
                required
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-plum font-semibold block mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={form.minCartValue}
                onChange={(e) => setForm({ ...form, minCartValue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">Max Cap (₹)</label>
              <input
                type="number"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Short Description</label>
            <input
              type="text"
              placeholder="e.g. 15% OFF on festive sarees and kurtis above ₹999"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" className="flex-1">
              Publish Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
