import React, { useState } from "react";
import { INITIAL_TESTIMONIALS } from "../../services/mockData";
import { Rating } from "../common/Rating";
import { ChevronLeft, ChevronRight, Quote, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const TestimonialsSlider = () => {
  const [current, setCurrent] = useState(0);
  const testimonials = INITIAL_TESTIMONIALS;

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const active = testimonials[current];

  return (
    <section className="py-16 sm:py-24 bg-white/60 border-t border-primary-light/40 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Loved by 50,000+ Women
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-plum tracking-tight">
            Customer Love
          </h2>
        </div>

        <div className="relative bg-white rounded-4xl p-8 sm:p-12 shadow-card border border-primary-light/50">
          <Quote className="w-12 h-12 text-primary-light absolute top-6 right-8 opacity-60" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <Rating rating={active.rating} size="md" />

              <p className="text-lg sm:text-2xl text-plum font-light leading-relaxed italic">
                "{active.comment}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <h4 className="font-bold text-plum flex items-center gap-1.5 text-sm sm:text-base">
                    {active.name}
                    {active.verified && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                    )}
                  </h4>
                  <p className="text-xs text-mauve">
                    {active.city} • Verified Buyer
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="w-10 h-10 rounded-full border border-gray-200 text-mauve hover:text-primary hover:border-primary transition-colors flex items-center justify-center active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="w-10 h-10 rounded-full border border-gray-200 text-mauve hover:text-primary hover:border-primary transition-colors flex items-center justify-center active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
