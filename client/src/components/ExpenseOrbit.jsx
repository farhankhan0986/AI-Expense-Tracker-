import React from 'react';
import { motion } from 'framer-motion';

export default function ExpenseOrbit({ totalSpent, categories }) {
  // Sort categories by amount descending
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount).slice(0, 5);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0', position: 'relative' }}>
      <svg width="340" height="340" viewBox="0 0 340 340" style={{ transform: 'rotate(-90deg)' }}>
        {sortedCategories.map((cat, i) => {
           const currentRadius = 70 + (i * 22);
           const circumference = 2 * Math.PI * currentRadius;
           const percentStr = Math.max(0.05, cat.amount / (totalSpent || 1));
           const dashVal = percentStr * circumference;
           
           return (
             <g key={cat.name}>
               {/* Background Track */}
               <circle 
                 cx="170" 
                 cy="170" 
                 r={currentRadius} 
                 fill="none" 
                 stroke="var(--bg-glass-border)" 
                 strokeWidth="8" 
               />
               
               {/* Animated Progress Track */}
               <motion.circle
                 cx="170"
                 cy="170"
                 r={currentRadius}
                 fill="none"
                 stroke={cat.color || 'var(--accent-purple)'}
                 strokeWidth="8"
                 strokeDasharray={`${dashVal} ${circumference}`}
                 strokeLinecap="round"
                 initial={{ strokeDasharray: `0 ${circumference}` }}
                 animate={{ strokeDasharray: `${dashVal} ${circumference}` }}
                 transition={{ duration: 1.5, ease: "easeOut", delay: Math.max(0, 0.4 - i * 0.1) }}
                 style={{ filter: `drop-shadow(0 0 4px ${cat.color})` }}
               />
             </g>
           );
        })}
      </svg>
      
      {/* Central glowing readout */}
      <div 
        style={{ 
          position: 'absolute', 
          textAlign: 'center', 
          pointerEvents: 'none',
          background: 'var(--bg-primary)',
          borderRadius: '50%',
          width: '110px',
          height: '110px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.15), inset 0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Orbit</span>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
            ₹{totalSpent.toFixed(0)}
          </h2>
        </motion.div>
      </div>
    </div>
  );
}
