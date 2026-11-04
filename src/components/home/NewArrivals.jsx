import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { ProductCard } from "../product/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await productService.getAllProducts({ newArrival: true });
        setProducts(data.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-[3/4] bg-gray-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-white/70 border-y border-primary-light/40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Fresh On The Loom
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-plum tracking-tight">
              New Arrivals
            </h2>
          </div>

          <Link
            to="/shop?sort=newest"
            className="inline-flex items-center text-xs font-bold text-primary hover:text-secondary transition-colors group"
          >
            Explore All New
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
