import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { CATEGORIES } from "../../utils/constants";
import { productService } from "../../services/productService";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { openCart, isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const searchRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const results = await productService.getAllProducts({ search: searchTerm });
      setSearchResults(results.slice(0, 5));
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 font-sans ${
        isScrolled
          ? "glass shadow-soft py-3"
          : "bg-white/95 backdrop-blur-md py-4 border-b border-primary-light/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-plum hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Luxury Brand Logo */}
          <Link to="/" className="flex flex-col items-start select-none group">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-plum group-hover:text-primary transition-colors">
              AANYA
              <span className="text-primary font-light text-xl sm:text-2xl ml-1 tracking-widest uppercase">
                BOUTIQUE
              </span>
            </span>
          </Link>

          {/* Desktop Collections Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              to="/shop"
              className={`text-xs uppercase tracking-wider font-semibold transition-colors hover:text-primary ${
                location.pathname === "/shop" ? "text-primary border-b-2 border-primary pb-0.5" : "text-plum"
              }`}
            >
              All Outfits
            </Link>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`text-xs uppercase tracking-wider font-semibold transition-colors hover:text-primary ${
                  location.pathname === `/category/${cat.slug}`
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-plum"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-plum hover:text-primary hover:bg-primary-light/40 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-primary-light p-3 z-50"
                  >
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search sarees, lehengas, kurtis..."
                        autoFocus
                        className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-ivory text-xs border border-gray-200 focus:outline-none focus:border-primary text-plum font-medium"
                      />
                      <Search className="w-4 h-4 text-mauve absolute left-3 top-3" />
                    </form>

                    {searchResults.length > 0 && (
                      <div className="mt-3 divide-y divide-gray-100 max-h-64 overflow-y-auto">
                        {searchResults.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              navigate(`/product/${item.slug}`);
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-ivory rounded-2xl cursor-pointer transition-colors"
                          >
                            <img
                              src={item.images?.[0]}
                              alt={item.name}
                              className="w-10 h-12 object-cover rounded-xl"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-plum truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-primary font-extrabold">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-plum hover:text-primary hover:bg-primary-light/40 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Bag Drawer */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-plum hover:text-primary hover:bg-primary-light/40 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-cta text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-primary-light/40 transition-colors text-plum"
              >
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                  {user ? user.name?.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-mauve hidden sm:block" />
              </button>

              <AnimatePresence>
                {accountDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-primary-light p-2.5 z-50"
                  >
                    {isAuthenticated && user ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-[11px] text-mauve">Account</p>
                          <p className="text-xs font-bold text-plum truncate">{user.name}</p>
                          {user.role === "admin" && (
                            <span className="inline-block mt-1 text-[9px] bg-purple-100 text-purple-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Super Admin
                            </span>
                          )}
                        </div>

                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Studio
                          </Link>
                        )}

                        <Link
                          to="/account"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-plum hover:bg-ivory rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-mauve" />
                          My Profile
                        </Link>

                        <Link
                          to="/account/orders"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-plum hover:bg-ivory rounded-xl transition-colors"
                        >
                          <Package className="w-4 h-4 text-mauve" />
                          My Orders
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setAccountDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 space-y-2">
                        <p className="text-xs text-mauve text-center mb-1">
                          Welcome to Aanya Boutique
                        </p>
                        <Link
                          to="/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block text-center w-full py-2.5 bg-gradient-cta text-white rounded-2xl text-xs font-bold shadow-soft"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-primary-light/40 mt-3 pt-3 pb-4"
            >
              <div className="flex flex-col space-y-1.5">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-bold text-plum hover:bg-primary-light/40"
                >
                  All Outfits
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold text-mauve hover:text-primary hover:bg-primary-light/40"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
