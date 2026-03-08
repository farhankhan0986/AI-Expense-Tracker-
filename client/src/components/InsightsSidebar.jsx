import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, ShieldAlert } from 'lucide-react';

export default function InsightsSidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '1px', marginBottom: '8px' }}>AI Insights</h3>
      
      {/* Insight Card 1 */}
      <motion.div className="glass-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-orange)' }} whileHover={{ scale: 1.02 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-orange)' }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Unusual Spending</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Food expenses are 40% higher than your weekly average. Consider utilizing the budget builder to re-allocate funds.
        </p>
      </motion.div>

      {/* Insight Card 2 */}
      <motion.div className="glass-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-teal)' }} whileHover={{ scale: 1.02 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-teal)' }}>
          <TrendingDown size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Good Trajectory</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Transport costs have decreased by 12% this month. You're on track to save $45 in this category.
        </p>
      </motion.div>

      {/* Insight Card 3 */}
      <motion.div className="glass-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-pink)' }} whileHover={{ scale: 1.02 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-pink)' }}>
          <ShieldAlert size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Subscription Alert</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Netflix Subscription ($15.99) is due in 3 days. Ensure adequate balance.
        </p>
      </motion.div>
      
      <motion.div 
        className="glass-card" 
        style={{ padding: '16px', marginTop: '16px', background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%)' }}
      >
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
          Insights are generated in real-time based on your transaction LED timeline.
        </p>
      </motion.div>
    </div>
  );
}
