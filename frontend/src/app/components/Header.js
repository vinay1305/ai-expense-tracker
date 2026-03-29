"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };
const displayName = username?.length > 10
  ? username.slice(0, 10) + "..."
  : username;
  return (
    <div className="sticky top-0 z-50 bg-black border-b border-gray-800 text-white">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        {/* Logo */}
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-center sm:text-left">
          💰 Expense Tracker
        </h1>

        {/* Right section */}
        <div className="flex items-center justify-between sm:justify-end gap-3">

          {/* Username */}
          <span className="text-xs sm:text-sm text-gray-300 truncate max-w-[140px] sm:max-w-none">
            Hi,{" "}
            <span className="text-white font-medium">
              {displayName || "User"}
            </span>
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-1.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-gray-200 transition whitespace-nowrap"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}