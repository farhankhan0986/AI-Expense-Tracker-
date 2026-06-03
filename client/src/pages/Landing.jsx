import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Bell, BarChart3, PiggyBank, ArrowRight, Bot } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assests/logo.svg';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Classification',
    description: 'Expenses are automatically categorised using smart pattern recognition â€” no manual tagging needed.',
    color: '#ff0000',
    bg: 'rgba(255, 0, 0, 0.12)',
  },
  {
    icon: Bell,
    title: 'Budget Alerts',
    description: 'Real-time notifications when your spending approaches or exceeds category budgets.',
    color: '#ff0000',
    bg: 'rgba(255, 0, 0, 0.12)',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Clear charts and trend lines that reveal exactly where your money goes each month.',
    color: '#ff0000',
    bg: 'rgba(255, 0, 0, 0.12)',
  },
  {
    icon: PiggyBank,
    title: 'Smart Savings',
    description: 'Personalised saving tips powered by spending analysis to help you keep more of what you earn.',
    color: '#ff0000',
    bg: 'rgba(255, 0, 0, 0.12)',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Landing() {
  return (
    <div className="landing">

      {/* Navbar */}
      <header className="landing-nav">
        <div className="flex gap-2 items-center w-full ">
          <div style={{ textAlign: 'center', marginBottom: '' }}>
            <img src={logo} alt="Logo" width="40" height="40" />
          </div>
          <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            SpendLens
          </div>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col lg:flex-row justify-center items-center  mt-20 mb-20 gap-20">
        <motion.div
          className="landing-hero-content ml-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span className="flex justify-start w-fit  items-center gap-2 mb-2 text-xs text-gray-400 px-2 py-1 border border-gray-700">
            <Bot size={16} className='text-red-500 animate-pulse delay-200' /> AI-Powered Finance
          </span>
          <h1 className="landing-title">
            Track Spending.
            <br />
            <span className="gradient-text">Save Smarter.</span>
          </h1>
          <p className="landing-subtitle">
            SpendLens uses artificial intelligence to classify your expenses, alert you
            before budgets break, and surface personalised savings â€” all in a beautifully
            crafted dashboard.
          </p>
          <div className="landing-cta-group">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="landing-hero-visual"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-mockup glass-card p-6 lg:w-[700px] w-[400px]">

            {/* Total Spending */}
            <div className="mb-5">
              <p className="text-sm text-gray-400">Monthly Spending</p>
              <h2 className="text-2xl font-semibold text-white">â‚¹18,420</h2>
            </div>

            {/* Categories */}
            <div className="space-y-4">

              {/* Food */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Food</p>
                  <div className="w-full h-2 bg-slate-700 mt-1">
                    <div className="h-2 bg-red-500 w-[70%]"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">â‚¹6,200</span>
              </div>

              {/* Transport */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-400"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Transport</p>
                  <div className="w-full h-2 bg-slate-700 mt-1">
                    <div className="h-2 bg-red-400 w-[40%]"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">â‚¹3,100</span>
              </div>

              {/* Shopping */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-600"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Shopping</p>
                  <div className="w-full h-2 bg-slate-700 mt-1">
                    <div className="h-2 bg-red-600 w-[55%]"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">â‚¹4,800</span>
              </div>

              {/* Bills */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-300"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Bills</p>
                  <div className="w-full h-2 bg-slate-700 mt-1">
                    <div className="h-2 bg-red-300 w-[35%]"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">â‚¹2,900</span>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <motion.h2
          className="landing-features-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Everything you need to
          <br />
          <span className="gradient-text-secondary">master your money</span>
        </motion.h2>

        <motion.div
          className="landing-features-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {FEATURES.map((feat) => (
            <motion.div key={feat.title} className="feature-card glass-card glass-card-interactive" variants={item}>
              <div
                className="feature-icon"
                style={{ background: feat.bg, color: feat.color }}
              >
                <feat.icon size={24} />
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="landing-footer-cta">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Ready to take control?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Join thousands of young professionals saving smarter with SpendLens.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started â€” It's Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <style>{`
        .landing {
          position: relative;
          overflow-x: hidden;
          background: var(--bg-primary);
          min-height: 100vh;
        }

        /* Decorative shapes â€” removed */
        .landing-shapes { display: none; }

        /* Nav */
        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid var(--bg-glass-border);
          background: var(--bg-surface);
        }

        .landing-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          color: var(--accent-red);
        }

        .landing-nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Hero */
        .landing-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 80px 40px 100px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .landing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--accent-red);
          background: var(--accent-red-dim);
          padding: 6px 16px;
          border-radius: 0;
          margin-bottom: 20px;
        }

        .landing-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .landing-subtitle {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 500px;
          margin-bottom: 36px;
        }

        .landing-cta-group {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        /* Hero mockup */
        .hero-mockup {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .hero-mockup-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hero-dot {
          width: 12px;
          height: 12px;
          border-radius: 0;
          flex-shrink: 0;
        }

        .hero-bar {
          height: 10px;
          border-radius: 0;
        }

        /* Features */
        .landing-features {
          padding: 80px 40px;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .landing-features-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          margin-bottom: 48px;
        }

        .landing-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          text-align: left;
        }

        .feature-card {
          padding: 32px 28px;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .feature-title {
          font-size: 1.15rem;
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Footer CTA */
        .landing-footer-cta {
          text-align: center;
          padding: 80px 40px 100px;
          position: relative;
          z-index: 1;
          border-top: 1px solid var(--bg-glass-border);
        }

        @media (max-width: 768px) {
          .landing-hero {
            grid-template-columns: 1fr;
            padding: 40px 20px 60px;
            gap: 40px;
          }

          .landing-nav {
            padding: 16px 20px;
          }

          .landing-features {
            padding: 40px 20px;
          }

          .landing-footer-cta {
            padding: 40px 20px 60px;
          }

          .landing-features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

