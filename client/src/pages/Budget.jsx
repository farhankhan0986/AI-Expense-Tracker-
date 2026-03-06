import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Save } from 'lucide-react';
import * as api from '../utils/api';
import BudgetAlert from '../components/BudgetAlert';

const CATEGORIES = ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'health', 'education', 'other'];

const DEMO_BUDGETS = {
  food: { limit: 500, spent: 420 },
  transport: { limit: 200, spent: 145 },
  entertainment: { limit: 200, spent: 210 },
  utilities: { limit: 350, spent: 310 },
  shopping: { limit: 300, spent: 150 },
  health: { limit: 150, spent: 90 },
  education: { limit: 100, spent: 30 },
  other: { limit: 200, spent: 60 },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Budget() {
  const [budgets, setBudgets] = useState(DEMO_BUDGETS);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState('');
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [limitsRes, alertsRes, expensesRes] = await Promise.allSettled([
          api.getBudgetLimits(),
          api.getBudgetAlerts(),
          api.getExpenses(),
        ]);

        let limits = {};
        if (limitsRes.status === 'fulfilled' && limitsRes.value) {
          const data = limitsRes.value?.limits || limitsRes.value;
          if (typeof data === 'object') limits = data;
        }

        let expenses = [];
        if (expensesRes.status === 'fulfilled') {
          expenses = expensesRes.value?.expenses || expensesRes.value || [];
        }

        // Build budget map from limits + actual spending
        if (Object.keys(limits).length || expenses.length) {
          const spent = {};
          expenses.forEach((e) => {
            spent[e.category] = (spent[e.category] || 0) + e.amount;
          });

          const merged = {};
          CATEGORIES.forEach((cat) => {
            merged[cat] = {
              limit: limits[cat] || DEMO_BUDGETS[cat]?.limit || 200,
              spent: spent[cat] || 0,
            };
          });
          setBudgets(merged);
        }

        if (alertsRes.status === 'fulfilled' && Array.isArray(alertsRes.value)) {
          setAlerts(alertsRes.value);
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveLimit = async () => {
    if (!editCategory || !editValue) return;
    setSaving(true);
    try {
      await api.setBudgetLimit(editCategory, parseFloat(editValue));
    } catch {
      // Apply locally
    }
    setBudgets((prev) => ({
      ...prev,
      [editCategory]: { ...prev[editCategory], limit: parseFloat(editValue) },
    }));
    setEditCategory('');
    setEditValue('');
    setSaving(false);
  };

  // Derive alerts from budgets
  const derivedAlerts = Object.entries(budgets)
    .map(([cat, { limit, spent }]) => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      limit,
      spent,
      percentage: limit > 0 ? (spent / limit) * 100 : 0,
    }))
    .filter((a) => a.percentage >= 80);

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ marginBottom: 4 }}>Budget</h2>
        <p style={{ marginBottom: 32 }}>Set limits and track spending per category</p>
      </motion.div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
          {/* Set budget limit */}
          <motion.div variants={item} className="glass-card" style={{ padding: 24, marginBottom: 32, maxWidth: 500 }}>
            <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} /> Set Budget Limit
            </h4>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <select
                className="form-select"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                style={{ flex: '1 1 140px' }}
              >
                <option value="">Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
              <input
                className="form-input"
                type="number"
                placeholder="Limit ($)"
                min="0"
                step="10"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                style={{ flex: '1 1 120px' }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSaveLimit}
                disabled={!editCategory || !editValue || saving}
              >
                <Save size={14} /> Save
              </button>
            </div>
          </motion.div>

          {/* Budget progress bars */}
          <motion.div variants={item} style={{ marginBottom: 32 }}>
            <h4 style={{ marginBottom: 16 }}>
              <Wallet size={18} style={{ display: 'inline', marginRight: 8 }} />
              Spending vs Budget
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {CATEGORIES.map((cat) => {
                const b = budgets[cat] || { limit: 200, spent: 0 };
                const pct = b.limit > 0 ? Math.min((b.spent / b.limit) * 100, 100) : 0;
                const level = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : '';

                return (
                  <div key={cat} className="glass-card" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{cat}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ${b.spent.toFixed(0)} / ${b.limit.toFixed(0)}
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className={`progress-bar-fill ${level}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Budget alerts */}
          {derivedAlerts.length > 0 && (
            <motion.div variants={item}>
              <h4 style={{ marginBottom: 14 }}>Alerts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {derivedAlerts.map((a, i) => (
                  <BudgetAlert key={i} {...a} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
