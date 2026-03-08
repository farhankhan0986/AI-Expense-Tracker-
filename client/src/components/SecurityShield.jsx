import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Fingerprint } from 'lucide-react';

export default function SecurityShield({ status = 'secure' }) {
  const isSecure = status === 'secure';
  const color = isSecure ? 'var(--accent-teal)' : 'var(--accent-orange)';
  
  return (
    <div style={{ padding: '16px', borderTop: '1px solid var(--bg-glass-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <motion.div 
          animate={isSecure ? { 
            boxShadow: [`0 0 5px ${color}`, `0 0 15px ${color}`, `0 0 5px ${color}`] 
          } : {
            boxShadow: [`0 0 10px ${color}`, `0 0 25px ${color}`, `0 0 10px ${color}`],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ 
            width: '36px', height: '36px', borderRadius: '50%', 
            background: 'rgba(0,0,0,0.4)', border: `1px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color
          }}
        >
          {isSecure ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
        </motion.div>
        
        <div>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', letterSpacing: '0.5px', textTransform: 'uppercase', color: color }}>
            {isSecure ? 'System Secure' : 'Action Req'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Fingerprint size={10} /> 2FA Enabled
          </div>
        </div>
      </div>
    </div>
  );
}
