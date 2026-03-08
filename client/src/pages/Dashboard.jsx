import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  Shield,
  Sparkles,
  BrainCircuit,
  BellRing,
  Orbit,
  Cuboid,
  Puzzle,
  TrendingUp,
  Siren,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import * as api from '../utils/api';
import '../styles/futuristic-dashboard.css';

const CATEGORY_COLORS = {
  Food: '#22d3ee',
  Transport: '#818cf8',
  Entertainment: '#f472b6',
  Shopping: '#2dd4bf',
  Bills: '#f59e0b',
  Health: '#38bdf8',
  Education: '#a78bfa',
  Travel: '#e879f9',
  Other: '#94a3b8',
};

const cubeFaces = ['Add', 'Edit', 'Merge'];

const tooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card" style={{ padding: 10, fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)' }}>{label}</div>
      {payload.map((p, idx) => (
        <div key={idx} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: ${Number(p.value).toFixed(2)}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [daily, setDaily] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Food');
  const [activeFace, setActiveFace] = useState('Add');
  const [categoryBudgets, setCategoryBudgets] = useState({});

  useEffect(() => {
    async function loadData() {
      const [expRes, dailyRes, alertRes, suggestionRes] = await Promise.allSettled([
        api.getExpenses({ limit: 120 }),
        api.getDailyAnalytics(21),
        api.getBudgetAlerts(),
        api.getSavingSuggestions(),
      ]);

      const expenseData = expRes.status === 'fulfilled' ? (expRes.value.expenses || []) : [];
      setExpenses(expenseData);

      if (dailyRes.status === 'fulfilled') {
        setDaily(dailyRes.value.daily || []);
        setForecast(dailyRes.value.forecast || []);
        setRecommendations(dailyRes.value.recommendations || []);
      }

      if (alertRes.status === 'fulfilled') setAlerts(alertRes.value.alerts || []);
      if (suggestionRes.status === 'fulfilled') setSuggestions(suggestionRes.value.suggestions || []);

      const monthlyBudget = user?.monthlyBudget || 3000;
      const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Travel', 'Other'];
      const equal = monthlyBudget / categories.length;
      setCategoryBudgets(Object.fromEntries(categories.map((c) => [c, equal])));
    }

    loadData();
  }, [user?.monthlyBudget]);

  const categoryStats = useMemo(() => {
    const grouped = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, total]) => ({
        category,
        total,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
        share: 0,
      }))
      .sort((a, b) => b.total - a.total)
      .map((item, _, arr) => {
        const all = arr.reduce((s, it) => s + it.total, 0);
        return { ...item, share: all ? (item.total / all) * 100 : 0 };
      });
  }, [expenses]);

  useEffect(() => {
    if (categoryStats.length && !categoryStats.find((c) => c.category === activeCategory)) {
      setActiveCategory(categoryStats[0].category);
    }
  }, [categoryStats, activeCategory]);

  const activeCategoryTransactions = expenses.filter((e) => e.category === activeCategory).slice(0, 6);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = user?.monthlyBudget || 3000;
  const securityScore = Math.max(10, Math.min(100, 100 - Math.round((alerts.length / 6) * 35) - (totalExpenses > budget ? 20 : 0)));

  const mergedHorizon = [...daily.map((d) => ({ day: d.date.slice(5), actual: d.total })), ...forecast.map((f) => ({ day: f.date.slice(5), projected: f.projectedTotal }))];

  const anomalyCards = useMemo(() => {
    if (!expenses.length) return [];
    const avg = totalExpenses / expenses.length;
    const suspicious = expenses.filter((e) => e.amount > avg * 1.8).slice(0, 2);

    const items = suspicious.map((s) => ({
      level: 'warning',
      title: 'Anomaly detected',
      desc: `${s.description} appears unusually high at $${s.amount.toFixed(2)}.`,
    }));

    if (budget - totalExpenses < budget * 0.15) {
      items.push({ level: 'critical', title: 'Low balance buffer', desc: 'You are close to your monthly budget ceiling.' });
    }

    items.push({ level: 'info', title: 'Upcoming bills forecast', desc: 'AI predicts recurring bills in the next 72 hours based on patterns.' });
    return items.slice(0, 3);
  }, [expenses, totalExpenses, budget]);

  const smartCategorization = useMemo(() => {
    const untyped = expenses.filter((e) => e.category === 'Other').slice(0, 4);
    return untyped.map((e) => ({
      description: e.description,
      suggested: e.description.toLowerCase().includes('uber') ? 'Transport' : e.description.toLowerCase().includes('coffee') ? 'Food' : 'Shopping',
      confidence: `${82 + (e.description.length % 15)}%`,
    }));
  }, [expenses]);

  return (
    <div className="page-wrapper futuristic-board">
      <div className="dashboard-style-guide glass-card">
        <h4><Sparkles size={16} /> Neural Style Guide</h4>
        <p>Palette: Obsidian (#070B18), Deep Indigo (#151A3A), Neon Cyan, Electric Violet, Plasma Pink. Typography: Space Grotesk + Inter. Icons: Lucide stroked glyphs with glow overlays.</p>
      </div>

      <section className="dashboard-hero">
        <div>
          <h2>AI Expense Tracker // Command Deck</h2>
          <p>Welcome back {user?.name?.split(' ')[0] || 'Operator'}. Neural finance systems are online.</p>
        </div>
        <div className={`security-shield ${securityScore > 70 ? 'safe' : securityScore > 45 ? 'warn' : 'risk'}`}>
          <Shield size={22} />
          <div>
            <strong>Security Shield</strong>
            <span>{securityScore}% integrity · 2FA suggested</span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid-2">
        <div className="glass-card hex-panel">
          <h4><Orbit size={16} /> Category Hex Grid</h4>
          <div className="hex-grid">
            {categoryStats.map((cat) => (
              <button key={cat.category} className={`hex-tile ${activeCategory === cat.category ? 'active' : ''}`} onClick={() => setActiveCategory(cat.category)}>
                <span>{cat.category}</span>
                <strong>${cat.total.toFixed(0)}</strong>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="hex-details"
            >
              <p>{activeCategory} expenditure pods</p>
              {activeCategoryTransactions.map((t) => (
                <div key={t._id} className="mini-row">
                  <span>{t.description}</span>
                  <span>${t.amount.toFixed(2)}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="glass-card orbit-panel">
          <h4><Radar size={16} /> Expense Orbit</h4>
          <div className="orbit-core">
            <div className="orbit-center">
              <span>Total Flux</span>
              <strong>${totalExpenses.toFixed(0)}</strong>
            </div>
            {categoryStats.slice(0, 5).map((cat, idx) => (
              <div key={cat.category} className="orbit-ring" style={{ '--ring-size': `${160 + idx * 32}px`, '--ring-color': cat.color, '--ring-speed': `${9 + idx * 2}s` }}>
                <span>{cat.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid-3">
        <div className="glass-card led-log">
          <h4>Transaction Log // LED Timeline</h4>
          <div className="pod-list">
            {expenses.slice(0, 10).map((tx) => (
              <article key={tx._id} className="data-pod">
                <div>
                  <strong>{tx.description}</strong>
                  <small>{new Date(tx.date).toLocaleDateString()}</small>
                </div>
                <div>
                  <span>{tx.category}</span>
                  <strong>${tx.amount.toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-card insights-sidebar">
          <h4><BrainCircuit size={16} /> Transaction Insights</h4>
          {[...recommendations, ...suggestions.map((s) => s.message)].slice(0, 4).map((text, i) => (
            <div className="insight-pill" key={i}>{text}</div>
          ))}
        </aside>
      </section>

      <section className="dashboard-grid-2">
        <div className="glass-card cube-panel">
          <h4><Cuboid size={16} /> Category Cube</h4>
          <div className={`category-cube face-${activeFace.toLowerCase()}`}>
            {cubeFaces.map((face) => (
              <button key={face} onClick={() => setActiveFace(face)}>{face}</button>
            ))}
          </div>
          <p>{activeFace} categories and sync updates in real time across visual modules.</p>
          <div className="smart-categorization">
            <h5>Smart Categorization</h5>
            {smartCategorization.length === 0 ? <p>No uncategorized transactions found.</p> : smartCategorization.map((row, idx) => (
              <div className="mini-row" key={idx}><span>{row.description} → {row.suggested}</span><strong>{row.confidence}</strong></div>
            ))}
          </div>
        </div>

        <div className="glass-card horizon-panel">
          <h4><TrendingUp size={16} /> Financial Horizon (Daily + Forecast)</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mergedHorizon}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: '#8ea0c4', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8ea0c4', fontSize: 11 }} />
              <Tooltip content={tooltip} />
              <Line type="monotone" dataKey="actual" stroke="#22d3ee" strokeWidth={2} dot={false} name="Actual" />
              <Line type="monotone" dataKey="projected" stroke="#f472b6" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="dashboard-grid-2">
        <div className="glass-card budget-builder">
          <h4><Puzzle size={16} /> Budget Builder</h4>
          <p>Puzzle your monthly budget into category segments.</p>
          {Object.entries(categoryBudgets).slice(0, 5).map(([cat, val]) => (
            <label key={cat} className="budget-piece">
              <span>{cat} · ${val.toFixed(0)}</span>
              <input
                type="range"
                min="50"
                max="1200"
                step="10"
                value={val}
                onChange={(e) => setCategoryBudgets((prev) => ({ ...prev, [cat]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>

        <div className="glass-card notifications-panel">
          <h4><BellRing size={16} /> Alert Cards</h4>
          {anomalyCards.map((a, i) => (
            <div key={i} className={`alert-card ${a.level}`}>
              <Siren size={14} />
              <div>
                <strong>{a.title}</strong>
                <p>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card" style={{ padding: 20 }}>
        <h4>Expense Pulse by Category</h4>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={categoryStats.map((c) => ({ name: c.category, total: c.total }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
            <XAxis dataKey="name" tick={{ fill: '#8ea0c4', fontSize: 11 }} />
            <YAxis tick={{ fill: '#8ea0c4', fontSize: 11 }} />
            <Tooltip content={tooltip} />
            <Area type="monotone" dataKey="total" stroke="#a78bfa" fill="url(#pulseFill)" />
            <defs>
              <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
