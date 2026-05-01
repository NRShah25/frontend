# 💰 FinanceTracker — Frontend

A personal finance dashboard built with React and Material UI, 
connected to a Spring Boot backend REST API.

## 🛠 Tech Stack

- **React 18** + **Vite**
- **Material UI (MUI)** — component library
- **Recharts** — data visualization
- **Axios** — HTTP client
- **React Router** — client side routing

## ✨ Features

- JWT authentication (register, login, auto logout on expiry)
- Dashboard with income, expense and balance summary cards
- Spending breakdown pie chart by category
- Real-time budget alerts banner (WARNING / EXCEEDED)
- Transaction management (add, view, delete)
- Budget management with visual progress bars
- Protected routes (redirect to login if unauthenticated)

## 🚀 Running Locally

### Prerequisites
- Node.js v22+
- npm
- Backend running at `http://localhost:8080`

### Steps

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser

## 🔗 Related

- [FinanceTracker Backend](https://github.com/NRShah25/backend)
