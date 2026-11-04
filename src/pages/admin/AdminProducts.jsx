import React, { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { CATEGORIES, FABRICS, OCCASIONS } from "../../utils/constants";
import { formatPrice, slugify } from "../../utils/formatters";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Plus, Search, Edit2, Trash2, Image, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "sarees",
    price: "",
    mrp: "",
    discountPercent: 0,
    fabric: "Banarasi Silk",
    care: "Dry Clean Only",
    description: "",
    images: "",
    stock: 15,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
  });

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      categoryId: "sarees",
      price: "",
      mrp: "",
      discountPercent: 0,
      fabric: "Banarasi Silk",
      care: "Dry Clean Only",
      description: "",
      images: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      stock: 15,
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      price: p.price,
      mrp: p.mrp || "",
      discountPercent: p.discountPercent || 0,
      fabric: p.fabric || "",
      care: p.care || "",
      description: p.description || "",
      images: p.images?.join("\n") || "",
      stock: p.variants?.[0]?.stock || 15,
      isFeatured: p.isFeatured || false,
      isNew: p.isNew || false,
      isBestSeller: p.isBestSeller || false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this product from catalog?")) {
      await productService.deleteProduct(id);
      toast.success("Product deleted successfully");
      loadProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in the product title and price");
      return;
    }

    const priceNum = Number(formData.price);
    const mrpNum = formData.mrp ? Number(formData.mrp) : priceNum;
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
    const imagesArray = formData.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload = {
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      categoryId: formData.categoryId,
      price: priceNum,
      mrp: mrpNum,
      discountPercent: discount,
      fabric: formData.fabric,
      care: formData.care,
      description: formData.description,
      images: imagesArray.length ? imagesArray : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
      variants: [
        {
          sku: `${formData.categoryId.toUpperCase().slice(0, 3)}-${Date.now()}`,
          size: "Free Size",
          color: "Standard",
          stock: Number(formData.stock) || 10,
        },
      ],
      isFeatured: formData.isFeatured,
      isNew: formData.isNew,
      isBestSeller: formData.isBestSeller,
      status: "published",
    };

    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, productPayload);
      toast.success("Product updated successfully! 🌸");
    } else {
      await productService.createProduct(productPayload);
      toast.success("New product added to catalog! 🌸");
    }

    setModalOpen(false);
    loadProducts();
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryId?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-plum">
            Product Catalog Management
          </h1>
          <p className="text-xs text-mauve mt-1">
            Storefront inventory under tenant collection: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">tenants/ladie-cloth-ecom-product/products</code>
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Add New Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products by title, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-mauve absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-mauve">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-plum focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-plum font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">MRP</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images?.[0]}
                        alt={prod.name}
                        className="w-12 h-14 object-cover rounded-lg shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-plum">{prod.name}</h4>
                        <span className="text-[10px] text-mauve font-mono">{prod.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium uppercase text-plum">
                    {prod.categoryId}
                  </td>
                  <td className="py-3 px-4 font-bold text-plum">
                    {formatPrice(prod.price)}
                  </td>
                  <td className="py-3 px-4 text-mauve">
                    {prod.mrp ? formatPrice(prod.mrp) : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 text-[10px]">
                      {prod.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 15} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {prod.isNew && (
                        <span className="px-1.5 py-0.2 bg-gold-light/40 text-plum font-bold rounded text-[9px]">
                          NEW
                        </span>
                      )}
                      {prod.isBestSeller && (
                        <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 font-bold rounded text-[9px]">
                          BESTSELLER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-mauve hover:text-plum transition-colors"
                        title="Edit Outfit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Outfit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Edit Outfit Details" : "Add New Outfit"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-plum font-semibold block mb-1">Outfit Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: slugify(e.target.value),
                });
              }}
              placeholder="e.g. Royal Banarasi Silk Saree in Magenta"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-plum font-semibold block mb-1">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">Fabric</label>
              <select
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
              >
                {FABRICS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-plum font-semibold block mb-1">Sale Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2499"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">MRP (₹)</label>
              <input
                type="number"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                placeholder="3999"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-plum font-semibold block mb-1">Total Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="15"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">
              Image URLs (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-mono text-[11px] focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-plum font-semibold block mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe craftsmanship, weave, motifs, styling advice..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 font-semibold text-plum cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              Mark as New Arrival
            </label>
            <label className="flex items-center gap-2 font-semibold text-plum cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              Mark as Best Seller
            </label>
            <label className="flex items-center gap-2 font-semibold text-plum cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              Featured
            </label>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" className="flex-1">
              {editingProduct ? "Save Changes" : "Publish to Storefront"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

