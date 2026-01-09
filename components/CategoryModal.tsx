// components/CategoryAddModal.tsx
"use client";

import { useEffect, useState } from "react";

interface CategoryAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => void;

  // ✅ optional props for edit
  initialValue?: string;
  isEdit?: boolean;
}

export default function CategoryAddModal({
  isOpen,
  onClose,
  onSubmit,
  initialValue = "",
  isEdit = false,
}: CategoryAddModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Prefill input when editing
  useEffect(() => {
    if (isOpen) {
      setCategoryName(initialValue);
    }
  }, [initialValue, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(categoryName.trim());
      setCategoryName("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Category" : "Add Category"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
