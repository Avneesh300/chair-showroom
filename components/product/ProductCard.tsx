"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const discount = getDiscount(product.mrp, product.sellingPrice);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 h-52">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
          {product.stockQty <= 5 && product.stockQty > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Only {product.stockQty} left
            </span>
          )}
          {product.stockQty === 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
            inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={15} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-xs text-amber-700 font-medium mb-0.5">{product.brand}</div>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-amber-800 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.sellingPrice)}</span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.mrp)}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(product, product.colors[0])}
          disabled={product.stockQty === 0}
          className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          <ShoppingCart size={15} />
          {product.stockQty === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
