import { RootState } from "@/store/store";
import api from "@/utils/baseUrl";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { error } from "console";
import toast, { Toaster } from "react-hot-toast";
import { object } from "yup";

export interface Book {
  _id?: string;
  title: string;
  author: string;
  category: string;
  description: string;
  price: number;
  pages: number;
  quantity: number;
  inStock: boolean;
  inwish: boolean;
  publisheddate: string;
  image: File | null;
}

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
}
const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
   async () => {
    let user = null;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) user = JSON.parse(stored);
    }
// console.log(user);

    let endpoint = "/";
    if (user === "user") endpoint = "/user/";
    if (user === "seller") endpoint = "/seller/";
    if (user === "admin") endpoint = "/admin/books";
    const res = await api.get(endpoint);
    //  console.log("API response:", res.data);
    return res.data.data || res.data;
  }
);
export const addNewBook = createAsyncThunk(
  "books/addNewBook",
  async (book: Book) => {
    const formData = new FormData();

    Object.entries(book).forEach(([key, value]) => {
      if (key === "image" && value) {
        formData.append("image", value as File);
      } else {
        formData.append(key, String(value));
      }
    });
    const res = await api.post("/seller/newbook", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);
export const deletebook = createAsyncThunk(
  "books/deletebook",
  async (id?: string) => {
    const res = await api.delete(`/seller/deletebook/${id}`);

    // console.log(res.data);
  }
);
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async (book: Book) => {
    if (!book._id) throw new Error("Book ID missing");
    const formData = new FormData();
    Object.entries(book).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any);
    });

    const res = await api.put(`/seller/updatebook/${book._id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},

 extraReducers: (builder) => {
  builder
    // ---------------- FETCH BOOKS ----------------
    .addCase(fetchBooks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBooks.fulfilled, (state, action) => {
      state.loading = false;
      state.books = action.payload;
    })
    .addCase(fetchBooks.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch books";
      toast.error(state.error);
    })

    // ---------------- ADD BOOK ----------------
    .addCase(addNewBook.pending, (state) => {
      state.loading = true;
      state.error = null;
      toast.loading("Adding book...", { id: "addBook" });
    })
    .addCase(addNewBook.fulfilled, (state, action) => {
      state.loading = false;
      state.books.push(action.payload);
      toast.success("Book added successfully", { id: "addBook" });
    })
    .addCase(addNewBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add book";
      toast.error(state.error, { id: "addBook" });
    })

    // ---------------- DELETE BOOK ----------------
    .addCase(deletebook.pending, (state) => {
      state.loading = true;
      state.error = null;
      toast.loading("Deleting book...", { id: "deleteBook" });
    })
    .addCase(deletebook.fulfilled, (state, action) => {
      state.loading = false;
      state.books = state.books.filter((b) => b._id !== action.payload);
      toast.success("Book deleted", { id: "deleteBook" });
    })
    .addCase(deletebook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete book";
      toast.error(state.error, { id: "deleteBook" });
    })

    // ---------------- UPDATE BOOK ----------------
    .addCase(updateBook.pending, (state) => {
      state.loading = true;
      state.error = null;
      toast.loading("Updating book...", { id: "updateBook" });
    })
    .addCase(updateBook.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.books.findIndex(
        (b) => b._id === action.payload._id
      );
      if (index !== -1) state.books[index] = action.payload;
      toast.success("Book updated successfully", { id: "updateBook" });
    })
    .addCase(updateBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update book";
      toast.error(state.error, { id: "updateBook" });
    });
}
   
});

export default bookSlice.reducer;
