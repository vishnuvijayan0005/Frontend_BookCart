"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Home,
  Menu as MenuIcon,
  UserCircle,
  LogOut,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { useState } from "react";
import logo from "@/assets/LOGO.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slice/authSlice/authSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);
  const isLoggedIn = !!token;

  const handleLogout = () => {
    window.location.href = "/";
    dispatch(logout());
 
    
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/search?query=${search}`);
    setSearch("");
    setOpen(false);
  };

  return (
    <nav className="w-full bg-[#f8fafc] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 bg-sky-600 rounded-2xl flex items-center justify-center shadow-md shadow-sky-200">
            <Image src={logo} alt="logo" className=" object-contain" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Book Store</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-sky-600 transition"
          >
            <Home size={20} /> Home
          </button>

          <button
            onClick={() => {
              const token = localStorage.getItem("usertoken");
              if (!token) {
                toast.error(
                  <div>
                    Please Login{" "}
                    <button
                      className="ml-2 underline text-blue-500 hover:text-blue-700"
                      onClick={() => router.push("/auth/login")}
                    >
                      Click here
                    </button>
                  </div>,
                  {
                    duration: 2000, 
                    position: "top-center",
                  }
                );
              } else {
                router.push("/user/wishlist");
              }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-sky-600 transition"
          >
            <Heart size={20} /> Wishlist
          </button>

          <button
            onClick={() => router.push("/cart")}
            className="relative flex items-center gap-2 text-gray-600 hover:text-sky-600 transition"
          >
            <ShoppingCart size={20} />
            Cart
            <span className="absolute -top-2 -right-3 bg-sky-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              0
            </span>
          </button>

          {/* -------- SEARCH BAR (Desktop) ---------- */}
          <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-1 shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search books, author…"
              className="outline-none text-sm w-60 bg-transparent"
            />
            <button
              onClick={handleSearch}
              className="bg-sky-600 text-white px-3 py-1 rounded-lg hover:bg-sky-700 text-sm"
            >
              Search
            </button>
          </div>

          {/* Profile Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex items-center justify-center rounded-full focus:outline-none hover:bg-gray-100 p-1 transition">
              <UserCircle size={34} className="text-gray-700" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-20 mt-3 w-60 origin-top-right rounded-2xl border bg-white shadow-xl ring-1 ring-black/5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 duration-150"
            >
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-900">Welcome</p>
                <p className="text-xs text-gray-500">
                  {isLoggedIn ? "Manage your account" : "Login to continue"}
                </p>
              </div>

              <div className="py-2">
                <MenuItem>
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Settings size={18} /> Account Settings
                  </button>
                </MenuItem>

                <MenuItem>
                  <button
                    onClick={() => router.push("/support")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <LifeBuoy size={18} /> Support
                  </button>
                </MenuItem>

                <div className="border-t my-1" />

                {!isLoggedIn ? (
                  <MenuItem>
                    <button
                      onClick={() => router.push("/auth/login")}
                      className="w-[85%] mx-auto my-2 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition shadow"
                    >
                      Login
                    </button>
                  </MenuItem>
                ) : (
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="w-[85%] mx-auto my-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </MenuItem>
                )}
              </div>
            </MenuItems>
          </Menu>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl border bg-white shadow-sm hover:bg-gray-100"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col p-4 gap-4 text-gray-700">
            {/* Mobile Search */}
            <div className="flex gap-2 bg-gray-100 px-3 py-2 rounded-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search books…"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-sky-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                Go
              </button>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3"
            >
              <Home size={20} /> Home
            </button>

            <button
              onClick={() => router.push("/wishlist")}
              className="flex items-center gap-3"
            >
              <Heart size={20} /> Wishlist
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="flex items-center gap-3"
            >
              <ShoppingCart size={20} /> Cart
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-3"
            >
              <Settings size={20} /> Account Settings
            </button>

            <button
              onClick={() => router.push("/support")}
              className="flex items-center gap-3"
            >
              <LifeBuoy size={20} /> Support
            </button>

            <div className="border-t" />

            {!isLoggedIn ? (
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full py-2 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
