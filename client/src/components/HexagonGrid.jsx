import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Utensils, Zap, Film, Car, TrendingUp } from 'lucide-react';

const icons = {
  Food: <Utensils size={24} />,
  Transport: <Car size={24} />,
  Entertainment: <Film size={24} />,
  Bills: <Zap size={24} />,
  Shopping: <ShoppingCart size={24} />,
  default: <TrendingUp size={24} />
};

export default function HexagonGrid({ categories }) {
  const [activeCat, setActiveCat] = useState(null);

  return (
    <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="hexagon-grid">
        {categories.map((cat, i) => (
          <div key={cat.name} style={{ position: 'relative' }}>
            <motion.div 
              className={`hexagon ${activeCat === cat.name ? 'active' : ''}`}
              style={{ '--hex-color': cat.color }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveCat(activeCat === cat.name ? null : cat.name)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
            >
              <div className="hex-inner">
                <div style={{ color: cat.color, marginBottom: '8px', filter: `drop-shadow(0 0 6px ${cat.color}80)` }}>
                  {icons[cat.name] || icons.default}
                </div>
                <span className="hex-name" style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>{cat.name}</span>
                <span className="hex-amount" style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '4px' }}>${cat.amount.toFixed(0)}</span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeCat && (
          <motion.div 
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="glass-card"
            style={{ width: '100%', maxWidth: '600px', marginTop: '2rem', padding: '1.5rem', borderLeft: `4px solid ${categories.find(c => c.name === activeCat)?.color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: categories.find(c => c.name === activeCat)?.color }}>
                  {icons[activeCat] || icons.default}
                </span>
                {activeCat} Details
              </h3>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                ${categories.find(c => c.name === activeCat)?.amount.toFixed(2)}
              </span>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trend</div>
                <div style={{ color: 'var(--accent-teal)' }}>+14% vs Last Month</div>
              </div>
              <div className="glass-card" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Forecast</div>
                <div style={{ color: 'var(--accent-orange)' }}>Expected: ${((categories.find(c => c.name === activeCat)?.amount || 0) * 1.2).toFixed(0)}</div>
              </div>
            </div>
            
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              AI Insight: You are spending slightly more on {activeCat} this month. Consider setting a micro-budget to limit further expansion.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
