import Navigation from "@/app/components/Navigation";
import Hero from "@/app/components/Hero";
import ProductSlider from "@/app/components/ProductSlider";
import ProductLinesShowcase from "@/app/components/ProductLinesShowcase";
import Features from "@/app/components/Features";
import ProductsSection from "@/app/components/ProductsSection";
import Testimonials from "@/app/components/Testimonials";
import Footer from "@/app/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <Navigation />
      <Hero />
      <ProductSlider />
      <ProductLinesShowcase />
      <Features />
      <ProductsSection />
      <Testimonials />
      <Footer />
    </div>
  );
}
