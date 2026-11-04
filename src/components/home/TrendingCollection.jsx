import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export const TrendingCollection = () => {
  return (
    <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-4xl overflow-hidden shadow-card border border-primary-light/40">
        {/* Left Side: Editorial Dual Visuals */}
        <div className="grid grid-cols-2 gap-3.5 p-4 sm:p-6 h-[400px] sm:h-[500px]">
          <div className="rounded-3xl overflow-hidden relative group">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
              alt="Handwoven Saree"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                Heritage Silks
              </span>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden relative group">
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80"
              alt="Bridal Couture"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                Bridal Lehengas
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: High-Fashion Headline & Stats */}
        <div className="p-6 sm:p-12 lg:pr-16 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Editorial Spotlight
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-plum leading-[1.1] tracking-tight">
            Royal Weaves. Modern Romance.
          </h2>

          <p className="text-sm sm:text-base text-mauve leading-relaxed font-light">
            Each drape reflects over 180 hours of meticulous handloom artistry across Varanasi and Kanchipuram.
          </p>

          {/* Quick Impressive Stats Pills */}
          <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
            <div>
              <span className="font-extrabold text-2xl text-primary block tracking-tight">100%</span>
              <span className="text-xs text-mauve font-medium">Mulberry Silk</span>
            </div>
            <div>
              <span className="font-extrabold text-2xl text-secondary block tracking-tight">180+ Hrs</span>
              <span className="text-xs text-mauve font-medium">Artisan Needlework</span>
            </div>
          </div>

          <div className="pt-1">
            <Link to="/category/sarees">
              <Button variant="primary" size="lg" className="shadow-soft group">
                <span>Explore Royal Silks</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
