"use client";

import React, { useEffect, useState } from "react";
import SellerSidebar from "@/components/sellerSidebar";
import Sellerbookcard from "@/components/Sellerbookcard";
import { useRouter } from "next/navigation";
import AddBookModal from "@/components/Addbookmodal";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchBooks } from "@/store/slice/bookSlice/bookSlice";

const SellerBook: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Redux state
  const { books, loading, error } = useSelector((state: RootState) => state.books);


  // Check access
const [checking, setChecking] = useState(true); // waiting for auth

  useEffect(() => {
  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;

  // Not logged in
  if (!user) {
    router.replace("/");
    return;
  }

 

  // Not seller → block access
  if (user !== "seller") {
    router.replace("/");
    return;
  }

  // ✅ Seller allowed
  dispatch(fetchBooks());
  setChecking(false);
}, [router, dispatch]);


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
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main content */}
      <div className="flex-1 md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Books</h1>
          <button
            className="px-4 py-2 bg-indigo-600 text-black border rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
            onClick={() => setOpenAddModal(true)}
          >
            Add Book
          </button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (

            <Sellerbookcard key={book._id} book={book} />
          ))}
        </div>
      </div>

      {/* Add Book Modal */}
      {openAddModal && (
        <AddBookModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </div>
  );
};

export default SellerBook;
