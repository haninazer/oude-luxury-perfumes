const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('oude_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

// Auth API
export const authApi = {
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// Products API
export const productApi = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),
  create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// Cart API
export const cartApi = {
  getCart: (promoCode = '') => request(`/cart${promoCode ? `?promoCode=${encodeURIComponent(promoCode)}` : ''}`),
  add: (productId, quantity = 1) => request('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  }),
  update: (productId, quantity) => request('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity })
  }),
  remove: (productId) => request(`/cart/remove/${productId}`, { method: 'DELETE' }),
  clear: () => request('/cart/clear', { method: 'DELETE' }),
  calculate: (items, promoCode = '') => request('/cart/calculate', {
    method: 'POST',
    body: JSON.stringify({ items, promoCode })
  }),
};

// Orders API
export const orderApi = {
  create: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/my-orders'),
  getById: (id) => request(`/orders/${id}`),
  // Admin endpoints
  getStats: () => request('/orders/admin/stats'),
  getAll: (status) => request(`/orders/admin/all${status ? `?status=${status}` : ''}`),
  updateStatus: (id, status) => request(`/orders/admin/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
};

export default {
  auth: authApi,
  products: productApi,
  cart: cartApi,
  orders: orderApi,
};
