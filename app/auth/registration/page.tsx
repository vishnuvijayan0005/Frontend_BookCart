"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import logo from "@/assets/LOGO.svg";
import api from "@/utils/baseUrl";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [userrole, setUserrole] = useState("user");

  const RegisterSchema = Yup.object({
    name: Yup.string()
      .required("Full name is required")
      .matches(
        /^[A-Za-z][A-Za-z ]*$/,
        "Name must start with a letter and contain only letters and spaces"
      )
      .test("min-letters", "Name must contain at least 3 letters", (value) => {
        if (!value) return false;
        return value.replace(/[^A-Za-z]/g, "").length >= 3;
      }),

    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[^\s@]+@[^\s@]{3,}\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/,
        "Email must be in a valid format"
      ),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <div className="bg-white rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 relative w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center shadow-md shadow-sky-200">
            <Image src={logo} alt="logo" className="w-8 h-8 object-contain" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Start your literary journey with{" "}
            <span className="text-sky-600 font-semibold">BookStore</span>
          </p>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const payload = {
              username: values.name,
              usermail: values.email,
              userrole,
              password: values.password,
            };

            try {
              await toast.promise(
                api.post("/registration", payload),
                {
                  loading: "Creating account...",
                  success: (res) =>
                    res.data.message || "Account created successfully!",
                  error: (err) =>
                    err?.response?.data?.message ||
                    "Registration failed",
                }
              );

              resetForm();
              router.push("/auth/login");
            } catch {
              // toast handles errors
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Full Name
                </label>
                <div className="relative group mt-2">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition" />
                  <Field
                    type="text"
                    name="name"
                    placeholder="John Wick"
                    className="w-full h-11 pl-12 pr-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition"
                  />
                </div>
                <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
              </div>

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
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  I want to...
                </label>
                <div className="flex p-1 bg-gray-100 rounded-2xl mt-2">
                  {["user", "seller"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setUserrole(r)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                        userrole === r
                          ? "bg-white text-sky-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {r === "user" ? "Buy Books" : "Sell Books"}
                    </button>
                  ))}
                </div>
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
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Confirm Password
                </label>
                <div className="relative group mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition" />
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full h-11 pl-12 pr-12 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition"
                  />
                </div>
                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-3 rounded-2xl bg-sky-600 text-white font-bold text-lg hover:bg-sky-700 transition shadow-lg shadow-sky-200 flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-sky-600 font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
