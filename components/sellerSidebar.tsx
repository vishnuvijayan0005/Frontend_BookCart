"use client";

import { logout } from "@/store/slice/authSlice/authSlice";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SellerSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // 👈 mobile toggle

  useEffect(() => {
    const data = localStorage.getItem("user");
    const user = data ? JSON.parse(data) : null;

    if (!user || user !== "seller") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="p-6">Checking access...</p>;

  return (
    <>
      {/* 🔹 Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-sky-600 text-white p-2 rounded-lg shadow"
      >
        <Menu size={20} />
      </button>

      {/* 🔹 Overlay (Mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm p-5
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-sky-600">Book Seller</h2>

          {/* Close button (mobile) */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link href="/seller/dashboard">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
              Dashboard
            </button>
          </Link>

          <Link href="/seller/book">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
              My Books
            </button>
          </Link>

          <Link href="/seller/orders">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
              Orders
            </button>
          </Link>

          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Payments
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              dispatch(logout());
              router.push("/");
            }}
            className="mt-10 flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
