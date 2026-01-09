"use client";
import BookCard from "@/components/Bookcard";
import Navbar from "@/components/Navbar";
import { Book } from "@/store/slice/bookSlice/bookSlice";
import api from "@/utils/baseUrl";
import React, { useEffect, useState } from "react";



const WishlistPage = () => {
  const [wishbooks, setWishbooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlist");
        // console.log(res.data.data);
        
       setWishbooks(res.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
  useEffect(() => {
  
    fetchWishlist();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading wishlist...</p>
    );
  if (wishbooks.length === 0)
    return (<>
    <Navbar/>
      <p className="text-center mt-10 text-gray-500">
        Your wishlist is empty 😢
      </p>
    </>
    );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishbooks.map((item) => (
            <BookCard key={item._id} onebook={item} onToggle={fetchWishlist} />
          ))}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
