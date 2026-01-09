"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { Banner } from "@/components/Banner";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // 3 separate banner slots
  const [banner1, setBanner1] = useState<File | null>(null);
  const [banner2, setBanner2] = useState<File | null>(null);
  const [banner3, setBanner3] = useState<File | null>(null);

  // ✅ Small preview URLs
  const [preview1, setPreview1] = useState<Banner[]>([]);

  useEffect(() => {
    const checkAndFetch = async () => {
      setChecking(true);

      const data = localStorage.getItem("user");
      const user = data ? JSON.parse(data) : null;

      if (user !== "admin") {
        router.replace("/");
        return;
      }

      try {
        const res = await api.get("/admin/getbanner");
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
    const fetchbanner = async () => {
      const res = api.get("/getbanner");
      setPreview1((await res).data.data);
    };
    fetchbanner();
    checkAndFetch();
  }, [router]);

  // Handlers
  const handleBannerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0] || null;
    if (index === 0) {
      setBanner1(file);
    }
    if (index === 1) {
      setBanner2(file);
    }
    if (index === 2) {
      setBanner3(file);
    }
  };

  const handleSaveBanners = async () => {
    const formData = new FormData();

    if (banner1) formData.append("banner1", banner1);
    if (banner2) formData.append("banner2", banner2);
    if (banner3) formData.append("banner3", banner3);

    try {
      await api.post("/admin/addbanner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Banners updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload banners");
    }
  };

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking access...</p>
      </div>
    );
  }

  const banners = [banner1, banner2, banner3];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1 md:ml-64 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Banner Management
          </h1>

          <button
            onClick={handleSaveBanners}
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Banners
          </button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold mb-2">Banner {index + 1}</h3>

              {/* Main Banner */}
              {banner ? (
                <img
                  src={URL.createObjectURL(banner)}
                  className="h-44 sm:h-52 md:h-56 w-full object-cover rounded-lg mb-3"
                  alt={`Banner ${index + 1}`}
                />
              ) : (
                <div className="h-44 sm:h-52 md:h-56 bg-gray-100 flex items-center justify-center rounded-lg mb-3 text-gray-400 text-sm">
                  No Image
                </div>
              )}

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBannerChange(e, index)}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:bg-indigo-50 file:text-indigo-700
                           hover:file:bg-indigo-100 mb-3"
              />
            </div>
          ))}
          {/* ✅ Preview Block */}
        </div>
        <div className="flex flex-col gap-6 mt-6">
          {preview1.map((preview, index) =>
            preview ? (
              <div
                key={index}
                className="w-full h-52 md:h-64 lg:h-72 border rounded-lg overflow-hidden shadow-md relative"
              >
                {/* Banner Title */}
                <div className="absolute top-0 left-0 w-full bg-black/40 text-white text-sm md:text-base font-semibold px-3 py-1">
                  Banner {index + 1}
                </div>

                {/* Banner Image */}
                <img
                  src={preview.url}
                  className="w-full h-full object-cover"
                  alt={`Preview ${index + 1}`}
                />
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
