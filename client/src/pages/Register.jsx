import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Wallet, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assests/logo.svg';

const InputWithIcon = ({ icon: Icon, ...props }) => (
  <div style={{ position: 'relative' }}>
    <input
      {...props}
      className="form-input"
      style={{ paddingLeft: '42px', ...props.style }}
    />
    <Icon size={16} style={{
      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
      color: 'var(--text-muted)', pointerEvents: 'none',
    }} />
  </div>
);

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', monthlyBudget: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, parseFloat(form.monthlyBudget) || 0);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <AnimatedBackground />

      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: '5%', right: '10%',
        width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', borderRadius: '50%',
      }} />

      <motion.div
        className="auth-card glass-card"
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Logo + Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              width: 58, height: 58, margin: '0 auto 14px',
              background: 'linear-gradient(135deg, #ff0000, #cc0000)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 28px rgba(255,0,0,0.4), 0 8px 20px rgba(0,0,0,0.4)',
            }}
          >
            <img src={logo} alt="SpendLens" width={32} height={32} style={{ filter: 'brightness(10)' }} />
          </motion.div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
            SpendLens
          </div>
          <h1 className="auth-title" style={{ marginBottom: 6 }}>Create account</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>Start tracking smarter today</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
              fontSize: '0.85rem', background: 'rgba(255,0,0,0.08)',
              border: '1px solid rgba(255,0,0,0.25)', color: '#ff4444',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span>⚠</span> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <InputWithIcon icon={User} id="reg-name" type="text" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} required autoComplete="name" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <InputWithIcon icon={Mail} id="reg-email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                style={{ paddingLeft: '42px', paddingRight: '44px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-budget">Monthly Budget (₹) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— optional</span></label>
            <InputWithIcon icon={Wallet} id="reg-budget" type="number" name="monthlyBudget" placeholder="e.g. 10000" min="0" step="1" value={form.monthlyBudget} onChange={handleChange} />
          </div>

          <button className="btn btn-primary" type="submit" id="register-submit" disabled={loading} style={{ width: '100%', marginTop: '8px', height: '48px', fontSize: '0.95rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite', display: 'inline-block' }} />
                Creating account…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Create Account <ArrowRight size={16} /></span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}<Link to="/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
