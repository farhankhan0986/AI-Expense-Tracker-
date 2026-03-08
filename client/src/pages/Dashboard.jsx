import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, Tag, Hash, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../utils/api';
import StatCard from '../components/StatCard';
import BudgetAlert from '../components/BudgetAlert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [expRes, trendRes, alertRes, dailyRes] = await Promise.allSettled([
          api.getExpenses(),
          api.getSpendingTrend(),
          api.getBudgetAlerts(),
          api.getDailyAnalytics(),
        ]);

        if (expRes.status === 'fulfilled') {
          const list = expRes.value?.expenses || expRes.value || [];
          setExpenses(list);
        } else {
          setExpenses([]);
        }

        if (trendRes.status === 'fulfilled' && Array.isArray(trendRes.value) && trendRes.value.length) {
          setChartData(trendRes.value);
        }

        if (alertRes.status === 'fulfilled' && Array.isArray(alertRes.value) && alertRes.value.length) {
          setAlerts(alertRes.value);
        }

        if (dailyRes.status === 'fulfilled') {
          const data = dailyRes.value?.timeline || dailyRes.value;
          if (Array.isArray(data) && data.length) setDailyData(data);
        }
      } catch {
        setExpenses([]);
        setDailyData([]);
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

  const categoriesData = expenses.length
    ? Object.entries(
        expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {})
      ).map(([name, amount]) => {
        const colors = {
          Food: 'var(--accent-pink)',
          Transport: 'var(--accent-blue)',
          Entertainment: 'var(--accent-purple)',
          Bills: 'var(--accent-teal)',
          Shopping: 'var(--accent-orange)'
        };
        return { 
          name, 
          amount, 
          percent: totalSpent ? (amount / totalSpent) : 0, 
          color: colors[name] || 'var(--accent-purple)' 
        };
      })
    : [];

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

          {/* Flat Table and Chart */}
          <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: 32 }} variants={item}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0px' }}>Spending Trend</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Last 6 months</p>
              
              {chartData.length > 0 ? (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-glass-border)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-glass-hover)' }} />
                      <Bar dataKey="total" fill="var(--text-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No trend data available.
                </div>
              )}
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0px' }}>Category Breakdown</h4>
                <Link to="/expenses" className="btn btn-ghost btn-sm">
                  View Data <ArrowRight size={14} />
                </Link>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Distribution of expenses</p>
              
              {categoriesData.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categoriesData.map((cat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < categoriesData.length - 1 ? '1px solid var(--bg-glass-border)' : 'none', paddingBottom: i < categoriesData.length - 1 ? '12px' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color }}></div>
                        <span style={{ fontWeight: 500 }}>{cat.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>${cat.amount.toFixed(2)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Math.round(cat.percent * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No categorical data available.
                </div>
              )}
            </div>
          </motion.div>

          {/* Daily Analysis Flow */}
          <motion.div variants={item} style={{ marginBottom: 32 }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0px' }}>30-Day Daily Analysis</h4>
                <Link to="/analytics" className="btn btn-ghost btn-sm">
                  Full Analytics <ArrowRight size={14} />
                </Link>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Your spending over the last 30 days</p>

              {dailyData.length > 0 ? (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-glass-border)" vertical={false} />
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
                      <Tooltip content={<CustomTooltip />} />
                      <defs>
                        <linearGradient id="colorDailyDash" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="var(--accent-teal)" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorDailyDash)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  No daily data available.
                </div>
              )}
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
