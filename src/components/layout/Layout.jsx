import React from "react";
import { Outlet } from "react-router-dom";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { CartDrawer } from "../cart/CartDrawer";
import { QuickViewModal } from "../common/QuickViewModal";
import { SizeGuideModal } from "../common/SizeGuideModal";
import { WhatsAppButton } from "./WhatsAppButton";
import { BackToTop } from "./BackToTop";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />

      {/* Global Modals & Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <SizeGuideModal />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

