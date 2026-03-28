"use client";
import React from "react";

export default function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-black border border-gray-800 p-6 rounded-2xl w-full max-w-md text-white shadow-xl">

        <h2 className="text-xl font-semibold mb-4">
          Delete Expense
        </h2>

        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 transition font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}