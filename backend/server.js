const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://ai-expense-tracker-pied-chi.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// connect DB
connectDB();

app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// routes
app.use("/api", expenseRoutes);
app.use("/api/auth", authRoutes);


// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});