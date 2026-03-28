"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import ProtectedRoute from "../components/ProtectedRoutes";
import Header from "../components/Header";
import ExpenseList from "../components/ExpenseList";
import AddExpense from "../components/AddExpense";
import DeleteModal from "../components/DeleteModal";
import useDebounce from "../../hooks/useDebounce";
export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  // For pagination 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // for filter
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  // for debounce 
  const debouncedCategory = useDebounce(categoryFilter, 500);
  const debouncedTag = useDebounce(tagFilter, 500);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      let url = `/expenses?page=${page}`;

     if (debouncedCategory) {
  url += `&category=${debouncedCategory}`;
}

if (debouncedTag) {
  url += `&tag=${debouncedTag}`;
}

      const res = await API.get(url);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setExpenses((prev) =>
          page === 1 ? res.data : [...prev, ...res.data]
        );
      }

    } catch (err) {
      toast.error("Failed to load expenses ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  },[page, debouncedCategory, debouncedTag]);
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };
  const addExpense = async () => {
    const loadingToast = toast.loading(
      editingId ? "Updating expense..." : "Adding expense..."
    );

    try {
      let res;

      if (editingId) {
        res = await API.put(`/expenses/${editingId}`, {
          title,
          amount,
          date,
          category,
          tags: tags ? tags.split(",").map(t => t.trim()) : [],
          note
        });

        setEditingId(null);
      } else {
        res = await API.post("/expenses", {
          title,
          amount,
          date
        });
      }

      toast.dismiss(loadingToast);
      toast.success(res.data?.message || "Success");

      // reset form
      setShowModal(false);
      setTitle("");
      setAmount("");
      setDate("");
      setCategory("");
      setTags("");
      setNote("");

      //trigger refetch via useEffect
      setPage(1);
      setHasMore(true);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Something went wrong ❌");
    }
  };
  const handleEdit = (expense) => {
    setShowModal(true);
    setTitle(expense.title || "");
    setAmount(expense.amount || "");
    setDate(expense.date?.split("T")[0] || "");
    setCategory(expense.category || "");
    setTags(expense.tags?.join(", ") || "");
    setNote(expense.note || "");
    setEditingId(expense._id);
  };
  const handleDelete = (id) => {
    setDeleteId(id); // open modal
  };
  const confirmDelete = async () => {
    const loadingToast = toast.loading("Deleting expense...");

    try {
      const res = await API.delete(`/expenses/${deleteId}`);

      toast.dismiss(loadingToast);
      toast.success(res.data?.message || "Deleted");

      setDeleteId(null);

      // trigger refetch via useEffect
      setPage(1);
      setHasMore(true);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Delete failed ❌");
    }
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
          <div className="flex flex-wrap gap-3 mb-6">

            {/* Category Filter */}
            <input
              placeholder="Filter by category"
              className="px-4 py-2 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />

            {/* Tag Filter */}
            <input
              placeholder="Filter by tag"
              className="px-4 py-2 rounded-lg bg-black border border-gray-700 focus:outline-none focus:border-blue-500"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            />

            {/* Apply Button */}
            {/* <button
              onClick={() => {
                setPage(1);
                setHasMore(true);
              }}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              Apply
            </button> */}

            {/* Reset Button */}
            <button
              onClick={() => {
                setCategoryFilter("");
                setTagFilter("");
                setPage(1);
                setHasMore(true);
              }}
              className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Reset
            </button>

          </div>
          {/* EXPENSE LIST */}
          <ExpenseList expenses={expenses}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete} />
        </div>

        {/* MODAL */}
        {showModal && (
          <AddExpense
            addExpense={addExpense}
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            setShowModal={setShowModal}
            date={date}
            setDate={setDate}
            editingId={editingId}
            note={note}
            setNote={setNote}
            category={category}
            setCategory={setCategory}
            tags={tags}
            setTags={setTags}
          />
        )}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className={`px-5 py-2 rounded-full transition ${loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        {deleteId && (
          <DeleteModal
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}