"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Heart, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import api from "@/utils/baseUrl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wish, setWish] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        toast.error("Please login to view details");
        router.push("/auth/login");
        return;
      }
      try {
        const res = await api.get(`/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(res.data.data);
        setWish(res.data.data.inwish || false);
      } catch (err) {
        toast.error("Failed to fetch book");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, router]);

  const addToCart = async () => {
    if (!book) return;
    const request = api.post(`/cart/${book._id}`);
    toast.promise(request, {
      loading: "Adding...",
      success: "Added to cart",
      error: "Error adding to cart",
    });
    await request;
  };

  const toggleWishlist = async () => {
    if (!book || loadingWish) return;
    setLoadingWish(true);
    try {
      const res = await api.post(`/wishbook/${book._id}`);
      if (res.data.success) {
        setWish(res.data.inWishlist);
        toast.success(res.data.inWishlist ? "Saved" : "Removed");
      }
    } finally {
      setLoadingWish(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  if (!book) return null;

  const mrp = book.price + 200;
  const discount = Math.round(((mrp - book.price) / mrp) * 100);

  return (<>
  <Navbar/>
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-start p-4 md:p-8 font-sans">
      <Toaster position="bottom-center" />

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-gray-800 text-lg ml-4">Book Details</h2>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Book Image */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner relative w-full aspect-[3/4] flex items-center justify-center">
              <img
                src={book.image}
                alt={book.title}
                className="h-64 md:h-72 w-auto object-contain drop-shadow-lg transition-transform hover:scale-105 duration-300"
              />
              <button
                onClick={toggleWishlist}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
              >
                <Heart
                  size={18}
                  className={wish ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </button>
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {book.title}
                </h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">
                  Author: <span className="text-sky-600 font-medium">{book.author}</span>
                </p>
              </div>
              <Star size={24} className="text-gray-300 hover:text-yellow-500 cursor-pointer" />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{book.price}</span>
              <span className="line-through text-gray-400 text-sm md:text-base">₹{mrp}</span>
              <span className="text-green-600 font-semibold text-sm md:text-base">{discount}% off</span>
            </div>

            {/* Description */}
            {book.description && (
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-2">
                {showFullDesc
                  ? book.description
                  : book.description.length > 120
                  ? book.description.slice(0, 120) + "..."
                  : book.description}
                {book.description.length > 120 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="ml-1 text-sky-600 font-semibold text-xs md:text-sm"
                  >
                    {showFullDesc ? "Show Less" : "Read More"}
                  </button>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Total Price
            </span>
            <span className="text-lg md:text-xl font-bold text-gray-900">₹{book.price}.00</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={toggleWishlist}
              className="flex-1 sm:flex-none px-6 py-2 md:py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-white transition-all active:scale-95 bg-white"
            >
              {wish ? "Saved" : "Save for Later"}
            </button>
            <button
              onClick={addToCart}
              disabled={!book.inStock}
              className={`flex-1 sm:flex-none px-8 md:px-10 py-2 md:py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                book.inStock
                  ? "bg-sky-600 hover:bg-sky-700 shadow-sky-200"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {book.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    
    </div>
      <Footer/>
  </>
  );
}
