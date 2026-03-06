const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  // Remove Content-Type for FormData uploads
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.message || data?.error || `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please try again later.');
    }
    throw error;
  }
}

export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name, email, password, monthlyBudget) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, monthlyBudget }),
  });
}

export async function getExpenses(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/expenses?${query}` : '/expenses';
  return request(endpoint);
}

export async function createExpense(expense) {
  return request('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
}

export async function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadStatement(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/expenses/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getMonthlyAnalytics(month) {
  const m = month || new Date().toISOString().slice(0, 7);
  return request(`/analytics/monthly?month=${encodeURIComponent(m)}`);
}

export async function getSpendingTrend() {
  return request('/analytics/trends');
}

export async function getSavingSuggestions() {
  return request('/analytics/suggestions');
}

export async function getBudgetAlerts() {
  return request('/analytics/alerts');
}

export async function setBudgetLimit(category, limit) {
  return request('/budget/limits', {
    method: 'POST',
    body: JSON.stringify({ category, limit }),
  });
}

export async function getBudgetLimits() {
  return request('/budget/limits');
}
