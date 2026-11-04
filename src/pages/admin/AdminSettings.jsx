import React, { useState, useEffect } from "react";
import { getTenantDoc } from "../../services/firebase";
import { getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { STORE_CONFIG } from "../../utils/constants";
import { Button } from "../../components/common/Button";
import { Save, Store, Truck, Database } from "lucide-react";
import toast from "react-hot-toast";

export const AdminSettings = () => {
  const [config, setConfig] = useState(STORE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snap = await getDoc(getTenantDoc("settings", "store"));
        if (snap.exists()) {
          setConfig({ ...STORE_CONFIG, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(getTenantDoc("settings", "store"), {
        ...config,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success("Store settings updated in tenant Firestore!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-plum">
          Store Settings
        </h1>
        <p className="text-xs text-mauve mt-1">
          Tenant path: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">tenants/ladie-cloth-ecom-product/settings/store</code>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Store Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg text-plum">Store Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-plum font-semibold block mb-1">Store Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum font-medium"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-plum font-semibold block mb-1">Customer Support Phone</label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">WhatsApp Concierge</label>
              <input
                type="text"
                value={config.whatsappNumber}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">Support Email</label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="text-plum font-semibold block mb-1">Physical Flagship Address</label>
            <input
              type="text"
              value={config.address}
              onChange={(e) => setConfig({ ...config, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Shipping & Tax Config */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Truck className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg text-plum">
              Pricing, Shipping & Tax
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-plum font-semibold block mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={config.freeShippingThreshold}
                onChange={(e) =>
                  setConfig({ ...config, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={config.standardShippingFee}
                onChange={(e) =>
                  setConfig({ ...config, standardShippingFee: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={config.taxRate * 100}
                onChange={(e) =>
                  setConfig({ ...config, taxRate: Number(e.target.value) / 100 })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold"
              />
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" type="submit" icon={Save}>
          Save Store Configuration
        </Button>
      </form>
    </div>
  );
};
