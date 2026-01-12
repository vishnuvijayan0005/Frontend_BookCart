"use client";

import {
  Book,
  deletebook,
  fetchBooks,
} from "@/store/slice/bookSlice/bookSlice";
import { AppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddBookModal from "./Addbookmodal";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handledelete = async (id?: string) => {
    if (!id) return;
    await dispatch(deletebook(id));
    dispatch(fetchBooks());
  };
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  // Open modal for edit
  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setOpenAddModal(true);
  };



  const [isUser, setIsUser] = useState(false);

useEffect(() => {
   const checkAndFetch = async () => {
      const stored = localStorage.getItem("user");
      const userRole = stored ? JSON.parse(stored):null
setIsUser(userRole === "seller");

    }

    checkAndFetch();
}, []);


  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col justify-between">
      {/* Book Image */}
      {book.image && (
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      {/* Book Details */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-gray-500 text-sm mt-1">{book.author}</p>
        <p className="text-gray-700 mt-1">Category: {book.category}</p>
        <p className="text-gray-700 mt-1">Pages: {book.pages}</p>
        <p className="text-gray-700 mt-1">Quantity: {book.quantity}</p>
        <p className="text-gray-700 mt-1">Price: ₹{book.price}</p>
        <p className="text-gray-700 mt-1">
          In Stock: {book.inStock ? "Yes" : "No"}
        </p>

        <p className="text-gray-700 mt-1">
          Published:
          {book.publisheddate
            ? new Date(book.publisheddate).toLocaleDateString()
            : "N/A"}
        </p>
        {book.description && (
          <p className="text-gray-600 mt-2 text-sm">{book.description}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid gap-2 mt-4">
       <button
  disabled={!isUser}
  onClick={() => handleEditBook(book)}
  className={`py-2 w-full rounded-lg transition 
    ${
    isUser
      ? "bg-sky-600 text-black hover:bg-sky-700"
      : "bg-gray-400 text-white cursor-not-allowed"
  }
  `}
>
  Edit
</button>
        <button
          className="py-2 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={() => handledelete(book._id)}
        >
          Delete
        </button>
      </div>
      {openAddModal && (
        <AddBookModal
          isOpen={openAddModal}
          bookToEdit={editBook}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </div>
  );
};

export default BookCard;
