"use client";

import { useState, useEffect } from "react";
import API from "../services/api";
import ProtectedRoute from "../components/ProtectedRoutes";
import Header from "../components/Header";
import ExpenseList from "../components/ExpenseList";
import AddExpense from "../components/AddExpense";
export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchExpenses = async () => {
    setLoading(true);
    const res = await API.get("/expenses");
    setExpenses(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    await API.post("/expenses", {
      title,
      amount,
      date
    });

    setShowModal(false);
    setTitle("");
    setAmount("");
    setDate("");
    fetchExpenses();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <Header />

        {/* MAIN CONTENT */}
        <div className="p-6 max-w-4xl mx-auto">

          {/* Top Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              + Add Expense
            </button>
          </div>

          {/* EXPENSE LIST */}
          <ExpenseList expenses={expenses} loading={loading} />
        </div>

        {/* MODAL */}
        {showModal && (
          <AddExpense addExpense={addExpense}
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            setShowModal={setShowModal}
            date={date}
            setDate={setDate} />
        )}
      </div>
    </ProtectedRoute>
  );
}