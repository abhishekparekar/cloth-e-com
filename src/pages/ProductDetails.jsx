import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useUIStore } from "../store/uiStore";
import { formatPrice } from "../utils/formatters";
import { Rating } from "../components/common/Rating";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { ProductCard } from "../components/product/ProductCard";
import {
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  Check,
  MapPin,
  Sparkles,
  ArrowRight,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

export const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // Reviews state
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      name: "Shruti Verma",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely stunning outfit! The zari borders and pure silk shine are incredible. Fits true to size.",
      verified: true,
    },
    {
      id: "rev-2",
      name: "Neha Joshi",
      rating: 5,
      date: "1 week ago",
      comment: "Wore this for Diwali puja and received countless compliments! Packaging was so premium too.",
      verified: true,
    },
  ]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { openSizeGuide, openCart } = useUIStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const loadProduct = async () => {
      const p = await productService.getProductBySlug(slug);
      if (p) {
        setProduct(p);
        setSelectedImage(0);
        setSelectedSize(p.variants?.[0]?.size || "Free Size");
        setSelectedColor(p.variants?.[0]?.color || "Default");

        // Fetch related products
        const related = await productService.getAllProducts({
          category: p.categoryId,
        });
        setRelatedProducts(related.filter((item) => item.id !== p.id).slice(0, 4));
      }
    };
    loadProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isWish = isInWishlist(product.id);
  const currentVariant =
    product.variants?.find(
      (v) =>
        (!selectedSize || v.size === selectedSize) &&
        (!selectedColor || v.color === selectedColor)
    ) || product.variants?.[0];

  const handleAddToCart = () => {
    addItem(product, currentVariant, quantity);
    toast.success(`${product.name} added to your bag!`, {
      icon: "🛍️",
      style: { borderRadius: "16px", background: "#2D1B36", color: "#fff" },
    });
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, currentVariant, quantity);
    navigate("/checkout");
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(pincode)) {
      setPincodeStatus({ valid: false, message: "Please enter a valid 6-digit Indian pincode" });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available by ${new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })} (Free Express Delivery)`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Aanya Boutique!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      toast.error("Please fill in your name and review");
      return;
    }
    const created = {
      id: `rev-${Date.now()}`,
      name: newReview.name,
      rating: newReview.rating,
      date: "Just now",
      comment: newReview.comment,
      verified: true,
    };
    setReviews([created, ...reviews]);
    setNewReview({ name: "", rating: 5, comment: "" });
    toast.success("Thank you! Your verified review has been published.");
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Breadcrumb */}
      <nav className="text-xs text-mauve mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <span>/</span>
        <Link to={`/category/${product.categoryId}`} className="hover:text-primary capitalize">
          {product.categoryId}
        </Link>
        <span>/</span>
        <span className="text-plum font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4 sticky top-24">
          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] rounded-4xl overflow-hidden bg-ivory shadow-card border border-primary-light/40 group">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {product.discountPercent > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="pink">{product.discountPercent}% OFF</Badge>
              </div>
            )}
            <button
              onClick={() => {
                const added = toggleWishlist(product);
                toast(added ? "Added to wishlist ❤️" : "Removed from wishlist");
              }}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-md text-plum hover:text-red-500 shadow-md transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWish ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx
                      ? "border-primary shadow-soft scale-102"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              {product.categoryId}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-plum mt-1 leading-snug tracking-tight">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 mt-3">
              <Rating rating={product.ratingAvg || 4.8} count={product.ratingCount || 120} />
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-0.5 rounded-full">
                ✓ Ready to Dispatch
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-plum tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-base line-through text-mauve">
                  {formatPrice(product.mrp)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-600">
                  Save {formatPrice(product.mrp - product.price)} ({product.discountPercent}% OFF)
                </span>
              )}
            </div>
            <p className="text-xs text-mauve mt-1">Inclusive of all taxes. Free express shipping.</p>
          </div>

          {/* Color Selector */}
          {product.variants?.some((v) => v.color) && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-plum uppercase tracking-wider">
                  Color: <span className="font-medium text-primary">{currentVariant?.color}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {Array.from(new Set(product.variants.map((v) => v.color))).map((cName) => {
                  const match = product.variants.find((v) => v.color === cName);
                  const isSelected = (selectedColor || currentVariant?.color) === cName;
                  return (
                    <button
                      key={cName}
                      onClick={() => setSelectedColor(cName)}
                      title={cName}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected ? "border-primary scale-110 shadow-sm" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: match?.colorHex || "#E11D74" }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector + Size Guide Modal Trigger */}
          {product.variants?.some((v) => v.size && v.size !== "Free Size") && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-plum uppercase tracking-wider">
                  Select Size
                </span>
                <button
                  onClick={openSizeGuide}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide & Measurements
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {Array.from(new Set(product.variants.map((v) => v.size))).map((size) => {
                  const isSelected = (selectedSize || currentVariant?.size) === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-soft"
                          : "bg-white text-plum border-gray-200 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-plum uppercase tracking-wider">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-full bg-white px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 text-sm font-bold text-plum hover:text-primary"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold text-plum">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="px-2 text-sm font-bold text-plum hover:text-primary"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              icon={ShoppingBag}
              onClick={handleAddToCart}
            >
              Add to Shopping Bag
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleBuyNow}
            >
              Buy It Now
            </Button>
            <button
              onClick={handleShare}
              className="p-3.5 rounded-full border border-gray-200 hover:border-primary text-mauve hover:text-primary transition-colors flex items-center justify-center shrink-0"
              title="Share Outfit"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 rounded-2xl bg-ivory border border-primary-light/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-plum uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-primary" />
              Check Delivery & COD Availability
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
              />
              <Button variant="secondary" size="sm" type="submit">
                Check
              </Button>
            </form>
            {pincodeStatus && (
              <p
                className={`text-xs font-medium ${
                  pincodeStatus.valid ? "text-emerald-700" : "text-red-500"
                }`}
              >
                {pincodeStatus.message}
              </p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100 text-center text-xs text-plum">
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-primary mb-1" />
              <span className="font-semibold">Free Shipping</span>
              <span className="text-[10px] text-mauve">Above ₹999</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-primary mb-1" />
              <span className="font-semibold">7-Day Returns</span>
              <span className="text-[10px] text-mauve">Doorstep pickup</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-primary mb-1" />
              <span className="font-semibold">100% Authentic</span>
              <span className="text-[10px] text-mauve">Silk Mark Weave</span>
            </div>
          </div>

          {/* Information Tabs */}
          <div className="pt-4 space-y-4">
            <div className="flex border-b border-gray-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 px-3 transition-colors relative ${
                  activeTab === "description"
                    ? "text-primary border-b-2 border-primary"
                    : "text-mauve hover:text-plum"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("fabric")}
                className={`pb-3 px-3 transition-colors relative ${
                  activeTab === "fabric"
                    ? "text-primary border-b-2 border-primary"
                    : "text-mauve hover:text-plum"
                }`}
              >
                Fabric & Care
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-3 px-3 transition-colors relative ${
                  activeTab === "shipping"
                    ? "text-primary border-b-2 border-primary"
                    : "text-mauve hover:text-plum"
                }`}
              >
                Shipping & Returns
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 px-3 transition-colors relative ${
                  activeTab === "reviews"
                    ? "text-primary border-b-2 border-primary"
                    : "text-mauve hover:text-plum"
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="text-xs sm:text-sm text-mauve leading-relaxed">
              {activeTab === "description" && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  {product.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-ivory rounded-lg text-[11px] text-plum font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "fabric" && (
                <div className="space-y-2">
                  <p><strong>Primary Fabric:</strong> {product.fabric || "Pure Handloom Silk"}</p>
                  <p><strong>Wash & Care:</strong> {product.care || "Dry Clean Only. Avoid direct sunlight drying."}</p>
                  <p><strong>Weave Technique:</strong> Handcrafted traditional Kadwa Zari Weave.</p>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-2">
                  <p>• Standard delivery dispatched in 24-48 hours.</p>
                  <p>• Expected delivery within 3-5 business days across India.</p>
                  <p>• Hassle-free 7-day exchange or return for unworn items with original tags intact.</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Reviews list */}
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-ivory rounded-2xl border border-primary-light/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-plum flex items-center gap-1.5">
                            {rev.name}
                            {rev.verified && (
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                Verified Buyer
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-mauve">{rev.date}</span>
                        </div>
                        <Rating rating={rev.rating} size="sm" />
                        <p className="text-xs text-plum pt-1">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                    <h4 className="font-heading font-semibold text-plum text-sm">Write a Review</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Your Rating:</span>
                      <Rating
                        rating={newReview.rating}
                        interactive={true}
                        onRatingChange={(r) => setNewReview({ ...newReview, rating: r })}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                    />
                    <textarea
                      placeholder="Share your thoughts on fabric quality, fit, and elegance..."
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-primary"
                    />
                    <Button variant="primary" size="sm" type="submit" icon={Send}>
                      Submit Review
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-primary-light/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-plum">
              You May Also Love
            </h2>
            <Link
              to={`/category/${product.categoryId}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View More in {product.categoryId}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Add to Cart Bottom Bar (PRD 6.3) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-primary-light p-3 flex items-center justify-between shadow-lg">
        <div>
          <span className="font-heading font-bold text-base text-plum block">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] text-mauve">Size: {currentVariant?.size}</span>
        </div>
        <Button variant="primary" size="sm" onClick={handleAddToCart} icon={ShoppingBag}>
          Add to Bag
        </Button>
      </div>
    </div>
  );
};
