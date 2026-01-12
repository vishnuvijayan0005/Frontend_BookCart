"use client";

import { fetchBooks } from "@/store/slice/bookSlice/bookSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "./Bookcard";
import BannerSlider from "./Banner";

export default function CategoryBrowser() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8; // You can adjust this

  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector((state: RootState) => state.books.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const categories = [
    "All",
    ...Array.from(new Set(books?.map((b) => b.category))),
  ];

  const filteredBooks =
    activeCategory === "All"
      ? books
      : books?.filter((b) => b.category === activeCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  return (
    <>
      {/* ---------- MOBILE TOGGLE BUTTON ---------- */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-20 right-4 z-50
           p-3 bg-sky-600 text-white rounded-full shadow-lg
           transition hover:bg-sky-700"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ---------- DESKTOP CATEGORY NAVBAR ---------- */}
      <div className="hidden md:flex sticky top-16 z-40 bg-white border-b justify-center shadow-sm">
        <div className="flex gap-3 px-6 py-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1); // reset page on category change
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  activeCategory === cat
                    ? "bg-sky-600 text-white shadow"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MOBILE SIDEBAR ---------- */}
      <div
        className={`md:hidden fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-white border-r shadow-lg p-4 transform transition-transform z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-lg font-semibold mb-4">Categories</h2>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSidebarOpen(false);
                setCurrentPage(1); // reset page on category change
              }}
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  activeCategory === cat
                    ? "bg-sky-600 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
            >
              <span className="w-3 h-3 mr-2 rounded-full bg-sky-400"></span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- MOBILE OVERLAY ---------- */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed top-16 left-0 w-full h-[calc(100%-4rem)] bg-black opacity-30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="pt-16 md:pt-0 bg-gray-100 min-h-screen">
        {/* ---------- BANNER ---------- */}
        <BannerSlider />

        {/* ---------- BOOKS GRID ---------- */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {activeCategory} Books
          </h2>

          {!filteredBooks?.length ? (
            <p className="text-gray-600">No books found</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentBooks.map((bk) => (
                  <div
                    key={bk._id!}
                    className="bg-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 min-h-[350px]"
                  >
                    <BookCard onebook={bk} />
                  </div>
                ))}
              </div>

              {/* ---------- PAGINATION ---------- */}
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md transition
                      ${
                        currentPage === page
                          ? "bg-sky-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
