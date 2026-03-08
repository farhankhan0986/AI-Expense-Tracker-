import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Tooltip as LineTooltip,
  AreaChart, Area
} from 'recharts';
import * as api from '../utils/api';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#000000'];

const DEMO_CATEGORIES = [];
const DEMO_TREND = [];

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
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [monthlyRes, trendRes, dailyRes] = await Promise.allSettled([
          api.getMonthlyAnalytics(),
          api.getSpendingTrend(),
          api.getDailyAnalytics(),
        ]);

        if (monthlyRes.status === 'fulfilled') {
          const data = monthlyRes.value?.categories || monthlyRes.value;
          if (Array.isArray(data) && data.length) setCategories(data);
        }

        if (trendRes.status === 'fulfilled') {
          const data = trendRes.value?.trend || trendRes.value;
          if (Array.isArray(data) && data.length) setTrend(data);
        }
        
        if (dailyRes.status === 'fulfilled') {
          const data = dailyRes.value?.timeline || dailyRes.value;
          if (Array.isArray(data) && data.length) setDaily(data);
        }
      } catch {
        setCategories([]);
        setTrend([]);
        setDaily([]);
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
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb', stroke: 'none' }}
                    activeDot={{ r: 6, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Daily Analysis chart */}
          <motion.div variants={item} style={{ marginTop: 32 }}>
            <div className="glass-card chart-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4>30-Day Daily Analysis</h4>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                {daily.length > 0 ? (
                  <AreaChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'var(--text-muted)', fontSize: 10 }} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(val) => {
                        const [, m, d] = val.split('-');
                        return `${m}/${d}`;
                      }}
                    />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <LineTooltip content={<GlassTooltip />} />
                    <defs>
                      <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="var(--accent-teal)" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorDaily)" 
                    />
                  </AreaChart>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No daily analytics data available.
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
