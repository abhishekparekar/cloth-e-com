import React, { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { ProductCard } from "../product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export const BestSellers = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "all", label: "All Favourites" },
    { id: "sarees", label: "Sarees" },
    { id: "kurtis", label: "Kurtis" },
    { id: "lehengas", label: "Lehengas" },
    { id: "western-wear", label: "Western" },
  ];

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts({
          category: activeTab,
          bestSeller: true,
        });
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, [activeTab]);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Most Coveted
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-plum tracking-tight">
            Best Sellers
          </h2>
        </div>

        {/* Minimal Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-full border border-gray-200/80 shadow-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-mauve hover:text-plum"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeBestSellerTab"
                  className="absolute inset-0 bg-primary rounded-full shadow-soft"
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid with Framer Motion AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white rounded-3xl animate-pulse" />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-sm text-mauve">
              No bestseller outfits in this category currently.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
