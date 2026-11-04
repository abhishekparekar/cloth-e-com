import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../services/productService";
import { ProductCard } from "../components/product/ProductCard";
import { ProductFilters } from "../components/product/ProductFilters";
import { CATEGORIES, SORT_OPTIONS } from "../utils/constants";
import { SlidersHorizontal, ArrowLeft } from "lucide-react";

export const CategoryPage = () => {
  const { slug } = useParams();
  const categoryInfo = CATEGORIES.find((c) => c.slug === slug) || {
    name: slug?.replace("-", " "),
    tagline: "Handcrafted Luxury Apparel",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: slug,
    sortBy: "newest",
    fabric: [],
    occasion: [],
    sizes: [],
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: slug }));
  }, [slug]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [filters, slug]);

  return (
    <div>
      {/* Category Hero Banner */}
      <div className="relative h-64 sm:h-80 bg-plum overflow-hidden">
        <img
          src={categoryInfo.image}
          alt={categoryInfo.name}
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/60 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10 text-white">
          <Link
            to="/shop"
            className="inline-flex items-center text-xs text-primary-light hover:text-white mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to All Collections
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight">
            {categoryInfo.name}
          </h1>
          <p className="text-sm text-gray-200 mt-1 max-w-lg font-light">
            {categoryInfo.tagline}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <p className="text-xs text-mauve">Showing {products.length} outfits</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-mauve hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-plum bg-white focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8 items-start">
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={() =>
                setFilters({
                  category: slug,
                  sortBy: "newest",
                  fabric: [],
                  occasion: [],
                  sizes: [],
                  minPrice: "",
                  maxPrice: "",
                  inStock: false,
                })
              }
              totalResults={products.length}
            />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="aspect-[3/4] bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-mauve border border-primary-light/40">
                No items found for this category with selected filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
