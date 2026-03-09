import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function DataPod({ expense, onDelete }) {
  const getCategoryColor = (cat) => {
    switch(cat?.toLowerCase()) {
      case 'food': return 'var(--accent-pink)';
      case 'transport': return 'var(--accent-blue)';
      case 'entertainment': return 'var(--accent-purple)';
      case 'shopping': return 'var(--accent-orange)';
      case 'bills': return 'var(--accent-teal)';
      case 'health': return '#34d399';
      case 'education': return '#facc15';
      default: return 'var(--accent-purple)';
    }
  };

  const color = getCategoryColor(expense.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
      className="glass-card"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        marginBottom: '12px',
        border: `1px solid ${color}40`,
        boxShadow: `inset 0 0 15px ${color}10, 0 4px 12px rgba(0,0,0,0.2)`,
        overflow: 'hidden',
        fontFamily: 'var(--font-display)'
      }}
    >
      {/* LED Strip */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: color, boxShadow: `0 0 10px ${color}` }} />
      
      {/* Date Pod */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px', borderRight: '1px solid var(--bg-glass-border)', paddingRight: '16px', marginRight: '16px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {new Date(expense.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {new Date(expense.date).toLocaleDateString('en-US', { day: '2-digit' })}
        </span>
      </div>

      {/* Description */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.5px' }}>{expense.description}</span>
        <span style={{ fontSize: '0.75rem', color: color, textTransform: 'uppercase', letterSpacing: '1px' }}>{expense.category}</span>
      </div>

      {/* Amount and Delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', textShadow: `0 0 10px ${color}80` }}>
          ₹{expense.amount.toFixed(2)}
        </span>
        
        <button
          onClick={() => onDelete(expense._id || expense.id)}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s', padding: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          title="Delete Data Pod"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
