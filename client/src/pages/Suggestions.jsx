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
} from 'lucide-react';
import * as api from '../utils/api';

const ICONS = [PiggyBank, TrendingDown, ShoppingCart, Utensils, Zap, Repeat, ArrowDownRight, Lightbulb];

const DEMO_SUGGESTIONS = [
  {
    title: 'Cut Food Delivery Spending',
    description: 'You spent $180 on food delivery last month — 40% more than average. Cooking 3 more meals per week could save ~$120/month.',
    type: 'saving',
  },
  {
    title: 'Subscription Audit',
    description: 'You have 5 active subscriptions totalling $67/month. Consider cancelling services you haven\'t used in 30+ days.',
    type: 'insight',
  },
  {
    title: 'Transport Optimisation',
    description: 'Switching 2 weekly Uber rides to public transit could save $60/month based on your spending patterns.',
    type: 'saving',
  },
  {
    title: 'Shopping Trend Alert',
    description: 'Shopping expenses increased 25% compared to last month. Set a weekly spending cap to stay on track.',
    type: 'insight',
  },
  {
    title: 'Utilities Saving',
    description: 'Your electricity bill is $30 above the seasonal average. Switching to LED bulbs and off-peak usage could reduce costs.',
    type: 'saving',
  },
  {
    title: 'Emergency Fund Progress',
    description: 'Based on your remaining budget, you could save $350 this month. That\'s $4,200/year towards your emergency fund.',
    type: 'insight',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState(DEMO_SUGGESTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSavingSuggestions();
        const list = data?.suggestions || data;
        if (Array.isArray(list) && list.length) setSuggestions(list);
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ marginBottom: 4 }}>
          <Lightbulb size={28} style={{ display: 'inline', marginRight: 8, color: 'var(--accent-orange)' }} />
          Smart Suggestions
        </h2>
        <p style={{ marginBottom: 32 }}>AI-powered insights to help you save more</p>
      </motion.div>

      {loading ? (
        <div className="loading-container"><div className="loading-spinner" /></div>
      ) : (
        <motion.div
          className="suggestions-list"
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {suggestions.map((sug, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isSaving = sug.type === 'saving';

            return (
              <motion.div
                key={i}
                className="glass-card glass-card-interactive"
                variants={item}
                style={{ padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-sm)',
                    background: isSaving ? 'var(--accent-teal-dim)' : 'var(--accent-purple-dim)',
                    color: isSaving ? 'var(--accent-teal)' : 'var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h4 style={{ fontSize: '1rem' }}>{sug.title}</h4>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: isSaving ? 'var(--accent-teal-dim)' : 'var(--accent-purple-dim)',
                        color: isSaving ? 'var(--accent-teal)' : 'var(--accent-purple)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {sug.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{sug.description}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Spending insights summary */}
          <motion.div
            variants={item}
            className="glass-card"
            style={{
              padding: '32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(45, 212, 191, 0.08))',
              border: '1px solid rgba(168, 85, 247, 0.15)',
            }}
          >
            <PiggyBank size={36} style={{ color: 'var(--accent-teal)', marginBottom: 12 }} />
            <h3 style={{ marginBottom: 8 }}>Potential Monthly Savings</h3>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: 8,
              }}
              className="gradient-text-secondary"
            >
              $240
            </div>
            <p style={{ fontSize: '0.85rem' }}>
              Based on the suggestions above, you could save up to $240 each month
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
