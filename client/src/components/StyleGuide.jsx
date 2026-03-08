import React from 'react';

export default function StyleGuide() {
  return (
    <div className="page-wrapper" style={{ padding: '2rem' }}>
      <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Futuristic Design System</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="section-title">Color Palette</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Primary Backgrounds */}
          <ColorSwatch name="Background Primary" color="var(--bg-primary)" />
          <ColorSwatch name="Background Secondary" color="var(--bg-secondary)" />
          <ColorSwatch name="Glass Surface" color="var(--bg-glass)" />
          
          {/* Accents */}
          <ColorSwatch name="Stark Black" color="var(--accent-purple)" glow="var(--shadow-glow-purple)" />
          <ColorSwatch name="Clean Core Blue" color="var(--accent-teal)" glow="var(--shadow-glow-teal)" />
          <ColorSwatch name="Minimal Inverse" color="var(--accent-pink)" glow="var(--shadow-glow-pink)" />
          <ColorSwatch name="Warning Alert" color="var(--accent-orange)" />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 className="section-title">Typography</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '1rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Display heading 1 (Inter)</h1>
            <p style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>Clean, sans-serif minimalist titles.</p>
          </div>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '1rem' }}>
            <h2>Display heading 2</h2>
            <h3>Display heading 3</h3>
            <h4>Display heading 4</h4>
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Body text (Inter, primary color). For general readability across the application interface.</p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Secondary text (Inter). For labels, hints, and less prominent information.</p>
            <p style={{ color: 'var(--text-muted)' }}>Muted text for very minor details.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">UI Elements</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="glass-card glass-card-interactive" style={{ padding: '2rem', flex: 1, minWidth: '300px' }}>
            <h3>Interactive Glass Panel</h3>
            <p>Hover me to see the lift effect and border highlight.</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem', flex: 1, minWidth: '300px' }}>
            <h3 className="gradient-text">Gradient Text Example</h3>
            <p>Using the primary neon gradient for emphasis.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({ name, color, glow }) {
  return (
    <div className="glass-card" style={{ padding: '1rem' }}>
      <div 
        style={{ 
          height: '100px', 
          backgroundColor: color, 
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          boxShadow: glow || 'none'
        }} 
      />
      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{name}</h4>
      <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{color.includes('var') ? getComputedStyle(document.documentElement).getPropertyValue(color.match(/\(([^)]+)\)/)?.[1] || '').trim() || color : color}</p>
    </div>
  );
}
