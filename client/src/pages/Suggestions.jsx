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
  DatabaseZap
} from 'lucide-react';
import * as api from '../utils/api';

const ICONS = [PiggyBank, TrendingDown, ShoppingCart, Utensils, Zap, Repeat, ArrowDownRight, Lightbulb];

const DEMO_SUGGESTIONS = [];

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
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DatabaseZap size={28} className="gradient-text" />
          Neural Category Nexus
        </h2>
        <p style={{ marginBottom: 32 }}>Manage dimensions and receive AI-driven structural recommendations</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ marginTop: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', letterSpacing: '0px' }}>Global Savings Intelligence</h3>
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
          {suggestions.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              No intelligence suggestions available at this time.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
