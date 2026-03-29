"use client";

import { useState } from "react";
import API from "../services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter all details");
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res?.data?.message || "Logged in successfully!");
      router.push("/dashboard");

    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-black p-8 rounded-2xl border border-gray-800 shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Sign in to Expense Tracker
        </h1>

        {/*  FORM START */}
        <form onSubmit={handleLogin}>

          <input
            type="email"
            pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition"
          >
            Log in
          </button>

        </form>


        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <p className="text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}