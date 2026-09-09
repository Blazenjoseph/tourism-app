import { useState, useEffect } from "react";
import Link from "next/link";

const categories = [
  { key: "accommodation", label: "🏨 Accommodation" },
  { key: "food", label: "🍽️ Food & Dining" },
  { key: "transport", label: "🚗 Transport" },
  { key: "activities", label: "🎟️ Activities & Entry" },
  { key: "shopping", label: "🛍️ Shopping" },
  { key: "misc", label: "📦 Miscellaneous" },
];

export default function BudgetTracker() {
  const [totalBudget, setTotalBudget] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "accommodation", amount: "", note: "" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("budgetTracker") || "null");
    if (saved) {
      setTotalBudget(saved.totalBudget || "");
      setExpenses(saved.expenses || []);
    }
  }, []);

  function persist(budget, exp) {
    localStorage.setItem("budgetTracker", JSON.stringify({ totalBudget: budget, expenses: exp }));
  }

  function handleBudgetChange(e) {
    const value = e.target.value;
    setTotalBudget(value);
    persist(value, expenses);
  }

  function addExpense(e) {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;

    const newExpense = {
      id: Date.now(),
      category: form.category,
      amount: Number(form.amount),
      note: form.note,
    };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    persist(totalBudget, updated);
    setForm({ category: form.category, amount: "", note: "" });
  }

  function removeExpense(id) {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    persist(totalBudget, updated);
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetNum = Number(totalBudget) || 0;
  const remaining = budgetNum - totalSpent;
  const percentUsed = budgetNum > 0 ? Math.min((totalSpent / budgetNum) * 100, 100) : 0;

  const byCategory = categories.map((cat) => ({
    ...cat,
    total: expenses.filter((e) => e.category === cat.key).reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.total > 0);

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="logo">TravelMitra</Link>
          <div className="nav-links">
            <Link href="/trip-planner">AI Trip Planner</Link>
            <Link href="/heritage-explorer">Heritage Explorer</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/packing-list">Packing List</Link>
            <Link href="/budget-tracker">Budget Tracker</Link>
          </div>
        </div>
      </nav>

      <div className="container detail-page">
        <h1>Trip Budget Tracker 💰</h1>
        <p style={{ color: "#666" }}>Track your spending against your trip budget.</p>

        <div style={{ maxWidth: 480, marginTop: 20 }}>
          <label style={{ fontSize: 14, color: "#666", marginBottom: 6, display: "block" }}>
            Total trip budget (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 25000"
            value={totalBudget}
            onChange={handleBudgetChange}
            style={{
              display: "block",
              width: "100%",
              padding: 12,
              marginBottom: 20,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 15,
            }}
          />

          {budgetNum > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                <span>Spent: ₹{totalSpent.toLocaleString()}</span>
                <span style={{ color: remaining < 0 ? "#c0392b" : "#2e7d32" }}>
                  {remaining < 0 ? `Over by ₹${Math.abs(remaining).toLocaleString()}` : `₹${remaining.toLocaleString()} left`}
                </span>
              </div>
              <div style={{ background: "#eee", borderRadius: 20, height: 12, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${percentUsed}%`,
                    height: "100%",
                    background: percentUsed >= 100 ? "#c0392b" : "linear-gradient(135deg, #ec7a3f, #d9622b)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          <form onSubmit={addExpense} style={{ background: "white", padding: 18, borderRadius: 16, boxShadow: "0 2px 10px rgba(60,40,20,0.05)" }}>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>Add an expense</h3>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }}
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <input
              type="text"
              placeholder="Note (optional, e.g. Hotel Chamundi 2 nights)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={{ display: "block", width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <button type="submit" className="btn" style={{ width: "100%" }}>Add Expense</button>
          </form>

          {byCategory.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 16 }}>By category</h3>
              {byCategory.map((c) => (
                <div key={c.key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
                  <span>{c.label}</span>
                  <strong>₹{c.total.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          )}

          {expenses.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 16 }}>All expenses</h3>
              {expenses.slice().reverse().map((e) => {
                const cat = categories.find((c) => c.key === e.category);
                return (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee", fontSize: 13.5 }}>
                    <div>
                      <div>{cat?.label} {e.note && `— ${e.note}`}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <strong>₹{e.amount.toLocaleString()}</strong>
                      <button
                        onClick={() => removeExpense(e.id)}
                        style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 16 }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
