import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Sparkles, Heart, Award, Users } from "lucide-react";

export const AboutPage = () => {
  return (
    <div className="space-y-16 py-10 sm:py-16">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Our Heritage & Passion
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-plum max-w-2xl mx-auto leading-tight">
          Weaving Modern Grace with Centuries of Indian Craft
        </h1>
        <p className="text-sm sm:text-base text-mauve max-w-xl mx-auto">
          Founded in Mumbai, Aanya Boutique was born out of a profound reverence for India’s textile handloom artisans and a vision to make luxury couture accessible to every woman.
        </p>
      </div>

      {/* Story with Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-6 sm:p-12 border border-primary-light/50 shadow-card">
          <div className="space-y-4 text-xs sm:text-sm text-mauve leading-relaxed">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-plum">
              The Artisan First Philosophy
            </h2>
            <p>
              Every saree in our collection tells the story of an artisan who spent weeks at a wooden handloom. We work directly with over 120 master weaving families in Varanasi, Kanchipuram, Chanderi, and Jaipur, eliminating middlemen to ensure ethical wages and preserve age-old traditions.
            </p>
            <p>
              From pure mulberry silks and handblock printed mulmul cottons to intricately embroidered zardozi bridal lehengas, our designs celebrate both timeless tradition and contemporary silhouette fluidity.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
              <div>
                <span className="font-heading font-bold text-2xl text-primary block">120+</span>
                <span className="text-[11px] text-mauve">Master Weavers</span>
              </div>
              <div>
                <span className="font-heading font-bold text-2xl text-secondary block">50k+</span>
                <span className="text-[11px] text-mauve">Happy Customers</span>
              </div>
              <div>
                <span className="font-heading font-bold text-2xl text-gold-dark block">100%</span>
                <span className="text-[11px] text-mauve">Authentic Silk</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan loom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-primary-light/40 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-plum">Pure Handloom Quality</h3>
            <p className="text-xs text-mauve leading-relaxed">
              We never compromise on thread density, zari purity or stitch precision. Every garment is quality checked before dispatch.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-primary-light/40 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-plum">Designed for You</h3>
            <p className="text-xs text-mauve leading-relaxed">
              Thoughtful cuts, breathable natural fabrics, and custom sizing options crafted to celebrate diverse body shapes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-primary-light/40 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-plum">Empowering Communities</h3>
            <p className="text-xs text-mauve leading-relaxed">
              5% of our festive collection profits are directly reinvested into schooling and craft training for weaving village families.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-brand text-white rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">Experience the Couture</h2>
          <p className="text-xs sm:text-sm text-primary-light max-w-md mx-auto">
            Explore our curated festive wardrobe and discover the outfit meant for your next memorable celebration.
          </p>
          <Link to="/shop">
            <Button variant="gold" size="lg" className="mt-2 text-plum font-bold">
              Explore Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

