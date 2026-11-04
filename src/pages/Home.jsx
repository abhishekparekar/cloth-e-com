import React from "react";
import { HeroSlider } from "../components/home/HeroSlider";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { NewArrivals } from "../components/home/NewArrivals";
import { SaleBanner } from "../components/home/SaleBanner";
import { BestSellers } from "../components/home/BestSellers";
import { TrendingCollection } from "../components/home/TrendingCollection";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { InstagramLookbook } from "../components/home/InstagramLookbook";
import { TestimonialsSlider } from "../components/home/TestimonialsSlider";
import { NewsletterSection } from "../components/home/NewsletterSection";

export const Home = () => {
  return (
    <div className="space-y-0">
      <HeroSlider />
      <CategoryGrid />
      <NewArrivals />
      <SaleBanner />
      <BestSellers />
      <TrendingCollection />
      <WhyChooseUs />
      <TestimonialsSlider />
      <InstagramLookbook />
      <NewsletterSection />
    </div>
  );
};

