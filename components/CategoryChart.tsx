"use client";

import { Pie } from "react-chartjs-2";
import "@/utils/Chart";
import api from "@/utils/baseUrl";
import { useEffect, useState } from "react";

interface CategoryStat {
  category: string;
  count: number;
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
];

export default function CategoryChart() {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/seller/categorychart");
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[250px] sm:h-[300px] bg-white rounded-xl shadow">
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  const data = {
    labels: stats.map((item) => item.category),
    datasets: [
      {
        label: "Books per Category",
        data: stats.map((item) => item.count),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true, // use aspect ratio to make it scale
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 14,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 sm:p-6 max-w-full lg:max-w-[900px] mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Books by Category
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Distribution of books across categories
          </p>
        </div>

        {/* Chart */}
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] aspect-[1/1]">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
