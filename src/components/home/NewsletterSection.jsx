import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";
import toast from "react-hot-toast";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to the Aanya Inner Circle! 🌸 Check your inbox for 10% off.");
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-brand text-white relative overflow-hidden font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-gold-light text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          The Boutique Club
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Unlock 10% Off Your First Couture Drape.
        </h2>

        {subscribed ? (
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            Your code is <strong className="underline text-gold-light">WELCOME10</strong>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
          >
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-5 py-3 rounded-full bg-white text-plum text-xs placeholder:text-mauve focus:outline-none focus:ring-2 focus:ring-gold-light shadow-md pl-11 font-medium"
              />
              <Mail className="w-4 h-4 text-mauve absolute left-4 top-3.5" />
            </div>
            <Button
              variant="gold"
              size="lg"
              type="submit"
              className="w-full sm:w-auto shrink-0 shadow-lg text-plum font-bold"
            >
              Get 10% Off
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};
