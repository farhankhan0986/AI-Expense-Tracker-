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

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/suggestions', label: 'Suggestions', icon: Lightbulb },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      <AnimatedBackground />

      {/* Mobile header */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="sidebar-brand-text">
          <Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />
          SpendLens
        </span>
        <div style={{ width: 38 }} />
      </div>

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Sparkles size={18} />
          </div>
          <span className="sidebar-brand-text">SpendLens</span>
        </div>

        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <Icon size={20} className="sidebar-link-icon" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
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
            <LogOut size={18} />
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
