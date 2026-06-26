"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: any; // API data
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const mrp = Number(product.mrp) || 0;
  const sellingPrice = Number(product.sellingPrice) || 0;
  const discount = mrp && sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const stock = Number(product.stock) || 0;
  const inWishlist = isInWishlist(product.id);
  const formatPrice = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  const productId = product.slug
    ? encodeURIComponent(product.slug)  // "nordic accent lounge chair" → URL safe
    : (product.id || product._id);


  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
      {/* Image */}


      <div className="relative overflow-hidden bg-gray-50 h-52">
        <Link href={`/products/${productId}`}>
          {product.product_image
            ? <img src={product.product_image} alt={product.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">🪑</div>
          }
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
          )}
          {stock <= 5 && stock > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Only {stock} left</span>
          )}
          {stock === 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Out of Stock</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"}`}
        >
          <Heart size={15} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-xs text-amber-700 font-medium mb-0.5">{product.brand?.brand_name || ""}</div>
        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-amber-800 transition-colors mb-3">
            {product.product_name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(sellingPrice)}</span>
          {discount > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(mrp)}</span>}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product, product.color_name)}
          disabled={stock === 0}
          className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          <ShoppingCart size={15} />
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}