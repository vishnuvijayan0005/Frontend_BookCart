"use client";
import CategoryChart from "@/components/CategoryChart";
import SellerSidebar from "@/components/sellerSidebar";
import { fetchBooks } from "@/store/slice/bookSlice/bookSlice";
import { AppDispatch } from "@/store/store";
import {
  BookOpen,
  ShoppingCart,
  DollarSign,
  Users,
  Menu,
  LogOut,
  Sidebar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SellerDashboard() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const data = localStorage.getItem("user");
    const user = data ? JSON.parse(data) : null;

    if (!user || user !== "seller") {
      router.push("/");
      setLoading(true)
    } else {
      setLoading(false); // allow access
    }
  }, []);
  if (loading) return <p>Checking access...</p>;



  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Section */}
      <div className="flex-1 md:ml-64">
        {/* Navbar */}
        <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center sticky top-0">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2  rounded-lg"
          >
            <Menu />
          </button>

          <h1 className="text-xl font-semibold">Seller Dashboard</h1>

         
        </header>

        {/* Content */}
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Total Books</p>
                <BookOpen className="text-sky-600" />
              </div>
              <h2 className="text-2xl font-bold mt-2">120</h2>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Orders</p>
                <ShoppingCart className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mt-2">48</h2>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Revenue</p>
                <DollarSign className="text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold mt-2">₹12,560</h2>
            </div>

            <div className="p-5 bg-white rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Customers</p>
                <Users className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mt-2">32</h2>
            </div>
          </section> */}

          {/* Recent Orders */}
          <CategoryChart/>
        </main>
      </div>
    </div>
  );
}
