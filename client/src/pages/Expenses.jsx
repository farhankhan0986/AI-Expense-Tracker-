import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Filter, Receipt } from 'lucide-react';
import * as api from '../utils/api';
import ExpenseForm from '../components/ExpenseForm';

const DEMO_EXPENSES = [
  { _id: '1', description: 'Morning Coffee', category: 'Food', amount: 4.50, date: '2025-01-15' },
  { _id: '2', description: 'Uber to Office', category: 'Transport', amount: 12.00, date: '2025-01-14' },
  { _id: '3', description: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, date: '2025-01-13' },
  { _id: '4', description: 'Grocery Run', category: 'Food', amount: 67.30, date: '2025-01-12' },
  { _id: '5', description: 'Electric Bill', category: 'Bills', amount: 89.00, date: '2025-01-11' },
  { _id: '6', description: 'New Sneakers', category: 'Shopping', amount: 149.99, date: '2025-01-10' },
  { _id: '7', description: 'Pharmacy', category: 'Health', amount: 23.40, date: '2025-01-09' },
  { _id: '8', description: 'Online Course', category: 'Education', amount: 29.99, date: '2025-01-08' },
];

const CATEGORIES = ['all', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Travel', 'Other'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [feedback, setFeedback] = useState(null);

  const fetchExpenses = async () => {
    try {
      const data = await api.getExpenses();
      const list = data?.expenses || data || [];
      setExpenses(list.length ? list : DEMO_EXPENSES);
    } catch {
      setExpenses(DEMO_EXPENSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleAdd = async (expense) => {
    setAdding(true);
    try {
      await api.createExpense(expense);
      setFeedback({ type: 'success', text: 'Expense added!' });
      await fetchExpenses();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
      // Add locally as fallback
      setExpenses((prev) => [
        { _id: Date.now().toString(), ...expense, date: expense.date || new Date().toISOString() },
        ...prev,
      ]);
    } finally {
      setAdding(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== id));
      setFeedback({ type: 'success', text: 'Expense deleted' });
    } catch {
      setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== id));
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ marginBottom: 4 }}>Expenses</h2>
        <p style={{ marginBottom: 28 }}>Track and manage every transaction</p>
      </motion.div>

      {/* Add form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ marginBottom: 32 }}
      >
        <ExpenseForm onSubmit={handleAdd} loading={adding} />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}
      >
        <div className="search-bar" style={{ flex: '1 1 240px' }}>
          <Search size={16} className="search-bar-icon" />
          <input
            className="form-input"
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 42 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ minWidth: 140 }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Expense list */}
      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Receipt size={48} className="empty-state-icon" />
          <p>No expenses found</p>
        </div>
      ) : (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
          <AnimatePresence>
            {filtered.map((exp) => (
              <motion.div
                key={exp._id || exp.id}
                className="expense-item"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0 },
                }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <div className="expense-item-info">
                  <div className="expense-item-desc">{exp.description}</div>
                  <div className="expense-item-date">
                    {new Date(exp.date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric',
                    })}
                  </div>
                </div>
                <span className={`category-badge ${exp.category}`}>{exp.category}</span>
                <div className="expense-item-amount">-${exp.amount.toFixed(2)}</div>
                <button
                  className="btn btn-icon btn-danger btn-sm"
                  onClick={() => handleDelete(exp._id || exp.id)}
                  title="Delete expense"
                  aria-label={`Delete ${exp.description}`}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Feedback toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`toast toast-${feedback.type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
