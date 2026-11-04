import React, { useState, useEffect } from "react";
import { getTenantCollection, getTenantDoc } from "../../services/firebase";
import { getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { CATEGORIES } from "../../utils/constants";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Plus, Edit2, Trash2, Layers } from "lucide-react";
import toast from "react-hot-toast";

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    tagline: "",
    image: "",
  });

  const loadCategories = async () => {
    try {
      const snap = await getDocs(getTenantCollection("categories"));
      if (!snap.empty) {
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else {
        setCategories(CATEGORIES);
      }
    } catch (e) {
      console.error(e);
      setCategories(CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      slug: "",
      tagline: "",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      tagline: cat.tagline,
      image: cat.image,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(getTenantDoc("categories", id));
        setCategories(categories.filter((c) => c.id !== id));
        toast.success("Category deleted from Firestore");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete category");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Please enter a category name and slug");
      return;
    }

    try {
      const catId = editingCategory ? editingCategory.id : form.slug;
      const catData = {
        ...form,
        id: catId,
        itemCount: editingCategory?.itemCount || 12,
        featured: true,
        updatedAt: serverTimestamp(),
      };

      await setDoc(getTenantDoc("categories", catId), catData, { merge: true });

      if (editingCategory) {
        setCategories(categories.map((c) => (c.id === catId ? catData : c)));
        toast.success("Category updated in tenant Firestore!");
      } else {
        setCategories([...categories, catData]);
        toast.success("New category created in tenant Firestore!");
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-plum">
            Categories & Collections
          </h1>
          <p className="text-xs text-mauve mt-1">
            Tenant collection: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">tenants/ladie-cloth-ecom-product/categories</code>
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between group"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-ivory">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold">
                  {cat.itemCount || 0}+ Live Outfits
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-plum">{cat.name}</h3>
                <p className="text-xs text-mauve mt-0.5">{cat.tagline}</p>
                <code className="text-[10px] text-primary bg-primary-light/40 px-2 py-0.5 rounded font-mono mt-2 inline-block">
                  /category/{cat.slug}
                </code>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-xl text-mauve hover:text-plum hover:bg-gray-100 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-plum font-semibold block mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              placeholder="e.g. Sarees"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum font-medium"
            />
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="e.g. Banarasi, Kanjeevaram & Silk"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Cover Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-mono text-[11px] focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" className="flex-1">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
