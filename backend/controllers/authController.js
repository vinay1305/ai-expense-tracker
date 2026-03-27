// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashed
        });

        await user.save();

        res.json({ message: "User registered" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//logout
const logout = async (req, res) => {
    try {
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = { register, login, logout };