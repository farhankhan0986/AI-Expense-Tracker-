import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, BadgeInfo, Zap } from 'lucide-react';

const DEMO_NOTIFICATIONS = [];

export default function NotificationSystem() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const unread = notifications.length;

  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 1000 }}>
      <motion.button 
        className="glass-card"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        style={{ 
          width: '48px', height: '48px', borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', border: '1px solid var(--accent-white-dim)', zIndex: 1,
          position: 'relative'
        }}
      >
        <Bell size={20} color="var(--accent-blue)" />
        {unread > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ 
              position: 'absolute', top: '-4px', right: '-4px', 
              background: 'var(--accent-pink)', width: '20px', height: '20px', 
              borderRadius: '50%', fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px var(--accent-pink)'
            }}
          >
            {unread}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-card"
            style={{ 
              position: 'absolute', top: '64px', right: '0', 
              width: '320px', maxWidth: 'calc(100vw - 48px)',
              padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>System Alerts</h4>
              {unread > 0 && (
                <button 
                  onClick={() => setNotifications([])} 
                  className="btn btn-sm btn-ghost" 
                  style={{ fontSize: '0.75rem', padding: '0 8px' }}
                >
                  Clear All
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                All systems nominal. No new alerts.
              </div>
            ) : (
              notifications.map(n => {
                const Icon = n.icon;
                return (
                  <motion.div 
                    layout
                    key={n.id} 
                    style={{ 
                      display: 'flex', gap: '12px', padding: '12px', 
                      background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)',
                      borderLeft: `2px solid ${n.color}`
                    }}
                  >
                    <Icon size={18} color={n.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.text}</div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
