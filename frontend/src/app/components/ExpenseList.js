"use client";

import React from "react";

export default function ExpenseList({ expenses, loading, onEdit, onDelete }) {
    //  Loading skeleton
    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-900 border border-gray-800 p-4 rounded-xl"
                    >
                        <div className="flex justify-between items-center">
                            <div className="h-4 w-40 bg-gray-700 rounded"></div>
                            <div className="h-4 w-16 bg-gray-700 rounded"></div>
                        </div>

                        <div className="h-3 w-24 bg-gray-700 rounded mt-3"></div>

                        <div className="flex gap-2 mt-3">
                            <div className="h-3 w-12 bg-gray-700 rounded"></div>
                            <div className="h-3 w-12 bg-gray-700 rounded"></div>
                        </div>

                        <div className="h-3 w-full bg-gray-700 rounded mt-3"></div>
                    </div>
                ))}
            </div>
        );
    }


    return (
        <div className="space-y-4">
            {expenses.map((e) => (
                <div
                    key={e._id}
                    className="bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-sm hover:border-gray-600 transition"
                >
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-semibold text-lg">
                                Expense - {e.title}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(e.date).toLocaleDateString()}
                            </p>
                        </div>

                        <span className="text-green-400 font-semibold text-lg">
                            Amount -  ₹{e.amount}
                        </span>
                    </div>

                    {/* Category */}
                    <p className="text-sm text-gray-400 mt-3">
                        Category - {e.category}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        <p className="text-sm text-gray-400 mt-1">Tags  -  </p>    {e.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-gray-800 px-2 py-1 text-xs rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Note */}
                    <p className="text-sm text-gray-500 mt-2">
                        Note - {e.note}
                    </p>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => onEdit(e)}
                            className="px-3 py-1 text-sm rounded-full bg-blue-600 hover:bg-blue-500 transition"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => onDelete(e._id)}
                            className="px-3 py-1 text-sm rounded-full bg-red-600 hover:bg-red-500 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}