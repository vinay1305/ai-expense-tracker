"use client";
import React from "react";

export default function AddExpense({
    addExpense,
    setTitle,
    title,
    amount,
    setAmount,
    setShowModal,
    date,
    setDate,
    editingId,
    category,
    setCategory,
    tags,
    setTags,
    note,
    setNote
    , isSubmitting
}) {
    const isDisabled = !title || !amount || !date;

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-black border border-gray-800 p-6 rounded-2xl w-full max-w-md shadow-xl text-white">

                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? "Edit Expense" : "Add Expense"}
                </h2>

                {/* Title */}
                <input
                    placeholder="Title"
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
                    value={title || ""}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Amount */}
                <input
                    type="number"
                    placeholder="Amount"
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
                    value={amount || ""}
                    onChange={(e) => setAmount(e.target.value)}
                />

                {/* Date */}
                <input
                    type="date"
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
                    value={date || ""}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/*  SHOW ONLY IN EDIT MODE */}
                {editingId && (
                    <>
                        {/* Category */}
                        <input
                            placeholder="Category"
                            className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
                            value={category || ""}
                            onChange={(e) => setCategory(e.target.value)}
                        />

                        {/* Tags */}
                        <input
                            placeholder="Tags (comma separated)"
                            className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
                            value={tags || ""}
                            onChange={(e) => setTags(e.target.value)}
                        />

                        {/* Note */}
                        <textarea
                            placeholder="Note"
                            className="w-full mb-4 px-4 py-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
                            value={note || ""}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={addExpense}
                        disabled={isDisabled || isSubmitting}
                        className={`px-4 py-2 rounded-full font-semibold transition ${isDisabled || isSubmitting
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-white text-black hover:bg-gray-200"
                            }`}
                    >
                        {isSubmitting
                            ? "Processing..."
                            : editingId
                                ? "Update"
                                : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
}