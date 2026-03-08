import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Layers, Sparkles, RefreshCcw, Database } from 'lucide-react';

export default function CategoryCube() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const rotateTo = (x, y) => {
    setRotation({ x, y });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Cube Navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
        <button className="btn btn-sm btn-ghost" onClick={() => rotateTo(0, 0)}><Database size={14}/> Core</button>
        <button className="btn btn-sm btn-ghost" onClick={() => rotateTo(0, -90)}><Plus size={14}/> Add New</button>
        <button className="btn btn-sm btn-ghost" onClick={() => rotateTo(0, 90)}><Layers size={14}/> Merge</button>
        <button className="btn btn-sm btn-ghost" onClick={() => rotateTo(-90, 0)}><Sparkles size={14}/> Smart AI</button>
        <button className="btn btn-sm btn-ghost" onClick={() => rotateTo(0, -180)}><Settings size={14}/> Settings</button>
      </div>

      <div className="cube-scene">
        <div 
          className="cube" 
          style={{ transform: `translateZ(-150px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          {/* FRONT: Core Categories */}
          <div className="cube-face cube-face-front" style={{ borderColor: 'var(--accent-teal)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)' }}><Database size={18} /> Active Nodes</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Manage primary databanks</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {['Food', 'Transport', 'Entertainment', 'Bills'].map(c => (
                <div key={c} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{c}</span>
                  <span style={{ color: 'var(--accent-teal)' }}>Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Add Category */}
          <div className="cube-face cube-face-right" style={{ borderColor: 'var(--accent-pink)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-pink)' }}><Plus size={18} /> Append Node</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Initialize a new category vector</p>
            <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Designation..." className="form-input" style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'var(--accent-pink)' }} />
              <button className="btn btn-primary" style={{ background: 'var(--accent-pink)' }}>Initialize</button>
            </div>
          </div>

          {/* BACK: Settings */}
          <div className="cube-face cube-face-back" style={{ borderColor: 'var(--accent-orange)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)' }}><Settings size={18} /> Node Config</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Adjust systematic constraints</p>
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem' }}>Auto-categorization</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem' }}>Anomaly Alerts</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>

          {/* LEFT: Merge */}
          <div className="cube-face cube-face-left" style={{ borderColor: 'var(--accent-blue)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)' }}><Layers size={18} /> Nexus Merge</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Combine overlapping databanks</p>
            <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <select className="form-select" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <option>Dining Out</option>
              </select>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><RefreshCcw size={14} /></div>
              <select className="form-select" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <option>Food</option>
              </select>
              <button className="btn btn-primary" style={{ background: 'var(--accent-blue)', marginTop: '8px' }}>Execute Merge</button>
            </div>
          </div>

          {/* TOP: Smart Categorization */}
          <div className="cube-face cube-face-top" style={{ borderColor: 'var(--accent-purple)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)' }}><Sparkles size={18} /> Smart AI</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Machine learning suggestions</p>
            
            <div style={{ marginTop: '16px', background: 'rgba(168,85,247,0.1)', border: '1px solid var(--accent-purple)', padding: '12px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Unassigned Transaction</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                Uber Trip <span style={{ color: 'var(--text-primary)' }}>$24.50</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                <span style={{ fontSize: '0.75rem' }}>AI Suggests:</span>
                <span className="category-badge Transport">Transport (94%)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>Accept</button>
                <button className="btn btn-sm btn-ghost" style={{ flex: 1 }}>Train Model</button>
              </div>
            </div>
          </div>

          {/* BOTTOM: Metrics (blank for now) */}
          <div className="cube-face cube-face-bottom" style={{ background: '#000' }}>
            <h3 style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40%' }}>Core Processing...</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
