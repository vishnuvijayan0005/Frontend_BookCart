"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import logo from "@/assets/LOGO.svg";
import api from "@/utils/baseUrl";

import { login } from "@/store/slice/authSlice/authSlice";
import { RootState } from "@/store/store";

export default function LoginPage() {
  const router = useRouter();

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[^\s@]+@[^\s@]{3,}\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/,
        "Enter a valid email"
      ),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Minimum 6 characters"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <div className="bg-white rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 relative">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center shadow-md shadow-sky-200">
            <Image src={logo} alt="logo" className="w-8 h-8 object-contain" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Login to continue your{" "}
            <span className="text-sky-600 font-semibold">BookStore</span>{" "}
            journey
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const payload = {
                usermail: values.email,
                password: values.password,
              };
              

              const result = await api.post("/login", payload);

              toast.success(result.data.message || "Login successful!", {
                position: "top-right",
              });

              dispatch(
                login({
                  user: result.data.user.role,
                  token: result.data.token,
                })
              );
              const role = result.data.user.role;

              resetForm();
              if (role === "admin") {
                router.push("/admin/dashboard");
              } else if (role === "seller") {
                router.push("/seller/dashboard");
              } else {
                router.push("/");
              }
            } catch (error: any) {
              toast.error(
                error?.response?.data?.message || "Invalid credentials",
                { position: "top-right" }
              );
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Email Address
                </label>
                <div className="relative group mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="w-full h-11 pl-12 pr-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Password
                </label>
                <div className="relative group mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition" />
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full h-11 pl-12 pr-12 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-600 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-3 rounded-2xl bg-sky-600 text-white font-bold text-lg hover:bg-sky-700 transition shadow-lg shadow-sky-200 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Signing in..." : "Login"}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t text-center">
          <p className="text-gray-500 text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/auth/registration")}
              className="text-sky-600 font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
