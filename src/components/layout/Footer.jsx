import React from "react";
import { Link } from "react-router-dom";
import { STORE_CONFIG, CATEGORIES } from "../../utils/constants";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-plum text-white pt-16 pb-24 lg:pb-12 border-t border-plum/30">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
              <Sparkles className="w-5 h-5 text-gold-light" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-white">100% Authentic Handloom</h4>
              <p className="text-xs text-mauve">Pure silks & artisan weaves</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
              <Truck className="w-5 h-5 text-gold-light" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-mauve">On all orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
              <RotateCcw className="w-5 h-5 text-gold-light" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-mauve">Hassle-free exchange guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
              <ShieldCheck className="w-5 h-5 text-gold-light" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-white">100% Secure Payment</h4>
              <p className="text-xs text-mauve">UPI, Cards, COD & Netbanking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-heading text-3xl font-bold tracking-tight text-white">
                Aanya
                <span className="text-primary-light font-accent italic font-normal text-2xl ml-1">
                  Boutique
                </span>
              </span>
            </Link>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              Celebrating Indian craftsmanship and contemporary silhouette elegance. Each ensemble is thoughtfully tailored using rich heritage fabrics, zardozi needlework, and modern chic aesthetics.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={STORE_CONFIG.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={STORE_CONFIG.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-gold-light mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-primary-light transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="hover:text-primary-light transition-colors">
                  View All Outfits
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-gold-light mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/about" className="hover:text-primary-light transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-light transition-colors">
                  Contact & Assistance
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-primary-light transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-primary-light transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-primary-light transition-colors">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider uppercase text-gold-light mb-4">
              Flagship Studio
            </h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{STORE_CONFIG.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>{STORE_CONFIG.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Aanya Boutique Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px] text-white">UPI</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px] text-white">VISA</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px] text-white">MASTERCARD</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px] text-white">RUPAY</span>
            <span className="px-2 py-1 bg-white/10 rounded font-semibold text-[10px] text-white">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

