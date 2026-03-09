import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, ShieldAlert } from 'lucide-react';

export default function InsightsSidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '1px', marginBottom: '8px' }}>AI Insights</h3>

      {/* Insight Card 1 */}
<motion.div
  className="glass-card"
  style={{ padding: '16px', borderLeft: '3px solid var(--accent-orange)' }}
  whileHover={{ scale: 1.02 }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-orange)' }}>
    <AlertCircle size={18} />
    <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
      Spending Insight
    </span>
  </div>
  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
    Some categories may show higher activity this week. Reviewing your recent transactions can help keep spending aligned with your goals.
  </p>
</motion.div>

{/* Insight Card 2 */}
<motion.div
  className="glass-card"
  style={{ padding: '16px', borderLeft: '3px solid var(--accent-teal)' }}
  whileHover={{ scale: 1.02 }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-teal)' }}>
    <TrendingDown size={18} />
    <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
      Positive Trend
    </span>
  </div>
  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
    Monitoring recurring expenses and daily purchases can reveal opportunities to save over time.
  </p>
</motion.div>

{/* Insight Card 3 */}
<motion.div
  className="glass-card"
  style={{ padding: '16px', borderLeft: '3px solid var(--accent-pink)' }}
  whileHover={{ scale: 1.02 }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-pink)' }}>
    <ShieldAlert size={18} />
    <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
      Smart Reminder
    </span>
  </div>
  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
    Keeping track of subscriptions and regular payments can help avoid unexpected charges.
  </p>
</motion.div>

<motion.div
  className="glass-card"
  style={{
    padding: '16px',
    marginTop: '16px',
    background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
  }}
>
  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
    Insights are generated based on your recent activity and spending patterns.
  </p>
</motion.div>
    </div>
  );
}
