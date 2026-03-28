"use client";

import { useState } from "react";
import API from "../services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-black p-8 rounded-2xl border border-gray-800 shadow-xl">

        {/* Logo / Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Sign in to Expense Tracker
        </h1>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition"
        >
          Log in
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Register */}
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