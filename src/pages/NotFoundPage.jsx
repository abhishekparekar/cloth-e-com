import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="space-y-6 max-w-md mx-auto"
      >
        <div className="relative inline-block">
          <span className="font-heading text-8xl sm:text-9xl font-bold text-primary-light">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center text-primary font-heading font-bold text-2xl sm:text-3xl">
            🌸 Page Not Found
          </div>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-plum">
          Looking for a Specific Outfit?
        </h1>

        <p className="text-xs sm:text-sm text-mauve">
          The page or product you requested may have moved or is no longer in season. Explore our latest handloom sarees and festive edits.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="lg" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="secondary" size="lg" icon={Sparkles}>
              Shop Collection
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

