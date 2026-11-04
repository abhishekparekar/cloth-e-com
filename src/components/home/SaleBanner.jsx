import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import { Clock, ArrowRight, Sparkles, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export const SaleBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 35,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyCoupon = () => {
    navigator.clipboard.writeText("FESTIVE20");
    setCopied(true);
    toast.success("Coupon FESTIVE20 copied! 🌸");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatUnit = (num) => String(num).padStart(2, "0");

  return (
    <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="relative rounded-4xl overflow-hidden bg-gradient-brand text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
        {/* Ambient Glow Elements */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-gold/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Punchy Left Details */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-gold-light text-xs font-bold uppercase tracking-widest border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Limited Festive Drop
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              Flat 20% OFF Everything.
            </h2>

            {/* Click to Copy Coupon Chip */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={copyCoupon}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-mono font-bold text-xs tracking-wider transition-all active:scale-95"
              >
                <span>CODE: FESTIVE20</span>
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
              <span className="text-xs text-primary-light font-medium">Valid on all bridal & silk edits</span>
            </div>

            <div className="pt-3">
              <Link to="/shop">
                <Button variant="gold" size="lg" className="shadow-lg text-plum font-bold">
                  <span>Shop Flash Sale</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Minimalist Countdown Clock */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/25 text-center space-y-4 shadow-float">
              <div className="flex items-center justify-center gap-2 text-gold-light text-xs uppercase tracking-widest font-bold">
                <Clock className="w-4 h-4" />
                Offer Expires In
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shadow-inner">
                    {formatUnit(timeLeft.hours)}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-primary-light mt-1.5 font-semibold">
                    Hours
                  </span>
                </div>

                <span className="text-2xl font-bold text-white/50 -mt-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shadow-inner">
                    {formatUnit(timeLeft.minutes)}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-primary-light mt-1.5 font-semibold">
                    Mins
                  </span>
                </div>

                <span className="text-2xl font-bold text-white/50 -mt-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white shadow-inner">
                    {formatUnit(timeLeft.seconds)}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-primary-light mt-1.5 font-semibold">
                    Secs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
