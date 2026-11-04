export const STORE_CONFIG = {
  name: "Aanya Boutique",
  tagline: "Timeless Elegance in Every Thread",
  currency: "₹",
  freeShippingThreshold: 999,
  standardShippingFee: 99,
  taxRate: 0.05, // 5% GST
  contactPhone: "+91 98765 43210",
  whatsappNumber: "+919876543210",
  contactEmail: "care@aanyaboutique.com",
  address: "42, Heritage Silk Road, Bandra West, Mumbai, Maharashtra 400050",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
    whatsapp: "https://wa.me/919876543210",
  },
};

export const CATEGORIES = [
  {
    id: "sarees",
    name: "Sarees",
    slug: "sarees",
    tagline: "Banarasi, Kanjeevaram & Silk",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    itemCount: 48,
    featured: true,
  },
  {
    id: "kurtis",
    name: "Kurtis & Suits",
    slug: "kurtis",
    tagline: "Anarkali, Straight & Festive Sets",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    itemCount: 64,
    featured: true,
  },
  {
    id: "lehengas",
    name: "Lehengas",
    slug: "lehengas",
    tagline: "Bridal, Party & Sangeet",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    itemCount: 32,
    featured: true,
  },
  {
    id: "western-wear",
    name: "Western Wear",
    slug: "western-wear",
    tagline: "Dresses, Co-ords & Jumpsuits",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    itemCount: 40,
    featured: true,
  },
  {
    id: "ethnic-sets",
    name: "Ethnic Sets",
    slug: "ethnic-sets",
    tagline: "Sharara, Gharara & Palazzos",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    itemCount: 36,
    featured: true,
  },
  {
    id: "accessories",
    name: "Dupattas & Clutches",
    slug: "accessories",
    tagline: "Artisan Potlis, Stoles & Jewellery",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    itemCount: 24,
    featured: true,
  },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const FABRICS = [
  "Banarasi Silk",
  "Pure Georgette",
  "Mulmul Cotton",
  "Chanderi Silk",
  "Organza",
  "Rayon",
  "Velvet",
];

export const OCCASIONS = [
  "Wedding",
  "Festive",
  "Party Wear",
  "Casual Chic",
  "Office Wear",
];

export const SORT_OPTIONS = [
  { label: "New Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Popularity", value: "popularity" },
  { label: "Biggest Discount", value: "discount" },
];

export const ORDER_STATUS_LABELS = {
  placed: { label: "Order Placed", color: "bg-blue-100 text-blue-800" },
  confirmed: { label: "Confirmed", color: "bg-indigo-100 text-indigo-800" },
  packed: { label: "Packed", color: "bg-purple-100 text-purple-800" },
  shipped: { label: "Shipped", color: "bg-amber-100 text-amber-800" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-800" },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

