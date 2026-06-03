import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, Tag, BarChart3, CalendarDays } from 'lucide-react';
import * as api from '../utils/api';

// True red shades for pie chart
const COLORS = ['#ff0000', '#cc0000', '#ff3333', '#990000', '#ff6666', '#800000'];

const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(13,17,23,0.95)',
      border: '1px solid rgba(255,0,0,0.25)',
      borderRadius: '10px',
      padding: '10px 16px',
      fontSize: '0.82rem',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      {label && <div style={{ color: '#4d5566', marginBottom: 6, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#ff0000', fontWeight: 700 }}>
          {p.name}: ₹{Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Analytics() {
  const [categories, setCategories] = useState([]);
  const [trend, setTrend] = useState([]);
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
          // Backend returns { month, totalSpent, breakdown: [{category, total, count, percentage}] }
          const raw = monthlyRes.value;
          const breakdown = raw?.breakdown || raw?.categories || raw;
          if (Array.isArray(breakdown) && breakdown.length) {
            // Normalize: support {name/value} and {category/total} shapes
            const normalized = breakdown.map(b => ({
              name:  b.name  || b.category || b._id || 'Unknown',
              value: b.value ?? b.total ?? 0,
            }));
            setCategories(normalized);
          }
        }

        if (trendRes.status === 'fulfilled') {
          // Backend returns { trend: [{month, total, count}] }
          const raw = trendRes.value;
          const data = raw?.trend || raw;
          if (Array.isArray(data) && data.length) setTrend(data);
        }

        if (dailyRes.status === 'fulfilled') {
          // Backend returns { timeline: [{date, total}] }
          const raw = dailyRes.value;
          const data = raw?.timeline || raw;
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

  const totalSpent = categories.reduce((s, c) => s + (c.value || 0), 0);
  const topCategory = categories.length
    ? [...categories].sort((a, b) => b.value - a.value)[0]?.name
    : '—';

  // Only show last 1 month of trend data
  const oneMonthTrend = trend.slice(-1);

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff0000, #cc0000)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255,0,0,0.4)',
          }}>
            <BarChart3 size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ marginBottom: 0 }}>Analytics</h2>
            <p style={{ marginBottom: 0, fontSize: '0.88rem' }}>Visualise your spending patterns this month</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <span>Crunching numbers…</span>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Summary stats */}
          <motion.div variants={item} className="stats-grid" style={{ marginBottom: 28 }}>
            <div className="glass-card stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon purple">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="stat-card-label">Total This Month</div>
              <div className="stat-card-value">₹{totalSpent.toLocaleString()}</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon teal">
                  <Tag size={20} />
                </div>
              </div>
              <div className="stat-card-label">Categories</div>
              <div className="stat-card-value">{categories.length}</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon pink">
                  <BarChart3 size={20} />
                </div>
              </div>
              <div className="stat-card-label">Avg / Category</div>
              <div className="stat-card-value">₹{(totalSpent / (categories.length || 1)).toFixed(0)}</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon blue">
                  <CalendarDays size={20} />
                </div>
              </div>
              <div className="stat-card-label">Highest Category</div>
              <div className="stat-card-value" style={{ fontSize: '1.2rem' }}>{topCategory}</div>
            </div>
          </motion.div>

          {/* Pie + Bar charts */}
          <motion.div variants={item} className="cards-grid" style={{ marginBottom: 28 }}>
            <div className="glass-card chart-container">
              <h4 style={{ marginBottom: 4 }}>Category Breakdown</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>This month's spending by category</p>
              {categories.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
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
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: 8 }}>
                  <BarChart3 size={32} style={{ opacity: 0.3 }} />
                  <span>No data for this month</span>
                </div>
              )}
            </div>

            <div className="glass-card chart-container">
              <h4 style={{ marginBottom: 4 }}>Category Spending</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>Comparative bar view</p>
              {categories.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#4d5566', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                    <ReTooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(255, 0, 0, 0.06)' }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {categories.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No data available
                </div>
              )}
            </div>
          </motion.div>

          {/* 1-Month Trend line */}
          <motion.div variants={item} style={{ marginBottom: 28 }}>
            <div className="glass-card chart-container">
              <h4 style={{ marginBottom: 4 }}>Monthly Spending Trend</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>Your spending for the current month</p>
              {trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: '#4d5566', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#4d5566', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReTooltip content={<GlassTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#ff0000"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#ff0000', stroke: '#080b12', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#cc0000', stroke: '#ff0000', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: 8 }}>
                  <TrendingUp size={32} style={{ opacity: 0.3 }} />
                  <span>No trend data yet — add expenses to see trends</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Daily Analysis chart */}
          <motion.div variants={item}>
            <div className="glass-card chart-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h4 style={{ marginBottom: 4 }}>30-Day Daily Analysis</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Daily spending over the last 30 days</p>
                </div>
              </div>
              {daily.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#ff0000" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#ff0000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
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
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReTooltip content={<GlassTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#ff0000"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorDaily)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: 8 }}>
                  <CalendarDays size={32} style={{ opacity: 0.3 }} />
                  <span>No daily analytics data available</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
