'use client';

import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/context/StoreContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl overflow-hidden group border border-[rgba(28,25,23,0.06)] hover:shadow-xl hover:border-[#2d5a3d]/20 transition-all duration-300">
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative overflow-hidden bg-[#f0ede8] block aspect-[4/5]"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {product.isBestseller && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-[#2d5a3d] text-white">
            Bestseller
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-[#c8a96e] text-[#1c1917]">
            New
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-[#c8a96e] text-[#c8a96e]" />
          <span className="text-sm font-medium text-[#1c1917]">
            {product.rating}
          </span>
          {product.reviewCount && (
            <span className="text-xs text-[#78746e]">
              ({product.reviewCount})
            </span>
          )}
        </div>

        <Link href={`/products/${product.id}`} className="block">
          <h3
            className="text-[16px] font-semibold text-[#1c1917] mb-1 leading-snug group-hover:text-[#2d5a3d] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[#78746e] mb-3">
          {product.type} · {product.origin}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#1c1917]">
              Rs.{product.price.toLocaleString()}
            </span>
            {product.weight && (
              <span className="text-xs text-[#78746e] ml-1">
                / {product.weight}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              weight: product.weight || "100g",
            });
          }}
          className="cursor-pointer w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-[#2d5a3d] text-white text-sm font-medium rounded-lg hover:bg-[#234832] transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
