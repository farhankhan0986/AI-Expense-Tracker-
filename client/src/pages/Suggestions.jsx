import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendingDown,
  ShoppingCart,
  Utensils,
  Zap,
  Repeat,
  PiggyBank,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import * as api from '../utils/api';

const ICONS = [PiggyBank, TrendingDown, ShoppingCart, Utensils, Zap, Repeat, ArrowDownRight, Lightbulb];

const TYPE_CONFIG = {
  high_spending:          { label: 'High Spend',   color: '#ff0000', bg: 'rgba(255,0,0,0.1)',   Icon: TrendingUp },
  spending_increase:      { label: 'Spending Up',  color: '#f5a623', bg: 'rgba(245,166,35,0.1)', Icon: TrendingUp },
  frequent_small_purchases:{ label: 'Frequent',    color: '#ff0000', bg: 'rgba(255,0,0,0.1)',   Icon: Repeat },
  entertainment_review:   { label: 'Review',       color: '#ff0000', bg: 'rgba(255,0,0,0.1)',   Icon: Zap },
  food_tip:               { label: 'Food Tip',     color: '#00c875', bg: 'rgba(0,200,117,0.1)', Icon: Utensils },
  general:                { label: 'Tip',          color: '#00c875', bg: 'rgba(0,200,117,0.1)', Icon: CheckCircle2 },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSavingSuggestions();
        const list = data?.suggestions || data;
        if (Array.isArray(list) && list.length) setSuggestions(list);
        else setSuggestions([]);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ marginBottom: 0 }}>AI Suggestions</h2>
            <p style={{ marginBottom: 0, fontSize: '0.88rem' }}>AI-driven savings recommendations based on your spending</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <span>Generating insights…</span>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {suggestions.length === 0 && (
            <motion.div variants={item}>
              <div className="glass-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ marginBottom: 16, opacity: 0.3 }}>
                  <PiggyBank size={48} />
                </div>
                <h4 style={{ marginBottom: 8 }}>No suggestions yet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Add more expenses and we'll generate personalised saving insights for you.
                </p>
              </div>
            </motion.div>
          )}

          {suggestions.map((sug, i) => {
            const cfg = TYPE_CONFIG[sug.type] || TYPE_CONFIG.general;
            const Icon = cfg.Icon || ICONS[i % ICONS.length];

            // The API returns { type, message, category?, amount?, ... }
            const title = sug.title || sug.category || cfg.label;
            const description = sug.description || sug.message || 'No details available.';

            return (
              <motion.div
                key={i}
                className="glass-card glass-card-interactive"
                variants={item}
                style={{ padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '10px',
                  background: cfg.bg,
                  color: cfg.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 16px ${cfg.bg}`,
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{title}</h4>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      background: cfg.bg,
                      color: cfg.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{description}</p>
                  {sug.amount && (
                    <div style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Amount: <span style={{ color: cfg.color, fontWeight: 700 }}>₹{Number(sug.amount).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
