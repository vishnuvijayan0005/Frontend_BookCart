"use client";

import AdminSidebar from "@/components/AdminSidebar";
import CategoryList from "@/components/CategoryCards";
import CategoryAddModal from "@/components/CategoryModal";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Category {
  _id: string;
  categoryName: string;
}

function Category() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // ✅ ADMIN CHECK + FETCH
  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const data = localStorage.getItem("user");
      const user = data ? JSON.parse(data) : null;

      // since you store "admin" as string
      if (user !== "admin") {
        router.push("/");
        return;
      }

      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [router]);

  if (loading) return <p className="p-6">Checking access...</p>;

  // ✅ ADD CATEGORY
  const handleAddCategory = async (name: string) => {
    try {
      const result = await api.post("/admin/addcategory", {
        categoryname: name,
      });

      if (result.data.success) {
        setCategories((prev) => [...prev, result.data.data]);
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // ✅ OPEN EDIT
  const onEdit = (category: Category) => {
    setEditCategory(category);
    setOpenEdit(true);
  };

  // ✅ UPDATE CATEGORY
  const handleEditCategory = async (name: string) => {
    if (!editCategory) return;

    try {
      const res = await api.put(
        `/admin/getcategorybyid/${editCategory._id}`,
        {
          categoryname: name,
        }
      );


      if (res.data.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editCategory._id
              ? { ...cat, categoryName: name }
              : cat
          )
        );
        setOpenEdit(false);
        setEditCategory(null);
      }
    } catch (err) {
      console.error("Error updating category", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 ml-0 md:ml-64 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Categories</h1>

          <button
            className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700"
            onClick={() => setModalOpen(true)}
          >
            Add Category
          </button>
        </div>

        {/* Category List */}
        {categories.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            Sorry, no categories found
          </p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <CategoryList
                key={cat._id}
                id={cat._id}
                categoryName={cat.categoryName}
                onEdit={() => onEdit(cat)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      <CategoryAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      {/* EDIT MODAL */}
      {openEdit && editCategory && (
        <CategoryAddModal
          isOpen={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setEditCategory(null);
          }}
          onSubmit={handleEditCategory}
          initialValue={editCategory.categoryName}
          isEdit
        />
      )}
    </div>
  );
}

export default Category;
