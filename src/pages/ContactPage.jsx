import React, { useState } from "react";
import { STORE_CONFIG } from "../utils/constants";
import { Button } from "../components/common/Button";
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from "lucide-react";
import toast from "react-hot-toast";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in the required fields");
      return;
    }
    toast.success("Thank you! Your message has been sent to our styling team.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          We Are Here For You
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
          Get in Touch With Our Stylists
        </h1>
        <p className="text-xs sm:text-sm text-mauve">
          Have queries about sizing, fabric care, bespoke tailoring, or your active shipment? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact info cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-primary-light/40 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-plum text-sm">Call Support</h3>
            <p className="text-xs text-mauve">{STORE_CONFIG.contactPhone}</p>
            <span className="text-[11px] text-gray-400 block">Mon - Sat: 10:00 AM - 7:00 PM IST</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-primary-light/40 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-plum text-sm">WhatsApp Concierge</h3>
            <p className="text-xs text-mauve">Immediate replies from personal stylists</p>
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-bold text-emerald-600 hover:underline"
            >
              Start WhatsApp Chat →
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-primary-light/40 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-plum text-sm">Email Us</h3>
            <p className="text-xs text-mauve">{STORE_CONFIG.contactEmail}</p>
            <span className="text-[11px] text-gray-400 block">Typical response time: Under 2 hours</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-primary-light/40 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-plum text-sm">Flagship Boutique</h3>
            <p className="text-xs text-mauve leading-relaxed">{STORE_CONFIG.address}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-primary-light/50 shadow-card space-y-6">
          <h2 className="font-heading text-xl font-bold text-plum pb-4 border-b border-gray-100">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-mauve block mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
                />
              </div>
              <div>
                <label className="text-mauve block mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-mauve block mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
                />
              </div>
              <div>
                <label className="text-mauve block mb-1 font-medium">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Order query, custom size, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
                />
              </div>
            </div>

            <div>
              <label className="text-mauve block mb-1 font-medium">How can we help? *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-plum"
              />
            </div>

            <Button variant="primary" size="lg" type="submit" icon={Send}>
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

