// "use client";

// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import ProductCard from "@/components/product/ProductCard";
// import { useCart } from "@/context/CartContext";
// import Link from "next/link";
// import { Heart } from "lucide-react";

// export default function WishlistPage() {
//   const { wishlistItems } = useCart();

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-8">
//             My Wishlist
//             {wishlistItems.length > 0 && (
//               <span className="text-gray-400 font-normal text-lg ml-2">({wishlistItems.length} items)</span>
//             )}
//           </h1>

//           {wishlistItems.length === 0 ? (
//             <div className="text-center py-24">
//               <Heart size={64} className="mx-auto text-gray-200 mb-4" />
//               <h2 className="font-serif text-xl font-bold text-gray-600 mb-2">Your wishlist is empty</h2>
//               <p className="text-gray-400 text-sm mb-6">Save chairs you love for later</p>
//               <Link href="/products" className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors">
//                 Browse Chairs
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//               {wishlistItems.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }

"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { deleteWishlistApi } from "@/services/wishlist.service";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const { wishlistItems, wishlistLoading, fetchWishlist, addToCart } = useCart();

  const handleRemove = async (id: string) => {
    const response: any = await deleteWishlistApi({ id, status: "A" });
    if (response?.success) {
      toast.success(response.message);
      fetchWishlist(); // ✅ list refresh karo
    }
  };

  const formatPrice = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;
  const getDiscount = (mrp: number, sp: number) =>
    mrp && sp ? Math.round(((mrp - sp) / mrp) * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-8">
            My Wishlist
            {wishlistItems.length > 0 && (
              <span className="text-gray-400 font-normal text-lg ml-2">
                ({wishlistItems.length} items)
              </span>
            )}
          </h1>

          {wishlistLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-24">
              <Heart size={64} className="mx-auto text-gray-200 mb-4" />
              <h2 className="font-serif text-xl font-bold text-gray-600 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-400 text-sm mb-6">Save chairs you love for later</p>
              <Link href="/products" className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors">
                Browse Chairs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlistItems.map((item) => {
                const discount = getDiscount(item.mrp, item.sellingPrice);
                return (
                  <div key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50 h-52">
                      <Link href={`/products/${item.productId}`}>
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">🪑</div>
                        }
                      </Link>
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {discount > 0 && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
                        )}
                        {item.stock === 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Out of Stock</span>
                        )}
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="text-xs text-amber-700 font-medium mb-0.5">{item.category_name || ""}</div>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-amber-800 transition-colors mb-3">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(item.sellingPrice)}</span>
                        {discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(item.mrp)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(item, "")}
                        disabled={item.stock === 0}
                        className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                      >
                        <ShoppingCart size={15} />
                        {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
