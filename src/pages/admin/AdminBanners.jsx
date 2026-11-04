import React, { useState, useEffect } from "react";
import { getTenantCollection, getTenantDoc } from "../../services/firebase";
import { getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { INITIAL_BANNERS } from "../../services/mockData";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    ctaText: "Shop Now",
    link: "/shop",
    badge: "New Season",
    image: "",
  });

  const loadBanners = async () => {
    try {
      const snap = await getDocs(getTenantCollection("banners"));
      if (!snap.empty) {
        setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else {
        setBanners(INITIAL_BANNERS);
      }
    } catch (e) {
      console.error(e);
      setBanners(INITIAL_BANNERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setForm({
      title: "",
      subtitle: "",
      ctaText: "Shop Collection",
      link: "/shop",
      badge: "Exclusive Drop",
      image: "/heroBanner1.png",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBanner(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      ctaText: b.ctaText,
      link: b.link,
      badge: b.badge || "",
      image: b.image,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this hero banner from tenant database?")) {
      try {
        await deleteDoc(getTenantDoc("banners", id));
        setBanners(banners.filter((b) => b.id !== id));
        toast.success("Banner deleted from Firestore");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete banner");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      toast.error("Please enter a title and image URL");
      return;
    }

    try {
      const bannerId = editingBanner ? editingBanner.id : `banner-${Date.now()}`;
      const payload = {
        ...form,
        id: bannerId,
        updatedAt: serverTimestamp(),
      };

      await setDoc(getTenantDoc("banners", bannerId), payload, { merge: true });

      if (editingBanner) {
        setBanners(banners.map((b) => (b.id === bannerId ? payload : b)));
        toast.success("Hero slide updated in tenant Firestore");
      } else {
        setBanners([...banners, payload]);
        toast.success("New hero slide added to tenant Firestore");
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save banner");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-plum">
            Hero Banners Manager
          </h1>
          <p className="text-xs text-mauve mt-1">
            Tenant collection: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">tenants/ladie-cloth-ecom-product/banners</code>
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Hero Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-plum">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/40 to-transparent p-4 flex flex-col justify-end text-white">
                {b.badge && (
                  <span className="text-[10px] bg-primary font-bold px-2 py-0.5 rounded-full w-max mb-1 uppercase">
                    {b.badge}
                  </span>
                )}
                <h3 className="font-bold text-base line-clamp-1">{b.title}</h3>
                <p className="text-[11px] text-gray-200 line-clamp-1">{b.subtitle}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs text-mauve border-t border-gray-100">
              <span className="truncate max-w-[150px]">Link: {b.link}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-mauve hover:text-plum"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Hero Slide Editor">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-plum font-semibold block mb-1">Headline Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-plum font-bold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-plum font-semibold block mb-1">CTA Button Text</label>
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">Target Link</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Background Image URL *</label>
            <input
              type="text"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-mono text-[11px] focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" className="flex-1">
              Save Slide
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
