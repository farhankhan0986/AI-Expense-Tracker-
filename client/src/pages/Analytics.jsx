import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Tooltip as LineTooltip,
} from 'recharts';
import * as api from '../utils/api';

const COLORS = ['#a855f7', '#ec4899', '#2dd4bf', '#3b82f6', '#f97316', '#34d399', '#60a5fa', '#6b6a7d'];

const DEMO_CATEGORIES = [
  { name: 'Food', value: 420 },
  { name: 'Transport', value: 180 },
  { name: 'Entertainment', value: 210 },
  { name: 'Utilities', value: 310 },
  { name: 'Shopping', value: 150 },
  { name: 'Health', value: 90 },
];

const DEMO_TREND = [
  { month: 'Aug', total: 1200 },
  { month: 'Sep', total: 980 },
  { month: 'Oct', total: 1450 },
  { month: 'Nov', total: 1100 },
  { month: 'Dec', total: 1350 },
  { month: 'Jan', total: 870 },
];

const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card" style={{ padding: '10px 16px', fontSize: '0.82rem' }}>
      {label && <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--text-primary)', fontWeight: 600 }}>
          {p.name}: ${p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Analytics() {
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [trend, setTrend] = useState(DEMO_TREND);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [monthlyRes, trendRes] = await Promise.allSettled([
          api.getMonthlyAnalytics(),
          api.getSpendingTrend(),
        ]);

        if (monthlyRes.status === 'fulfilled') {
          const data = monthlyRes.value?.categories || monthlyRes.value;
          if (Array.isArray(data) && data.length) setCategories(data);
        }

        if (trendRes.status === 'fulfilled') {
          const data = trendRes.value?.trend || trendRes.value;
          if (Array.isArray(data) && data.length) setTrend(data);
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalSpent = categories.reduce((s, c) => s + c.value, 0);

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ marginBottom: 4 }}>Analytics</h2>
        <p style={{ marginBottom: 32 }}>Visualise your spending patterns</p>
      </motion.div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Summary stats */}
          <motion.div variants={item} className="stats-grid" style={{ marginBottom: 32 }}>
            <div className="glass-card stat-card">
              <div className="stat-card-label">Total This Month</div>
              <div className="stat-card-value">${totalSpent.toLocaleString()}</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-card-label">Categories</div>
              <div className="stat-card-value">{categories.length}</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-card-label">Avg / Category</div>
              <div className="stat-card-value">${(totalSpent / (categories.length || 1)).toFixed(0)}</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-card-label">Highest</div>
              <div className="stat-card-value">
                {categories.sort((a, b) => b.value - a.value)[0]?.name || '—'}
              </div>
            </div>
          </motion.div>

          {/* Pie + Bar charts */}
          <motion.div variants={item} className="cards-grid" style={{ marginBottom: 32 }}>
            <div className="glass-card chart-container">
              <h4>Category Breakdown</h4>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {categories.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip content={<GlassTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card chart-container">
              <h4>Category Spending</h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6b6a7d', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#a1a0b3', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                  <ReTooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.06)' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {categories.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Trend line */}
          <motion.div variants={item}>
            <div className="glass-card chart-container">
              <h4>6-Month Spending Trend</h4>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#6b6a7d', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b6a7d', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <LineTooltip content={<GlassTooltip />} />
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="url(#lineGrad)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#a855f7', stroke: '#0a0a1a', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#ec4899' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
