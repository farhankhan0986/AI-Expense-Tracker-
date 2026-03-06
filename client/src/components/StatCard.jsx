import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, trend, trendValue, color = 'purple' }) {
  return (
    <div className="glass-card glass-card-interactive stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon ${color}`}>
          {Icon && <Icon size={20} />}
        </div>
        {trend && (
          <div className={`stat-card-trend ${trend}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
