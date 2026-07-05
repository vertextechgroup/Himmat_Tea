'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './ui/carousel';

export default function ProductSlider() {
  const { products } = useStore();

  return (
    <section className="py-12 bg-[#faf8f5]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#c8a96e] font-medium mb-2">
              Our Products
            </p>
            <h2
              className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] text-[#1c1917]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Discover Our Range
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
            {(products || []).map((product) => (
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