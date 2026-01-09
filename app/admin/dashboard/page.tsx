"use client";

import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBook,
  FaShoppingCart,
  FaStore,
  FaChartPie,
} from "react-icons/fa";

import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();
  useEffect(() => {
    const data = localStorage.getItem("user");
    const user = data ? JSON.parse(data) : null;

    if (!user || user !== "admin") {
      // Not admin, redirect
      router.push("/");
    } else {
      // Admin, allow access
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Checking access...</p>;

  const stats = [
    {
      title: "Total Users",
      count: 1200,
      icon: <FaUsers className="text-white w-6 h-6" />,
      color: "bg-sky-600",
    },
    {
      title: "Sellers",
      count: 85,
      icon: <FaStore className="text-white w-6 h-6" />,
      color: "bg-green-600",
    },
    {
      title: "Orders",
      count: 540,
      icon: <FaShoppingCart className="text-white w-6 h-6" />,
      color: "bg-yellow-500",
    },
    {
      title: "Books",
      count: 2200,
      icon: <FaBook className="text-white w-6 h-6" />,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}

      <AdminSidebar />
      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 p-6 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            className="md:hidden p-2 rounded-md bg-sky-600 text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`flex items-center justify-between p-4 rounded-xl shadow-md ${stat.color} text-white`}
            >
              <div>
                <h3 className="text-sm font-medium">{stat.title}</h3>
                <p className="mt-2 text-2xl font-bold">{stat.count}</p>
              </div>
              <div className="p-3 rounded-full bg-white/20">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md"></div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-4">Other Metrics</h2>
            {/* Placeholder for other charts */}
            <p className="text-gray-500">You can add more charts here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
