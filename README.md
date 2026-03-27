# ai-expense-tracker
A simple full stack project with ai expense tracking system
# 💰 AI Expense Tracker

A full-stack expense tracking application with AI-powered classification using Google Gemini.

---

## 🚀 Features

* Add, view, delete expenses
* AI-based category classification (Gemini API)
* Tags and notes generated automatically
* Expense summary by category
* JWT Authentication (user-specific data)
* MongoDB database integration

---

## 🧠 AI Integration

When a user creates an expense:

* The backend sends the expense title to Gemini API
* AI returns:

  * Category (Food, Transport, etc.)
  * Tags
  * Explanation note
* If AI fails → fallback logic is used

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose)
* **AI:** Google Gemini API
* **Auth:** JWT

---

## 📦 Installation

```bash
git clone https://github.com/vinay1305/ai-expense-tracker.git
cd ai-expense-tracker/backend
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_secret
```

---

## ▶️ Run Server

```bash
npm run dev
```

---

## 📡 API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Expenses

* POST /api/expenses
* GET /api/expenses
* GET /api/expenses/:id
* DELETE /api/expenses/:id
* GET /api/expenses/summary

---

## 🧪 Testing

Use Postman:

* Add Authorization header:

```
Bearer <token>
```

---

## ⚠️ Notes

* `.env` is ignored for security
* `.env.example` should be used for setup
* Includes fallback AI logic for reliability

---

## 🎯 Bonus

* Supports user-specific expense tracking
* Designed for scalability and real-world use

---

## 👨‍💻 Author

Vinay Kumar
