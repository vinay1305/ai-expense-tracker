"use client";

import { useState } from "react";
import API from "../services/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please enter all details");
      return;
    }

    const loadingToast = toast.loading("Creating account...");

    try {
      // 1️⃣ Register
      await API.post("/auth/register", {
        username,
        email,
        password
      });

      // 2️⃣ Auto login immediately
      const res = await API.post("/auth/login", {
        username,
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.dismiss(loadingToast);
      toast.success("Account created 🎉");

      // 3️⃣ Go to dashboard
      router.push("/dashboard");

    } catch (err) {
      toast.dismiss(loadingToast);
      console.log(err)
      toast.error(
        err.response?.data?.error || "Registration failed ❌"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-black p-8 rounded-2xl border border-gray-800 shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Create your account
        </h1>

        {/* ✅ FORM START */}
        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
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
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-full transition ${loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
              }`}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

        </form>
        {/* ✅ FORM END */}

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}