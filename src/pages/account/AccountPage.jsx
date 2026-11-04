import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/common/Button";
import { User, MapPin, Package, Heart, Plus, Trash2, Check, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export const AccountPage = () => {
  const { user, updateProfile, addAddress, removeAddress, setDefaultAddress } = useAuthStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-heading font-bold text-plum">Please Sign In</h2>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.line1 || !newAddr.city || !newAddr.pincode) {
      toast.error("Please fill in all address fields");
      return;
    }
    addAddress(newAddr);
    setShowAddAddress(false);
    setNewAddr({
      name: user?.name || "",
      phone: user?.phone || "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    });
    toast.success("New address added!");
  };

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-primary-light/50 gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
            My Account
          </h1>
          <p className="text-xs text-mauve mt-1">Manage profile, delivery addresses and preferences</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/account/orders">
            <Button variant="secondary" size="sm" icon={Package}>
              My Orders
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button variant="secondary" size="sm" icon={Heart}>
              Wishlist
            </Button>
          </Link>
          {user.role === "admin" && (
            <Link to="/admin">
              <Button variant="dark" size="sm" icon={ShieldCheck}>
                Admin Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Profile Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-primary-light/50 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-heading text-xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-plum">{user.name}</h3>
                <span className="text-[11px] text-mauve uppercase tracking-wider">{user.role} Account</span>
              </div>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-mauve block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-mauve block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-mauve block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-xs text-mauve">
              <div>
                <span className="block text-[11px] text-gray-400">Email</span>
                <span className="font-semibold text-plum text-sm">{user.email}</span>
              </div>
              <div>
                <span className="block text-[11px] text-gray-400">Phone</span>
                <span className="font-semibold text-plum text-sm">{user.phone || "Not provided"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 cols: Saved Addresses */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-primary-light/50 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-plum">
                Saved Delivery Addresses
              </h2>
            </div>
            {!showAddAddress && (
              <button
                onClick={() => setShowAddAddress(true)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            )}
          </div>

          {/* Add Address Form */}
          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="p-5 bg-ivory rounded-2xl border border-primary-light/50 space-y-4">
              <h4 className="font-heading font-semibold text-plum text-sm">New Delivery Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-mauve block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-mauve block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="text-mauve block mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  placeholder="House/Flat No., Building, Street"
                  value={newAddr.line1}
                  onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-mauve block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-mauve block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-mauve block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAddAddress(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Address
                </Button>
              </div>
            </form>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.addresses?.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-2xl border transition-all relative ${
                  addr.isDefault
                    ? "border-primary bg-primary-light/10 shadow-xs"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-xs text-plum">{addr.name}</h4>
                  {addr.isDefault ? (
                    <span className="text-[10px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Default
                    </span>
                  ) : (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[11px] text-mauve hover:text-primary"
                    >
                      Set Default
                    </button>
                  )}
                </div>
                <p className="text-xs text-mauve line-clamp-2">{addr.line1}, {addr.city}</p>
                <p className="text-xs text-plum font-semibold mt-1">Pincode: {addr.pincode}</p>
                <p className="text-xs text-mauve mt-0.5">Phone: {addr.phone}</p>

                <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

