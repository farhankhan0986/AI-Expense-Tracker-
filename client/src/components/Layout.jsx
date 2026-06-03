import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Upload,
  Wallet,
  Lightbulb,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from './AnimatedBackground';
import NotificationSystem from './NotificationSystem';
import logo from '../assests/logo.svg';

const NAV_LINKS = [
  { to: '/dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/expenses',    label: 'Expenses',   icon: Receipt },
  { to: '/analytics',  label: 'Analytics',  icon: BarChart3 },
  { to: '/budget',     label: 'Budget',     icon: Wallet },
  { to: '/upload',     label: 'Upload',     icon: Upload },
  { to: '/suggestions',label: 'Suggestions',icon: Lightbulb },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      <AnimatedBackground />
      <NotificationSystem />

      {/* Mobile header */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #ff0000, #cc0000)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(255,0,0,0.4)',
          }}>
            <img src={logo} alt="Logo" width={18} height={18} style={{ filter: 'brightness(10)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            Spend<span style={{ color: '#ff0000' }}>Lens</span>
          </span>
        </div>
        <div style={{ width: 38 }} />
      </div>

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ marginTop: 0 }}>
        {/* Brand */}
        <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #ff0000, #cc0000)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255,0,0,0.4)',
            flexShrink: 0,
          }}>
            <img src={logo} alt="SpendLens" width={22} height={22} style={{ filter: 'brightness(10)' }} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem', fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>
              Spend<span style={{ color: '#ff0000' }}>Lens</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
              Expense Tracker
            </div>
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', margin: '0 16px 12px' }} />

        {/* Nav */}
        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <Icon size={19} className="sidebar-link-icon" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom separator */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', margin: '8px 16px' }} />

        {/* User section */}
        <div className="sidebar-user" style={{ marginBottom: '16px' }}>
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-email">{user?.email || ''}</div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
    </>
  );
}
