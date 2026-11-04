import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import { ProductCard } from "../components/product/ProductCard";
import { ProductFilters } from "../components/product/ProductFilters";
import { SORT_OPTIONS } from "../utils/constants";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: initialCategory,
    search: initialSearch,
    fabric: [],
    occasion: [],
    sizes: [],
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
    inStock: false,
  });

  // Sync when search URL param changes
  useEffect(() => {
    const q = searchParams.get("search") || "";
    const cat = searchParams.get("category") || "all";
    setFilters((prev) => ({ ...prev, search: q, category: cat }));
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      search: "",
      fabric: [],
      occasion: [],
      sizes: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
      inStock: false,
    });
    setSearchParams({});
  };

  const removeChip = (key, value = null) => {
    if (value && Array.isArray(filters[key])) {
      setFilters({ ...filters, [key]: filters[key].filter((v) => v !== value) });
    } else {
      setFilters({ ...filters, [key]: key === "category" ? "all" : "" });
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-primary-light/50 gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
            {filters.search
              ? `Results for "${filters.search}"`
              : filters.category && filters.category !== "all"
              ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Collection`
              : "All Collections"}
          </h1>
          <p className="text-xs sm:text-sm text-mauve mt-1">
            Showing {products.length} hand-crafted pieces
          </p>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-4 py-2 rounded-full border border-primary text-primary bg-white text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-mauve font-medium hidden sm:inline">Sort By:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-3 py-2 rounded-full border border-gray-200 bg-white text-xs font-semibold text-plum focus:outline-none focus:border-primary cursor-pointer shadow-xs"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        {filters.category && filters.category !== "all" && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium">
            Category: {filters.category}
            <button onClick={() => removeChip("category")} className="hover:text-plum">
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        {filters.fabric?.map((f) => (
          <span
            key={f}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium"
          >
            Fabric: {f}
            <button onClick={() => removeChip("fabric", f)} className="hover:text-plum">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {filters.sizes?.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium"
          >
            Size: {s}
            <button onClick={() => removeChip("sizes", s)} className="hover:text-plum">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {filters.occasion?.map((o) => (
          <span
            key={o}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium"
          >
            {o}
            <button onClick={() => removeChip("occasion", o)} className="hover:text-plum">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {(filters.minPrice || filters.maxPrice) && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-medium">
            ₹{filters.minPrice || 0} - ₹{filters.maxPrice || "Any"}
            <button
              onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })}
              className="hover:text-plum"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-4">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            totalResults={products.length}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[3/4] bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-primary-light/40 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-light/50 flex items-center justify-center text-primary mx-auto text-2xl">
                🌸
              </div>
              <h3 className="font-heading text-xl font-semibold text-plum">
                No Outfits Matched Your Filters
              </h3>
              <p className="text-xs text-mauve max-w-sm mx-auto">
                Try widening your price range, clearing selected fabric or size filters to discover more designs.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-gradient-cta text-white text-xs font-semibold shadow-soft"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom-sheet / Slide-in Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-plum/60 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-screen max-w-xs bg-white shadow-2xl flex flex-col h-full overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-plum">Filter Outfits</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-full text-mauve hover:text-plum"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <ProductFilters
                    filters={filters}
                    onChange={setFilters}
                    onReset={handleResetFilters}
                    totalResults={products.length}
                  />
                </div>
                <div className="p-4 border-t border-gray-100 mt-auto bg-white sticky bottom-0">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full py-3 rounded-full bg-gradient-cta text-white font-semibold text-xs shadow-soft"
                  >
                    Apply Filters ({products.length} items)
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
