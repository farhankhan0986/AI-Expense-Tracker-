import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { month: 'Jan (Current)', actual: 1200, predicted: 1200 },
  { month: 'Feb', actual: null, predicted: 1250 },
  { month: 'Mar', actual: null, predicted: 1100 },
  { month: 'Apr', actual: null, predicted: 1400 },
  { month: 'May', actual: null, predicted: 1300 },
  { month: 'Jun', actual: null, predicted: 1150 },
];

const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card" style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>{label} Horizon</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--text-primary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <span>{p.dataKey === 'actual' ? 'Actual Data' : 'AI Prediction'}</span>
          <span>₹{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function FinancialHorizon() {
  return (
    <motion.div 
      className="glass-card" 
      style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
      whileHover={{ boxShadow: '0 0 20px rgba(45, 212, 191, 0.2)' }}
    >
      {/* 3D styling decorative elements */}
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '150px', height: '2px', background: 'var(--accent-teal)', filter: 'blur(2px)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '20%', width: '150px', height: '2px', background: 'var(--accent-purple)', filter: 'blur(2px)' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-teal)', letterSpacing: '1px' }}>Financial Horizon</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>6-Month AI Expense Projection</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Predicted Shortfall (Apr)</div>
          <div style={{ color: 'var(--warning)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>-₹200.00</div>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#6b6a7d', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b6a7d', fontSize: 12 }} axisLine={false} tickLine={false} />
            <ReTooltip content={<GlassTooltip />} />
            
            {/* The actual data */}
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="var(--accent-purple)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorActual)" 
            />
            {/* The predicted data */}
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="var(--accent-teal)" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorPredicted)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
