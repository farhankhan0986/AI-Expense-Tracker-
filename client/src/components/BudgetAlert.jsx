import { AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BudgetAlert({ category, spent, limit, percentage }) {
  const level = percentage >= 100 ? 'danger' : 'warning';

  return (
    <motion.div
      className={`budget-alert ${level}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="budget-alert-icon">
        {level === 'danger' ? <AlertCircle size={22} /> : <AlertTriangle size={22} />}
      </div>
      <div className="budget-alert-content">
        <div className="budget-alert-title">
          {level === 'danger'
            ? `${category} budget exceeded!`
            : `${category} budget at ${Math.round(percentage)}%`}
        </div>
        <div className="budget-alert-text">
          ${spent.toFixed(2)} spent of ${limit.toFixed(2)} limit
        </div>
      </div>
    </motion.div>
  );
}
