import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "Are all your sarees and garments made of authentic handloom fabrics?",
      a: "Yes! Every single product in our handloom catalog is 100% Silk Mark or Handloom Mark certified. We source directly from hereditary weaving clusters across Varanasi, Kanchipuram, Chanderi, and Bengal.",
    },
    {
      q: "How do I determine the right size for Kurtis and Lehengas?",
      a: "Each product details page features an interactive Size Guide modal with exact bust, waist, hip, and length measurements in both inches and centimeters. If your measurements fall between sizes, we recommend selecting one size up.",
    },
    {
      q: "What is your shipping policy and delivery timeline?",
      a: "We provide complimentary express shipping across India on all orders exceeding ₹999. In-stock garments are dispatched within 24–48 hours, with delivery taking 3 to 5 business days depending on your postal pincode.",
    },
    {
      q: "How does the 7-day return and exchange policy work?",
      a: "If an outfit does not fit as expected or you wish to exchange it, simply request a return or size exchange directly from your account within 7 days of delivery. Our courier partner will schedule doorstep pickup at no cost to you.",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes, COD is available for most postal codes across India up to order values of ₹10,000.",
    },
  ];

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Answers & Help
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-mauve">Everything you need to know about shopping at Aanya Boutique.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-primary-light/50 overflow-hidden shadow-xs transition-colors"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-plum hover:text-primary transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openIdx === idx ? "rotate-180 text-primary" : "text-mauve"
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-mauve leading-relaxed border-t border-gray-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShippingPolicyPage = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
        Shipping & Delivery Policy
      </h1>
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-primary-light/50 shadow-card space-y-5 text-xs sm:text-sm text-mauve leading-relaxed">
        <h3 className="font-heading text-base font-bold text-plum">Domestic Shipping (India)</h3>
        <p>
          We offer <strong>Free Express Shipping</strong> on all domestic prepaid and COD orders above ₹999. For orders below ₹999, a nominal standard delivery fee of ₹99 is applied.
        </p>
        <h3 className="font-heading text-base font-bold text-plum">Dispatch & Delivery Times</h3>
        <p>
          Ready-to-ship garments are dispatched within 24 to 48 hours of order confirmation. Custom stitched blouses or made-to-order lehengas require 7 to 10 days of artisan tailoring prior to dispatch.
        </p>
        <h3 className="font-heading text-base font-bold text-plum">Courier Partners & Tracking</h3>
        <p>
          We partner with premium logistics providers including BlueDart, Delhivery, and DTDC. Once your parcel is scanned at the hub, a live tracking ID and link are sent via SMS, WhatsApp, and email.
        </p>
      </div>
    </div>
  );
};

export const ReturnPolicyPage = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
        Returns & Exchanges Policy
      </h1>
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-primary-light/50 shadow-card space-y-5 text-xs sm:text-sm text-mauve leading-relaxed">
        <h3 className="font-heading text-base font-bold text-plum">7-Day Easy Returns</h3>
        <p>
          At Aanya Boutique, we want you to feel utterly radiant in your choice. If you are not completely satisfied with the fit or style, you may raise a return or exchange request within 7 calendar days from the date of package delivery.
        </p>
        <h3 className="font-heading text-base font-bold text-plum">Conditions for Return</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>Garments must remain unused, unworn, unwashed, and undamaged.</li>
          <li>Original brand tags, silk purity tags, and boutique box packaging must be intact.</li>
          <li>Custom tailored pieces or altered sarees with attached fall/pico cannot be returned.</li>
        </ul>
        <h3 className="font-heading text-base font-bold text-plum">Refund Process</h3>
        <p>
          Once our quality control team inspects the returned item, full refunds are credited back to your original payment method (or bank account in the case of COD) within 3–5 working days.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-plum">
        Privacy Policy & Terms of Service
      </h1>
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-primary-light/50 shadow-card space-y-5 text-xs sm:text-sm text-mauve leading-relaxed">
        <h3 className="font-heading text-base font-bold text-plum">Data Security & Encryption</h3>
        <p>
          Aanya Boutique implements industry-standard 256-bit SSL encryption to ensure that all customer details, addresses, and transaction communications are strictly confidential and protected from unauthorized access.
        </p>
        <h3 className="font-heading text-base font-bold text-plum">Payment Gateways</h3>
        <p>
          We do not store your credit card, debit card numbers or bank account details on our servers. All digital payments are processed through RBI-approved secure payment gateways (Razorpay).
        </p>
        <h3 className="font-heading text-base font-bold text-plum">Intellectual Property</h3>
        <p>
          All photographs, imagery, typography, and artisan design documentation on this website are the proprietary property of Aanya Boutique Pvt. Ltd.
        </p>
      </div>
    </div>
  );
};

