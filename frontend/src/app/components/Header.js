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

    return (
        <div className="flex justify-between items-center px-6 py-4 bg-black border-b border-gray-800 text-white sticky top-0 z-50">

            {/* Left: Logo */}
            <h1 className="text-xl font-bold tracking-tight">
                💰 Expense Tracker
            </h1>

            {/* Right: User + Logout */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">
                    Hi, <span className="text-white font-medium">{username}</span>
                </span>

                <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}