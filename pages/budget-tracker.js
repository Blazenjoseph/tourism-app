import { useState, useEffect } from "react";
import { AppShell, ToolIntro } from "@/components/app-shell";

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
    <AppShell>
      <ToolIntro eyebrow="Spending, but make it visible" title="Trip Budget Tracker" description="Track every rupee against your trip budget so the fun doesn&apos;t turn into a spreadsheet surprise." />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)]">
        <div className="tm-surface h-fit p-5 sm:p-7">
          <label className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-neutral-600">
            Total trip budget (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 25000"
            value={totalBudget}
            onChange={handleBudgetChange}
            className="tm-input"
          />

          {budgetNum > 0 && (
            <div className="mt-5 rounded-2xl border-2 border-neutral-950 bg-orange-50 p-4">
              <div className="mb-2 flex justify-between gap-4 text-sm font-black">
                <span>Spent: ₹{totalSpent.toLocaleString()}</span>
                <span className={remaining < 0 ? "text-red-700" : "text-emerald-700"}>
                  {remaining < 0 ? `Over by ₹${Math.abs(remaining).toLocaleString()}` : `₹${remaining.toLocaleString()} left`}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border-2 border-neutral-950 bg-white">
                <div
                  style={{
                    width: `${percentUsed}%`,
                    height: "100%",
                    background: percentUsed >= 100 ? "#ef4444" : "linear-gradient(135deg, #f97316, #ec4899)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          <form onSubmit={addExpense} className="mt-6 rounded-[1.5rem] border-2 border-neutral-950 bg-neutral-950 p-5 text-white">
            <h3 className="tm-heading text-2xl">Add an expense</h3>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="tm-input mt-4"
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
              className="tm-input mt-3"
            />
            <input
              type="text"
              placeholder="Note (optional, e.g. Hotel Chamundi 2 nights)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="tm-input mt-3"
            />
            <button type="submit" className="mt-3 w-full rounded-2xl border-2 border-white bg-orange-400 px-5 py-3 font-black uppercase tracking-[.1em] text-neutral-950 shadow-[3px_3px_0_0_#fff] transition-colors hover:bg-pink-400">Add Expense</button>
          </form>
        </div>

        <div className="space-y-8">
          {byCategory.length > 0 && (
            <div className="tm-surface p-5 sm:p-7">
              <h3 className="tm-heading text-2xl">By category</h3>
              {byCategory.map((c) => (
                <div key={c.key} className="mt-4 flex items-center justify-between border-b-2 border-dashed border-neutral-200 pb-3 text-sm font-bold">
                  <span>{c.label}</span>
                  <strong>₹{c.total.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          )}

          {expenses.length > 0 && (
            <div className="tm-surface p-5 sm:p-7">
              <h3 className="tm-heading text-2xl">All expenses</h3>
              {expenses.slice().reverse().map((e) => {
                const cat = categories.find((c) => c.key === e.category);
                return (
                  <div key={e.id} className="mt-3 flex items-center justify-between gap-3 border-b-2 border-dashed border-neutral-200 pb-3 text-sm">
                    <div>
                      <div>{cat?.label} {e.note && `— ${e.note}`}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong>₹{e.amount.toLocaleString()}</strong>
                      <button
                        onClick={() => removeExpense(e.id)}
                        className="rounded-lg border-2 border-red-600 px-2 py-1 font-black text-red-700 transition-colors hover:bg-red-50"
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
    </AppShell>
  );
}
