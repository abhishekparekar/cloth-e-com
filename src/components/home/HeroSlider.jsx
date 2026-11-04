import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import heroBanner1 from "../../assets/heroBanner1.png";
import heroBanner2 from "../../assets/heroBanner2.png";

const LUXURY_SLIDES = [
  {
    id: "slide-1",
    badge: "Festive Couture '26",
    title: "Pure Banarasi Radiance.",
    subtitle: "Kadwa gold zari handloom weaves & regal scarlet silks.",
    price: "₹3,499",
    tag: "Artisan Silk",
    link: "/category/sarees",
    cta: "Shop Royal Silks",
    image: heroBanner1,
  },
  {
    id: "slide-2",
    badge: "Bridal Luxe Edition",
    title: "Heritage Wedding Elegance.",
    subtitle: "Intricate zardozi needlework and handcrafted festive flare.",
    price: "₹4,999",
    tag: "Wedding Luxe",
    link: "/shop",
    cta: "Explore Collection",
    image: heroBanner2,
  },
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  // Note: Auto-change timer removed as requested; user has full manual control via arrows/dots.
  const slide = LUXURY_SLIDES[current];

  return (
    <section className="relative w-full h-[520px] sm:h-[580px] md:h-[620px] lg:h-[660px] xl:h-[700px] overflow-hidden select-none font-sans">
      {/* Clean, static background banners without any dark overlay or tint */}
      {LUXURY_SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            current === idx ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-[20%_center] sm:object-center select-none"
          />
        </div>
      ))}

      {/* Foreground Editorial Content - Positioned on right to showcase model on left */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end z-10">
        <div className="w-full md:max-w-xl lg:max-w-2xl text-left space-y-4 sm:space-y-6 pt-16 md:pt-0">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-gold-light text-xs font-semibold uppercase tracking-widest shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            {slide.badge}
          </div>

          {/* Bold Minimalist Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-md">
            {slide.title}
          </h1>

          {/* Concise Subtitle */}
          <p className="text-xs sm:text-base text-gray-100 font-light tracking-wide max-w-lg leading-relaxed drop-shadow">
            {slide.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            <Link to={slide.link}>
              <Button variant="primary" size="lg" className="shadow-glow font-semibold group">
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 border border-white/30 font-medium backdrop-blur-sm"
              >
                All Outfits
              </Button>
            </Link>
          </div>

          {/* Subtle Trust Indicators */}
          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-white/80 border-t border-white/15">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              100% Authentic Handloom Silk
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Ready to Dispatch Across India
            </span>
          </div>
        </div>
      </div>

      {/* Manual Slide Controls - No Auto-Switch */}
      <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto flex items-center justify-between z-20">
        {/* Progress Bar / Dots */}
        <div className="flex items-center space-x-2.5">
          {LUXURY_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Switch to banner ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                current === idx ? "w-10 bg-primary shadow-sm" : "w-3 bg-white/40 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Numeric Slide Counter */}
        <div className="text-white text-xs font-mono font-medium tracking-widest hidden sm:block">
          0{current + 1} <span className="text-white/40">/ 0{LUXURY_SLIDES.length}</span>
        </div>

        {/* Manual Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + LUXURY_SLIDES.length) % LUXURY_SLIDES.length)}
            aria-label="Previous banner"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 active:scale-95 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % LUXURY_SLIDES.length)}
            aria-label="Next banner"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 active:scale-95 shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
