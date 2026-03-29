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
import ExpenseChart from "../components/ExpenseChart";

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

  // pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const debouncedCategory = useDebounce(categoryFilter, 500);
  const debouncedTag = useDebounce(tagFilter, 500);

  // charts
  const [summary, setSummary] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // for disabled state of add/edit button in modal 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------- FETCH EXPENSES ----------------
  const fetchExpenses = async () => {
    try {
      setLoading(true);

      let url = `/expenses?page=${page}`;

      if (debouncedCategory) url += `&category=${debouncedCategory}`;
      if (debouncedTag) url += `&tag=${debouncedTag}`;

      const res = await API.get(url);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setExpenses((prev) =>
          page === 1 ? res.data : [...prev, ...res.data]
        );
      }
    } catch (err) {
      console.error("Fetch expenses error:", err);
      toast.error("Failed to load expenses ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, debouncedCategory, debouncedTag]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // ---------------- CHARTS ----------------
  const fetchSummary = async () => {
    try {
      const res = await API.get("/expenses/summary");
      setSummary(res.data);
    } catch {
      toast.error("Summary error ❌");
    }
  };

  const fetchTrend = async () => {
    try {
      const res = await API.get("/expenses/trend");
      setTrendData(res.data);
    } catch {
      toast.error("Trend error ❌");
    }
  };

  // 🔥 CENTRAL REFRESH FUNCTION
  const refreshAllData = () => {
    if (page === 1) {
      fetchExpenses();
    } else {
      setPage(1);
    }

    setHasMore(true);

    // charts refresh
    fetchSummary();
    fetchTrend();
  };

  useEffect(() => {
    fetchSummary();
    fetchTrend();
  }, []);

  // ---------------- ADD / EDIT ----------------
  const addExpense = async () => {
    if (isSubmitting) return; //  block double click

    setIsSubmitting(true);

    const loadingToast = toast.loading(
      editingId ? "Updating..." : "Adding..."
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

      refreshAllData();

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Error ❌");
    } finally {
      setIsSubmitting(false); //  re-enable
    }
  };

  // ---------------- EDIT ----------------
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

  // ---------------- DELETE ----------------
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    const loadingToast = toast.loading("Deleting...");

    try {
      const res = await API.delete(`/expenses/${deleteId}`);

      toast.dismiss(loadingToast);
      toast.success(res.data?.message || "Deleted");

      setDeleteId(null);

      refreshAllData();

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Delete failed ❌");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <Header />

        <div className="px-4 sm:px-6 md:px-8 py-6 max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
              Dashboard
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              + Add Expense
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">

            <input
              placeholder="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />

            <input
              placeholder="Tag"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={() => {
                setCategoryFilter("");
                setTagFilter("");
                setPage(1);
                setHasMore(true);
              }}
              className="w-full sm:w-auto bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Reset
            </button>

          </div>

          {/* CHART */}
          <div className="mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition">

              <h2 className="text-base sm:text-lg font-semibold mb-4 text-center">
                Category-wise Spending 📊
              </h2>

              <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
                <ExpenseChart data={summary} />
              </div>

            </div>
          </div>

          {/* LIST */}
          <ExpenseList
            expenses={expenses}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

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
            isSubmitting={isSubmitting}
          />
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="flex justify-center px-4 pb-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className={`w-full sm:w-auto px-5 py-2 rounded-full transition ${loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {/* DELETE MODAL */}
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