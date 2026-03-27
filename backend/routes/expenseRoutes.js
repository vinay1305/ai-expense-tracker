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
const authMiddleware = require("../middleware/authMiddleware");

router.post("/expenses",authMiddleware, createExpense);
router.get("/expenses", authMiddleware,getExpenses);
router.get("/expenses/summary",authMiddleware, getSummary);
router.get("/expenses/:id", authMiddleware,getExpenseById);
router.delete("/expenses/:id", authMiddleware,deleteExpense);
router.put("/expenses/:id/correct", authMiddleware,correctCategory);
module.exports = router;