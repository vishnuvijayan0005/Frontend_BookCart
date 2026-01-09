"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  addNewBook,
  updateBook,
  fetchBooks,
  Book,
} from "@/store/slice/bookSlice/bookSlice";
import api from "@/utils/baseUrl";


interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToEdit?: Book | null;
}
interface Category {
  _id: string;
  categoryName: string;
}

export default function AddBookModal({
  isOpen,
  onClose,
  bookToEdit,
}: AddBookModalProps) {
  const dispatch = useDispatch<AppDispatch>();
const[categories,setCategories]=useState<Category[]>([])
  const [formData, setFormData] = useState<Book>({
    title: "",
    author: "",
    category: "General",
    description: "",
    price: 0,
    pages: 0,
    quantity: 1,
    inStock: true,
    inwish: false,
    publisheddate: "",
    image: null,
  });

  useEffect(() => {
    if (bookToEdit) setFormData(bookToEdit);
    
  }, [bookToEdit]);
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
  
      
      setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  fetchCategories();
}, []);

 const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {

  const target = e.target;
  const { name, value } = target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target instanceof HTMLInputElement && target.type === "number"
        ? Number(value)
        : value,
  }));
};

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, image: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (bookToEdit) await dispatch(updateBook(formData));
    else await dispatch(addNewBook(formData));

    await dispatch(fetchBooks());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blur bg-opacity-30">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {bookToEdit ? "Edit Book" : "Add New Book"}
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div>
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
            >
              <option value="">Select category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min={0}
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div>
            <label>Pages</label>
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              min={1}
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div>
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={1}
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div>
            <label>Published Date</label>
            <input
              type="date"
              name="publisheddate"
              value={formData.publisheddate}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div>
            <label>Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="instock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            <label>In Stock</label>
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="border w-full px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-lg mt-2"
          >
            {bookToEdit ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
