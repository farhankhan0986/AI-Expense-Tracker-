import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assests/logo.svg';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <AnimatedBackground />

      {/* Decorative red orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(255,0,0,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(255,0,0,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', borderRadius: '50%',
      }} />

      <motion.div
        className="auth-card glass-card"
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Logo + Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              width: 64, height: 64, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #ff0000, #cc0000)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 32px rgba(255,0,0,0.4), 0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <img src={logo} alt="SpendLens" width={36} height={36} style={{ filter: 'brightness(10)' }} />
          </motion.div>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--accent-red)',
            textTransform: 'uppercase', letterSpacing: '0.15em',
            marginBottom: 8,
          }}>
            SpendLens
          </div>
          <h1 className="auth-title" style={{ marginBottom: 6 }}>Welcome back</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              background: 'rgba(255,0,0,0.08)',
              border: '1px solid rgba(255,0,0,0.25)',
              color: '#ff4444',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: '1rem' }}>⚠</span>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              <Mail size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ paddingLeft: '42px' }}
              />
              <Mail size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              <Lock size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingLeft: '42px', paddingRight: '44px' }}
              />
              <Lock size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 0, display: 'flex',
                  transition: 'color 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="btn btn-primary"
            type="submit"
            id="login-submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', height: '48px', fontSize: '0.95rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin-slow 0.7s linear infinite', display: 'inline-block',
                }} />
                Signing in…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Sign In
                <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
}
