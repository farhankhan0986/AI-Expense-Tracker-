import { useState } from 'react';
import { Plus } from 'lucide-react';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
  'Travel',
  'Other',
];

export default function ExpenseForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [suggestedCategory, setSuggestedCategory] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Simple keyword-based auto-classification suggestion
    if (name === 'description') {
      const lower = value.toLowerCase();
      if (/uber|taxi|bus|train|fuel|gas|metro/.test(lower)) setSuggestedCategory('Transport');
      else if (/pizza|coffee|lunch|dinner|restaurant|food|grocery/.test(lower)) setSuggestedCategory('Food');
      else if (/netflix|movie|spotify|concert|game/.test(lower)) setSuggestedCategory('Entertainment');
      else if (/electric|water|internet|phone|rent/.test(lower)) setSuggestedCategory('Bills');
      else if (/amazon|clothes|shoes|mall/.test(lower)) setSuggestedCategory('Shopping');
      else if (/doctor|medicine|gym|pharmacy|hospital/.test(lower)) setSuggestedCategory('Health');
      else if (/book|course|tuition|school|university/.test(lower)) setSuggestedCategory('Education');
      else if (/flight|hotel|airbnb|vacation/.test(lower)) setSuggestedCategory('Travel');
      else setSuggestedCategory('');
    }
  };

  const applySuggestion = () => {
    if (suggestedCategory) {
      setForm((prev) => ({ ...prev, category: suggestedCategory }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.category) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });
    setForm({ amount: '', description: '', category: '', date: new Date().toISOString().split('T')[0] });
    setSuggestedCategory('');
  };

  return (
    <form className="expense-form glass-card" onSubmit={handleSubmit} style={{ padding: '24px' }}>
      <h4 style={{ marginBottom: '20px' }}>Add Expense</h4>
      <div className="expense-form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="exp-amount">Amount ($)</label>
          <input
            id="exp-amount"
            className="form-input"
            type="number"
            name="amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="exp-desc">Description</label>
          <input
            id="exp-desc"
            className="form-input"
            type="text"
            name="description"
            placeholder="e.g. Morning coffee"
            value={form.description}
            onChange={handleChange}
            required
          />
          {suggestedCategory && form.category !== suggestedCategory && (
            <button
              type="button"
              className="category-suggestion"
              onClick={applySuggestion}
              style={{
                marginTop: '6px',
                fontSize: '0.78rem',
                color: 'var(--accent-teal)',
                background: 'var(--accent-teal-dim)',
                border: '1px solid rgba(45, 212, 191, 0.2)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 12px',
                cursor: 'pointer',
              }}
            >
              AI suggests: <strong>{suggestedCategory}</strong> — click to apply
            </button>
          )}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="exp-cat">Category</label>
          <select
            id="exp-cat"
            className="form-select"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="exp-date">Date</label>
          <input
            id="exp-date"
            className="form-input"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px' }}>
        <Plus size={16} />
        {loading ? 'Adding...' : 'Add Expense'}
      </button>

      <style>{`
        .expense-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 20px;
        }
        @media (max-width: 600px) {
          .expense-form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
