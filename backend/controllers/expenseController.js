const mongoose = require("mongoose");
const Exceljs = require("exceljs");
const Expense = require("../models/Expense");
const { classifyExpense, addCorrection } = require("../services/aiService");

// CREATE EXPENSE
const createExpense = async (req, res) => {
    try {
        const { title, amount, date } = req.body;

        if (!title || !amount || !date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const aiData = await classifyExpense(title);

        const expense = new Expense({
            title,
            amount,
            date,
            category: aiData.category,
            tags: aiData.tags,
            note: aiData.note,
            user: req.user.userId
        });

        await expense.save();

        // Populate user info
        const populatedExpense = await Expense.findById(expense._id)
            .populate("user", "email username");

        res.status(201).json({ message: "Expense created successfully", populatedExpense });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL EXPENSES (with filters and pagination )
const getExpenses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const { category, tag } = req.query;

        let filter = {
            user: req.user.userId
        };

        // 🔥 Case-insensitive category
        if (category) {
            filter.category = { $regex: `^${category}$`, $options: "i" };
        }

        // 🔥 Case-insensitive tag (array)
        if (tag) {
            filter.tags = { $regex: tag, $options: "i" };
        }

        const expenses = await Expense.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

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
// EDIT EXPENSE
const updateExpense = async (req, res) => {
    try {
        const { title, amount, date, category, tags, note } = req.body;

        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        // update fields 
        if (title) expense.title = title;
        if (amount) expense.amount = amount;
        if (date) expense.date = date;
        if (category) expense.category = category;
        if (tags) expense.tags = tags;
        if (note) expense.note = note;

        await expense.save();

        const updatedExpense = await Expense.findById(expense._id)
            .populate("user", "email username");

        res.json({
            message: "Expense updated successfully",
            expense: updatedExpense
        });

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

        res.json({ message: "Expense deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SUMMARY (AI category-based)
const getSummary = async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.userId)
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        //console.log("Summary generated:", summary);
        res.json(summary);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  CORRECT CATEGORY (AI LEARNING)
const correctCategory = async (req, res) => {
    try {
        const { category } = req.body;

        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        //store correction in AI memory
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

const getTrend = async (req, res) => {
    try {
        const trend = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.userId)
                }
            }, {
                $addFields: {
                    parsedDate: {
                        $toDate: "$date"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$parseddate"
                        }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(trend);
        // console.log(trend)
        // console.log("Trend API HIT");
        // console.log("User ID:", req.user?.userId);
    } catch (err) {
        console.log("TREND ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};
// Excel download
const exportExpenses = async (req, res) => {
    try {
        const { category, tag } = req.query;

        let filter = { user: req.user.userId };

        if (category) filter.category = category;
        if (tag) filter.tags = tag;

        const expenses = await Expense.find(filter).sort({ createdAt: -1 });

        const workbook = new Exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Expense Report");

        //  TITLE
        worksheet.mergeCells("A1:F1");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = "Expense Report";
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: "center" };

        //  Subtitle
        worksheet.mergeCells("A2:F2");
        worksheet.getCell("A2").value = `Generated on: ${new Date().toLocaleDateString()}`;
        worksheet.getCell("A2").alignment = { horizontal: "center" };

        //  Columns
        worksheet.columns = [
            { header: "Title", key: "title", width: 20 },
            { header: "Amount (₹)", key: "amount", width: 15 },
            { header: "Category", key: "category", width: 15 },
            { header: "Tags", key: "tags", width: 20 },
            { header: "Note", key: "note", width: 30 },
            { header: "Date", key: "date", width: 15 },
        ];

        //  Start rows after title
        const startRow = 4;

        // Add header row manually
        worksheet.getRow(startRow).values = [
            "Title",
            "Amount (₹)",
            "Category",
            "Tags",
            "Note",
            "Date",
        ];

        //  Style header
        worksheet.getRow(startRow).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF3B82F6" }, // blue
            };
            cell.alignment = { horizontal: "center" };
        });

        let total = 0;

        //  Data rows
        expenses.forEach((exp, index) => {
            const row = worksheet.addRow({
                title: exp.title,
                amount: exp.amount,
                category: exp.category,
                tags: exp.tags.join(", "),
                note: exp.note,
                date: new Date(exp.date).toLocaleDateString(),
            });

            total += exp.amount;

            // optional zebra styling
            if (index % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFF9FAFB" },
                    };
                });
            }
        });

        //  TOTAL ROW
        const totalRow = worksheet.addRow({});
        const totalLabelCell = worksheet.getCell(`A${totalRow.number}`);
        totalLabelCell.value = "Total";
        totalLabelCell.font = { bold: true };

        const totalValueCell = worksheet.getCell(`B${totalRow.number}`);
        totalValueCell.value = total;
        totalValueCell.font = { bold: true };

        // Freeze header
        worksheet.views = [{ state: "frozen", ySplit: startRow }];

        //  Response
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=expense-report.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    deleteExpense,
    updateExpense,
    getSummary,
    correctCategory,
    getTrend,
    exportExpenses
};