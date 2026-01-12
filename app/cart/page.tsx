"use client";

import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/utils/baseUrl";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("usertoken"));
    setRole(localStorage.getItem("user"));
  }, []);

  useEffect(() => {
    if (!token) return;

    setAuthorized(true);

    const fetchCartProduct = async () => {
      try {
        const result = await api.get("/cartproducts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartData: CartItem[] = result.data.data.map((item: any) => ({
          id: item._id,
          productId: item.result._id,
          title: item.result.title,
          price: item.result.price,
          image: item.result.image,
          quantity: 1,
        }));

        setCart(cartData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartProduct();
  }, [token]);

  if (!authorized) return null;

  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await api.delete(`/cartdelete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message, { position: "top-right" });

      setCart((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

 return (
  <>
    <Navbar />

    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Your Cart
        </h1>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          
          {/* LEFT : CART ITEMS */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 shadow"
              >
                {/* IMAGE */}
                <div className="w-full sm:w-28 h-40 sm:h-28 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-base sm:text-lg line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-indigo-600 font-semibold mt-1">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* QTY */}
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>

                      <span className="px-4 font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="bg-white rounded-xl p-10 text-center text-gray-500">
                <p className="text-lg">Your cart is empty 🛒</p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* RIGHT : ORDER SUMMARY */}
          <div className="bg-white rounded-xl p-6 shadow h-fit sticky top-6">
            <h2 className="text-xl font-semibold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-600 mb-3">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-3">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <button className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
              Checkout
            </button>
          </div>

        </div>
      </div>
    </div>

    <Footer />
  </>
);

}
