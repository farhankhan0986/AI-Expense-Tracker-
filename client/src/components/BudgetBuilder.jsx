import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  Food: 'var(--accent-pink)',
  Transport: 'var(--accent-blue)',
  Entertainment: 'var(--accent-purple)',
  Bills: 'var(--accent-teal)',
  Shopping: 'var(--accent-orange)'
};

export default function BudgetBuilder({ budgets, totalIncome = 3000 }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Convert budgets object into an array and sum total limit
  const entries = Object.entries(budgets)
    .filter(([_, data]) => data.limit > 0)
    .map(([cat, data]) => ({
      name: cat,
      ...data,
      color: CATEGORY_COLORS[cat] || 'var(--accent-purple)'
    }));

  const totalAllocated = entries.reduce((s, e) => s + e.limit, 0);
  const remaining = Math.max(0, totalIncome - totalAllocated);

  const getWidth = (amount) => {
    return Math.max(0, (amount / totalIncome) * 100);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px', letterSpacing: '1px' }}>Resource Allocation Nexus</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Total Income Stream: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${totalIncome}</span></span>
        <span style={{ color: 'var(--accent-teal)' }}>Unallocated: ${remaining}</span>
      </div>

      {/* Segmented Bar (Puzzle Pieces) */}
      <div 
        style={{ 
          display: 'flex', 
          height: '40px', 
          width: '100%', 
          background: 'rgba(0,0,0,0.5)', 
          borderRadius: 'var(--radius-sm)', 
          overflow: 'hidden',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
          marginBottom: '24px',
          border: '1px solid var(--bg-glass-border)'
        }}
      >
        {entries.map((item, i) => (
          <motion.div
            key={item.name}
            onMouseEnter={() => setHoveredNode(item.name)}
            onMouseLeave={() => setHoveredNode(null)}
            whileHover={{ filter: 'brightness(1.3)' }}
            style={{
              width: `${getWidth(item.limit)}%`,
              background: item.color,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRight: i < entries.length - 1 ? '2px solid rgba(0,0,0,0.4)' : 'none',
              boxShadow: hoveredNode === item.name ? `0 0 15px ${item.color}` : 'none',
              position: 'relative',
              zIndex: hoveredNode === item.name ? 10 : 1
            }}
          >
            {getWidth(item.limit) > 8 && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {item.name.substring(0, 3)}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Detail readout */}
      <div style={{ minHeight: '80px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--bg-glass-border)' }}>
        {hoveredNode ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: entries.find(e => e.name === hoveredNode)?.color }} />
                <h4 style={{ margin: 0 }}>{hoveredNode} Module</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Allocated limits</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                ${entries.find(e => e.name === hoveredNode)?.limit}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                {entries.find(e => e.name === hoveredNode)?.spent} utilized
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
            Hover over a nexus segment to view detailed allocation metrics.
          </div>
        )}
      </div>
    </div>
  );
}
