"use client";

import React, { useEffect, useState } from "react";
import SellerSidebar from "@/components/sellerSidebar";
import Sellerbookcard from "@/components/Sellerbookcard";
import { useRouter } from "next/navigation";
import AddBookModal from "@/components/Addbookmodal";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchBooks } from "@/store/slice/bookSlice/bookSlice";
import AdminSidebar from "@/components/AdminSidebar";

const SellerBook: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Redux state
  const { books, loading, error } = useSelector((state: RootState) => state.books);


  // Check access
const [checking, setChecking] = useState(true); // waiting for auth
useEffect(() => {
  const checkAndFetch = async () => {
    setChecking(true);

    const data = localStorage.getItem("user");
    const user = data ? JSON.parse(data) : null;

    // console.log("USER:", user); // "admin"

    // ✅ Correct check for string-based role
    if (user !== "admin") {
      router.replace("/");
      return;
    }

    try {
      await dispatch(fetchBooks());
    } finally {
      setChecking(false);
    }
  };

  checkAndFetch();
}, [router, dispatch]);





// console.log(books);

  if (checking) {
    // render loader until auth check is done
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking access...</p>
      </div>
    );
  }


  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
    
      <AdminSidebar/>


      <div className="flex-1 md:ml-64 p-6">
        

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (

            <Sellerbookcard key={book._id} book={book} />
          ))}
        </div>
      </div>

  
    </div>
  );
};

export default SellerBook;
