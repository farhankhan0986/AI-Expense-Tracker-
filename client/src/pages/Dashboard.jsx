import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, Tag, Hash, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import * as api from '../utils/api';
import StatCard from '../components/StatCard';
import BudgetAlert from '../components/BudgetAlert';

/* Demo data for standalone viewing */
const DEMO_EXPENSES = [
  { _id: '1', description: 'Morning Coffee', category: 'food', amount: 4.50, date: '2025-01-15' },
  { _id: '2', description: 'Uber to Office', category: 'transport', amount: 12.00, date: '2025-01-14' },
  { _id: '3', description: 'Netflix Subscription', category: 'entertainment', amount: 15.99, date: '2025-01-13' },
  { _id: '4', description: 'Grocery Run', category: 'food', amount: 67.30, date: '2025-01-12' },
  { _id: '5', description: 'Electric Bill', category: 'utilities', amount: 89.00, date: '2025-01-11' },
];

const DEMO_CHART = [
  { month: 'Aug', total: 1200 },
  { month: 'Sep', total: 980 },
  { month: 'Oct', total: 1450 },
  { month: 'Nov', total: 1100 },
  { month: 'Dec', total: 1350 },
  { month: 'Jan', total: 870 },
];

const DEMO_ALERTS = [
  { category: 'Food', spent: 420, limit: 500, percentage: 84 },
  { category: 'Entertainment', spent: 210, limit: 200, percentage: 105 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card" style={{ padding: '10px 16px', fontSize: '0.82rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${payload[0].value.toLocaleString()}</div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState(DEMO_CHART);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [expRes, trendRes, alertRes] = await Promise.allSettled([
          api.getExpenses(),
          api.getSpendingTrend(),
          api.getBudgetAlerts(),
        ]);

        if (expRes.status === 'fulfilled') {
          const list = expRes.value?.expenses || expRes.value || [];
          setExpenses(list.length ? list : DEMO_EXPENSES);
        } else {
          setExpenses(DEMO_EXPENSES);
        }

        if (trendRes.status === 'fulfilled' && Array.isArray(trendRes.value) && trendRes.value.length) {
          setChartData(trendRes.value);
        }

        if (alertRes.status === 'fulfilled' && Array.isArray(alertRes.value) && alertRes.value.length) {
          setAlerts(alertRes.value);
        }
      } catch {
        setExpenses(DEMO_EXPENSES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const budget = user?.monthlyBudget || 2000;
  const remaining = budget - totalSpent;
  const topCategory = expenses.length
    ? Object.entries(
        expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
    : '—';

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ marginBottom: 4 }}>
          Hey, <span className="gradient-text">{firstName}</span> 👋
        </h2>
        <p style={{ marginBottom: 32 }}>Here&apos;s your financial snapshot</p>
      </motion.div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Stats */}
          <motion.div className="stats-grid" variants={item} style={{ marginBottom: 32 }}>
            <StatCard icon={DollarSign} label="Total Spent" value={`$${totalSpent.toFixed(2)}`} color="pink" trend="up" trendValue="12%" />
            <StatCard icon={Wallet} label="Remaining Budget" value={`$${remaining.toFixed(2)}`} color="teal" trend={remaining > 0 ? 'up' : 'down'} trendValue={`${((remaining / budget) * 100).toFixed(0)}%`} />
            <StatCard icon={Tag} label="Top Category" value={topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} color="purple" />
            <StatCard icon={Hash} label="Transactions" value={expenses.length} color="blue" />
          </motion.div>

          {/* Chart + Recent */}
          <motion.div className="cards-grid" variants={item} style={{ marginBottom: 32 }}>
            <div className="glass-card chart-container">
              <h4>Spending Trend</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#6b6a7d', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b6a7d', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.08)' }} />
                  <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h4>Recent Expenses</h4>
                <Link to="/expenses" className="btn btn-ghost btn-sm">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {expenses.slice(0, 5).map((exp) => (
                  <div key={exp._id || exp.id} className="expense-item">
                    <div className="expense-item-info">
                      <div className="expense-item-desc">{exp.description}</div>
                      <div className="expense-item-date">
                        {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <span className={`category-badge ${exp.category}`}>{exp.category}</span>
                    <div className="expense-item-amount">-${exp.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <motion.div variants={item}>
              <h4 style={{ marginBottom: 14 }}>Budget Alerts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alerts.map((a, i) => (
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
