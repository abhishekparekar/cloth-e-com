import React from "react";
import { CATEGORIES, FABRICS, OCCASIONS, SIZES } from "../../utils/constants";
import { RotateCcw, Check } from "lucide-react";

export const ProductFilters = ({
  filters,
  onChange,
  onReset,
  totalResults = 0,
}) => {
  const handleCategoryChange = (catSlug) => {
    onChange({ ...filters, category: catSlug === filters.category ? "all" : catSlug });
  };

  const handleFabricToggle = (fabric) => {
    const current = filters.fabric || [];
    const updated = current.includes(fabric)
      ? current.filter((f) => f !== fabric)
      : [...current, fabric];
    onChange({ ...filters, fabric: updated });
  };

  const handleOccasionToggle = (occ) => {
    const current = filters.occasion || [];
    const updated = current.includes(occ)
      ? current.filter((o) => o !== occ)
      : [...current, occ];
    onChange({ ...filters, occasion: updated });
  };

  const handleSizeToggle = (size) => {
    const current = filters.sizes || [];
    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    onChange({ ...filters, sizes: updated });
  };

  const hasActiveFilters =
    (filters.category && filters.category !== "all") ||
    (filters.fabric && filters.fabric.length > 0) ||
    (filters.occasion && filters.occasion.length > 0) ||
    (filters.sizes && filters.sizes.length > 0) ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock;

  return (
    <div className="bg-white rounded-2xl p-6 border border-primary-light/40 space-y-7 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="font-heading text-lg font-bold text-plum">Filter Outfits</h3>
          <p className="text-xs text-mauve mt-0.5">{totalResults} products found</p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              !filters.category || filters.category === "all"
                ? "bg-primary-light text-primary font-bold"
                : "text-mauve hover:text-plum hover:bg-ivory"
            }`}
          >
            All Collections
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                filters.category === cat.slug
                  ? "bg-primary-light text-primary font-bold"
                  : "text-mauve hover:text-plum hover:bg-ivory"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-mauve font-normal">{cat.itemCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Price Range (₹)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-mauve block mb-1">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice || ""}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-plum focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[10px] text-mauve block mb-1">Max Price</label>
            <input
              type="number"
              placeholder="15000"
              value={filters.maxPrice || ""}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-plum focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = filters.sizes?.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-plum border-gray-200 hover:border-primary"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Fabric</h4>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {FABRICS.map((fabric) => {
            const isChecked = filters.fabric?.includes(fabric);
            return (
              <label
                key={fabric}
                className="flex items-center gap-2.5 text-xs text-plum cursor-pointer group select-none"
              >
                <div
                  onClick={() => handleFabricToggle(fabric)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-primary border-primary text-white"
                      : "border-gray-300 group-hover:border-primary"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span onClick={() => handleFabricToggle(fabric)}>{fabric}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Occasion */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-plum uppercase tracking-wider">Occasion</h4>
        <div className="space-y-2">
          {OCCASIONS.map((occ) => {
            const isChecked = filters.occasion?.includes(occ);
            return (
              <label
                key={occ}
                className="flex items-center gap-2.5 text-xs text-plum cursor-pointer group select-none"
              >
                <div
                  onClick={() => handleOccasionToggle(occ)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-primary border-primary text-white"
                      : "border-gray-300 group-hover:border-primary"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span onClick={() => handleOccasionToggle(occ)}>{occ}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-4 border-t border-gray-100">
        <label className="flex items-center justify-between text-xs font-semibold text-plum cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={Boolean(filters.inStock)}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
            className="w-4 h-4 accent-primary rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

