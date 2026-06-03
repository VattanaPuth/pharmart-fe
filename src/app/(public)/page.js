import React from "react";

import Hero from "@/components/HomePage/Hero";
import StatsSection from "@/components/HomePage/StatsSection";
import CategoryBar from "@/components/HomePage/CategoryBar";
import CategoryProduct from "@/components/HomePage/CategoryProduct";
import FeaturedProducts from "@/components/HomePage/FeaturedProducts";
import TopPharmacies from "@/components/HomePage/TopPharmacies";
import TrendingSection from "@/components/HomePage/TrendingSection";
import HowItWorks from "@/components/HomePage/HowItWorksSection";
import Testimonials from "@/components/HomePage/ReviewSection";


const HomePage = () => {
  return (
    <main>
      <section className="hero-banner w-full min-h-screen flex items-center bg-white">
        <Hero />
      </section>

      <section className="stats">
        <StatsSection/>
      </section>

      <section className="categories-tags">
        {/* <CategoryBar/> */}
      </section>

      <section className="categories-products">
        {/* <CategoryProduct/> */}
      </section>

      <section className="featured-products">
        {/* <FeaturedProducts/> */}
      </section>

      <section className="top-pharmacies">
        {/* <TopPharmacies/> */}
      </section>

      <section className="trending-products">
        {/* <TrendingSection/> */}
      </section>

      <section className="user-flow">
        <HowItWorks/>
      </section>

      <section className="customer-reviews">
        <Testimonials/>
      </section>
    </main>
  );
};

export default HomePage;
