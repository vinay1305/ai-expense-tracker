const express = require("express");
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
  getSummary,
  correctCategory
} = require("../controllers/expenseController");

router.post("/expenses", createExpense);
router.get("/expenses", getExpenses);
router.get("/expenses/summary", getSummary);
router.get("/expenses/:id", getExpenseById);
router.delete("/expenses/:id", deleteExpense);
router.put("/expenses/:id/correct", correctCategory);
module.exports = router;