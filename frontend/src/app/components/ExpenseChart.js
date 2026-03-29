"use client";

import { useState } from "react";
import {
    PieChart, Pie, Cell,
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

export default function ExpenseChart({ data }) {
    const [type, setType] = useState("pie");

    //  Improved empty state
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available 📊
            </div>
        );
    }

    return (
        <div className="w-full">

            {/*  Toggle Buttons */}
            <div className="flex gap-2 mb-4">
                {["pie", "bar", "line"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-3 py-1 rounded-full text-sm transition ${type === t
                            ? "bg-white text-black"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                    >
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Chart Container */}
            <div className="w-full h-[300px] flex">
                <ResponsiveContainer width="100%" height="100%">

                    {/*  PIE */}
                    {type === "pie" && (
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="total"
                                nameKey="_id"
                                outerRadius={100}
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    )}

                    {/*  BAR */}
                    {type === "bar" && (
                        <BarChart data={data}>
                            <XAxis dataKey="_id" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                            <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    )}

                    {/*  LINE */}
                    {type === "line" && (
                        <LineChart data={data}>
                            <XAxis dataKey="_id" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#22c55e"
                                strokeWidth={2}
                            />
                        </LineChart>
                    )}

                </ResponsiveContainer>
            </div>
        </div>
    );
}