import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../utils/constants";
import { ArrowUpRight } from "lucide-react";

// Exact 6 categories preserved with authentic imagery matching the reference image layout
const SILHOUETTE_DATA = [
  {
    id: "sarees",
    name: "Sarees",
    slug: "sarees",
    itemCount: 48,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kurtis",
    name: "Kurtis & Suits",
    slug: "kurtis",
    itemCount: 64,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lehengas",
    name: "Lehengas",
    slug: "lehengas",
    itemCount: 32,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ethnic-sets",
    name: "Ethnic Sets",
    slug: "ethnic-sets",
    itemCount: 36,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "western-wear",
    name: "Western Wear",
    slug: "western-wear",
    itemCount: 40,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "accessories",
    name: "Dupattas & Clutches",
    slug: "accessories",
    itemCount: 24,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
  },
];

// Quick Budget & Occasion row
const QUICK_BUDGET_OCCASION = [
  { id: "under-999", title: "Under 999", link: "/shop?maxPrice=999" },
  { id: "under-1499", title: "Under 1499", link: "/shop?maxPrice=1499" },
  { id: "office-wear", title: "Office Wear", link: "/shop?occasion=Work+Wear" },
  { id: "daily-wear", title: "Daily Wear", link: "/shop?occasion=Daily+Wear" },
  { id: "wedding", title: "Wedding", link: "/shop?occasion=Wedding" },
  { id: "party-wear", title: "Party Wear", link: "/shop?occasion=Party+Wear" },
];

export const CategoryGrid = () => {
  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Centered Minimalist Section Header - Matching Reference Style */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-1.5">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-plum tracking-tight">
          Shop by Silhouette
        </h2>
        <p className="text-xs sm:text-sm text-mauve font-light">
          Curated handcrafted weaves, festive sets, and signature couture
        </p>
      </div>

      {/* Circular Medallion Cards Row with Red Ring & Bottom Label - Exact Match to Reference Image */}
      <div className="flex items-center justify-start lg:justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-6 pt-2 px-2 no-scrollbar">
        {SILHOUETTE_DATA.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group flex flex-col items-center shrink-0 cursor-pointer"
          >
            {/* Circular Medallion Frame with Red Ring */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-[2.5px] border-primary/80 group-hover:border-primary group-hover:shadow-glow group-hover:scale-105 transition-all duration-300 bg-ivory shadow-card">
              {/* High-Resolution Portrait Imagery */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Bottom Arc Dark Vignette for Pristine Typography Contrast */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-plum/95 via-plum/60 to-transparent pointer-events-none" />

              {/* Category Name Centered inside the bottom of the circle */}
              <div className="absolute inset-x-0 bottom-0 pb-3 sm:pb-4.5 px-2 text-center z-10">
                <span className="text-white text-xs sm:text-sm lg:text-base font-bold tracking-tight block drop-shadow-md group-hover:text-gold-light transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-200 font-medium block mt-0.5 opacity-90">
                  {cat.itemCount}+ Styles
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Filter Capsule Pills Below */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        <span className="text-xs text-mauve font-semibold mr-1 hidden sm:inline">
          Quick Filters:
        </span>
        {QUICK_BUDGET_OCCASION.map((btn) => (
          <Link
            key={btn.id}
            to={btn.link}
            className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:text-primary text-xs font-semibold text-plum transition-all shadow-xs hover:shadow-soft"
          >
            {btn.title}
          </Link>
        ))}
        <Link
          to="/shop"
          className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
