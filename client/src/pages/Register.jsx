import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Wallet, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assests/logo.svg'; 

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    monthlyBudget: '',
  });
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
      await register(
        form.name,
        form.email,
        form.password,
        parseFloat(form.monthlyBudget) || 0
      );
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
      <motion.div
        className="auth-card glass-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className='flex justify-center items-center'>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>  
          <img src={logo} alt="Logo" width="60" height="60" />
        </div>
        </div>
        <h1 className="auth-title" style={{ textAlign: 'center' }}>
          Create your account
        </h1>
        <p className="auth-subtitle" style={{ textAlign: 'center' }}>
          Start tracking smarter with SpendLens
        </p>

        {error && (
          <div className="toast-error" style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              <User size={14} style={{ display: 'inline', marginRight: 6 }} />
              Full Name
            </label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              <Mail size={14} style={{ display: 'inline', marginRight: 6 }} />
              Email
            </label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              <Lock size={14} style={{ display: 'inline', marginRight: 6 }} />
              Password
            </label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-budget">
              <Wallet size={14} style={{ display: 'inline', marginRight: 6 }} />
              Monthly Budget (₹)
            </label>
            <input
              id="reg-budget"
              className="form-input"
              type="number"
              name="monthlyBudget"
              placeholder="2000"
              min="0"
              step="1"
              value={form.monthlyBudget}
              onChange={handleChange}
            />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
