import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Filter, Receipt } from 'lucide-react';
import * as api from '../utils/api';
import ExpenseForm from '../components/ExpenseForm';
import DataPod from '../components/DataPod';
import InsightsSidebar from '../components/InsightsSidebar';

const DEMO_EXPENSES = [];

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
      setExpenses(list);
    } catch {
      setExpenses([]);
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

      {/* Main Grid for Ledger and Insights */}
      <div className="ledger-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        
        {/* Ledger Column */}
        <div>
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
                placeholder="Search databanks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 42, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bg-glass-border)' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ minWidth: 140, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bg-glass-border)' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Data' : c}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Scrolling LED display timeline */}
          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Receipt size={48} className="empty-state-icon" />
              <p>No transaction records found in database.</p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Timeline center line running down */}
              <div style={{ position: 'absolute', left: '44px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
              
              <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 1 }}
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              >
                <AnimatePresence>
                  {filtered.map((exp) => (
                    <DataPod key={exp._id || exp.id} expense={exp} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="insights-sidebar">
          <InsightsSidebar />
        </div>
      </div>

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
