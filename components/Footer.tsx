"use client";

import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" bg-sky-200  shadow-inner ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-bold text-sky-600">BookApp</h1>
            <p className="text-gray-500 text-sm mt-1 text-center md:text-left">
              Your favorite books, all in one place
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-semibold text-gray-700 mb-2">Quick Links</h2>
            <nav className="flex flex-row gap-3">
              <Link href="/" className="text-gray-500 hover:text-sky-600 transition">
                Home
              </Link>
              <Link href="/books" className="text-gray-500 hover:text-sky-600 transition">
                Books
              </Link>
              <Link href="/wishlist" className="text-gray-500 hover:text-sky-600 transition">
                Wishlist
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-sky-600 transition">
                Contact
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-semibold text-gray-700 mb-2">Follow Us</h2>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-500 hover:text-sky-600 transition"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-sky-600 transition"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-sky-600 transition"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t pt-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} BookApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
