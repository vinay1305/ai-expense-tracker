const Expense = require("../models/Expense");
const { classifyExpense, addCorrection } = require("../services/aiService");

// CREATE EXPENSE
const createExpense = async (req, res) => {
    try {
        const { title, amount, date } = req.body;

        if (!title || !amount || !date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // 🔥 AI classification
        const aiData = await classifyExpense(title);

        const expense = new Expense({
            title,
            amount,
            date,
            category: aiData.category,
            tags: aiData.tags,
            note: aiData.note,  //  NEW FIELD
            user: req.user.userId
        });

        await expense.save();

        res.status(201).json(expense);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL EXPENSES (with filters)
const getExpenses = async (req, res) => {
    try {
        const { category, tag } = req.query;

        let filter = { user: req.user.userId };

        if (category) filter.category = category;
        if (tag) filter.tags = tag;

        const expenses = await Expense.find(filter).sort({ date: -1 });

        res.json(expenses);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET SINGLE EXPENSE
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.userId
        });
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.json(expense);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE EXPENSE
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.json({ message: "Deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SUMMARY (AI category-based)
const getSummary = async (req, res) => {
    try {
       const summary = await Expense.aggregate([
  { $match: { user: req.user.userId } },
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" }
    }
  }
]);

        res.json(summary);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// BONUS: CORRECT CATEGORY (AI LEARNING)
const correctCategory = async (req, res) => {
    try {
        const { category } = req.body;

        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        // 🧠 store correction in AI memory
        addCorrection(expense.title, category);

        expense.category = category;
        await expense.save();

        res.json({
            message: "Category updated",
            expense
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    deleteExpense,
    getSummary,
    correctCategory
};