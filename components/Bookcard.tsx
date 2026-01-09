"use client";

import { Book } from "@/store/slice/bookSlice/bookSlice";
import api from "@/utils/baseUrl";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface BookCardProps {
  onebook: Book;
  onToggle?: () => void;
}

export default function BookCard({ onebook, onToggle }: BookCardProps) {
  const router = useRouter();

  // Wishlist state
  const [wish, setWish] = useState(onebook?.inwish || false);
  const [loadingWish, setLoadingWish] = useState(false);

  // Update heart if prop changes (like after parent fetch)
  useEffect(() => {
    setWish(onebook?.inwish);
  }, [onebook?._id, onebook?.inwish]);

  // Demo rating
  const rating = 4.6;
  const reviews = 320;
  const mrp = onebook.price + 200;
  const discount = Math.round(((mrp - onebook.price) / mrp) * 100);

  // Image
  const imageSrc =
    typeof onebook.image === "string"
      ? onebook.image
      : onebook.image
      ? URL.createObjectURL(onebook.image)
      : "";

  const addToCart = async(id:string) => {
    try {
       if (loadingWish) return;
    setLoadingWish(true);

    const token = localStorage.getItem("usertoken");
    if (!token) {
      toast.error("Please Log in");
      setTimeout(() => router.push("/auth/login"), 1000);
      setLoadingWish(false);
      return;
    }
    const res=await api.post(`/addcart/${id}`)
  
    } catch (error) {
      
    }
  };

  // Wishlist toggle
  const toggleWishlist = async (bookId?: string) => {
    if (loadingWish) return;
    setLoadingWish(true);

    const token = localStorage.getItem("usertoken");
    if (!token) {
      toast.error("Please Log in");
      setTimeout(() => router.push("/auth/login"), 1000);
      setLoadingWish(false);
      return;
    }

    try {
      const res = await api.post(`/wishbook/${bookId}`);
      // console.log(res.data);

      if (res.data.success) {
        setWish(res.data.inWishlist); // ✅ correct key

        toast.success(
          res.data.inWishlist
            ? "Added to wishlist ❤️"
            : "Removed from wishlist 🤍"
        );
        if (onToggle) {
          await onToggle();
        }
      } else {
        toast.error("Wishlist update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoadingWish(false);
    }
  };

  return (
    <div className="w-[220px] sm:w-[230px] lg:w-[240px] bg-white rounded-xl shadow-md hover:shadow-lg transition border p-3 mx-auto cursor-pointer relative">
      {/* Image */}
      <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={onebook.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-400 text-sm">No Image</p>
        )}

        {/* Heart */}
        <button
          disabled={loadingWish}
          onClick={() => toggleWishlist(onebook._id)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow text-sm"
        >
          {wish ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2">
          {onebook.title || "Book Title"}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {onebook.author || "Author"}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="bg-green-600 text-white text-xs px-2 py-[2px] rounded">
            {rating} ⭐
          </span>
          <span className="text-xs text-gray-500">({reviews} reviews)</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{onebook.price}
          </span>
          <span className="text-sm line-through text-gray-500">₹{mrp}</span>
          <span className="text-sm text-green-600 font-semibold">
            {discount}% off
          </span>
        </div>

        <p
          className={`text-xs mt-1 ${
            onebook.inStock ? "text-green-600" : "text-red-500"
          }`}
        >
          {onebook.inStock ? "In Stock" : "Out of Stock"}
        </p>

        <button
          disabled={!onebook.inStock}
          onClick={() => onebook.inStock && addToCart(onebook._id!)}
          className={`mt-2 w-full py-2 rounded-lg font-semibold text-sm transition ${
            onebook.inStock
              ? "bg-sky-600 text-white hover:bg-sky-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {onebook.inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>

      <Toaster />
    </div>
  );
}
