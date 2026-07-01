'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  isBestseller: boolean;
}

export default function ProductSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        // Filter only bestsellers
        const allProducts = data || [];
        const bestsellers = allProducts.filter((product: Product) => product.isBestseller);
        setProducts(bestsellers);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#faf8f5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-2">
              Our Bestsellers
            </p>
            <h2 
              className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] text-[#1c1917]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Popular Teas
            </h2>
          </div>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <Link href={`/products/${product.id}`} className="block group">
                    <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(28,25,23,0.06)] hover:shadow-xl transition-all duration-300">
                      <div className="aspect-square bg-[#f0ede8]">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 
                          className="text-sm font-semibold text-[#1c1917] mb-1 group-hover:text-[#2d5a3d] transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-[#2d5a3d]">
                          ₹{product.price.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
