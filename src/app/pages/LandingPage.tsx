import Navigation from "@/app/components/Navigation";
import Hero from "@/app/components/Hero";
import ProductSlider from "@/app/components/ProductSlider";
import ProductLinesShowcase from "@/app/components/ProductLinesShowcase";
import Features from "@/app/components/Features";
import ProductsSection from "@/app/components/ProductsSection";
import Testimonials from "@/app/components/Testimonials";
import Footer from "@/app/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  // Fetch product lines and products directly from database as server component
  const productLines = await prisma.productLine.findMany({
    include: { products: true },
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  
  const products = await prisma.product.findMany({
    include: {
      productVariants: true,
      batches: true,
      reviews: true,
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <Navigation />
      <Hero />
      <ProductSlider products={products} />
      <ProductLinesShowcase productLines={productLines} />
      <Features />
      <ProductsSection />
      <Testimonials />
      <Footer />
    </div>
  );
}
