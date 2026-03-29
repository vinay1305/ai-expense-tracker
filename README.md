# 💰 AI Expense Tracker

A modern full-stack expense tracking application with **AI-powered categorization**, interactive **charts**, and a **clean responsive UI**.

---

## 🚀 Features

### 🧾 Core Functionality

* Add, edit, and delete expenses
* AI-based expense categorization (auto tags, category, notes)
* Secure authentication using JWT
* Pagination for large datasets

### 📊 Analytics

* Category-wise expense visualization (Pie / Bar / Line charts)
* Real-time updates on data changes

### ⚡ UX Improvements

* Debounced filtering (category & tags)
* Toast notifications for actions
* Prevent duplicate submissions
* Loading skeletons for better experience

### 📱 Responsive Design

* Mobile-first UI
* Works seamlessly across devices
* Clean SaaS-style dashboard

### 🚀 Feature Added

- 📥 Export expenses to Excel (.xlsx)
- 🎯 Filter-based export (category & tags)
- 🎨 Styled report with headers, colors, and formatting
- 💰 Total expense calculation in Excel

### 💡 Highlights

- Professional finance-style report
- Improved readability with zebra rows
- Frozen header row for better UX
- Dynamic data export based on filters

### 🛠 Tech Used

- ExcelJS
- Express.js
- Axios (blob download)

---

## 🛠 Tech Stack

### Frontend

* **Next.js (App Router)**
* **Tailwind CSS**
* **Recharts**
* **Axios**
* **React Hot Toast**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**
* **JWT Authentication**
* **bcrypt.js**

### AI Integration

* Google Gemini API for smart expense classification

---

## 📂 Project Structure

```
expense-tracker/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── hooks/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/vinay1305/ai-expense-tracker.git
cd ai-expense-tracker
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication

* Register with email, username, password
* Login using email + password
* JWT stored in localStorage

---

## 📸 Screenshots (Add these)

* Dashboard UI
* Add Expense Modal
* Charts View
* Mobile View

---

## 🧠 Key Learnings

* Implemented **debouncing for API optimization**
* Designed **scalable REST APIs**
* Integrated **AI for intelligent categorization**
* Built **responsive UI with Tailwind**
* Managed **state and async flows efficiently**

---

## 🚀 Future Improvements

* Export reports (PDF/CSV)
* Monthly analytics dashboard
* Budget alerts & notifications
* Dark/Light mode toggle
* Role-based authentication

---

## 👨‍💻 Author

**Vinay Kumar**

* GitHub: https://github.com/vinay1305

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
