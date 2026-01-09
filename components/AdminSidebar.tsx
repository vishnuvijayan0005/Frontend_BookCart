"use client";

import { logout } from "@/store/slice/authSlice/authSlice";
import { AppDispatch } from "@/store/store";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

function AdminSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-sky-600">Super Admin</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-md p-5
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="hidden md:block text-2xl font-bold text-sky-600 mb-6">
          Super Admin
        </h2>

        <nav className="space-y-2">
          {[
            { href: "/admin/dashboard", label: "Dashboard" },
            { href: "/admin/users", label: "Users" },
            { href: "/admin/sellers", label: "Sellers" },
            { href: "/admin/books", label: "Books" },
            { href: "/admin/category", label: "Category" },
            { href: "/admin/banners", label: "Banner Change" },
            { href: "/superadmin/orders", label: "Orders" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
                {item.label}
              </button>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;
