import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URI}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  // Try to get token from Redux state first, then localStorage
  let token = null;
  // Check if Redux store is available and has auth state
  if (window.store && window.store.getState().auth.token) {
    token = window.store.getState().auth.token;
  } else {
    token = localStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  riderLogin: async (credentials) => {
    try {
      console.log('Making rider login request to:', `${API_URL}/rider/login`);
      const response = await api.post('/rider/login', credentials);
      console.log('Rider login response:', response);
      return response;
    } catch (error) {
      console.error('Rider login request failed:', error.response || error);
      throw error;
    }
  },
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items/create', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateQuantity: (data) => api.put('/cart/update', data),
  removeFromCart: ({ itemId, color, size }) => api.delete(`/cart/remove/${itemId}/${encodeURIComponent(color)}/${encodeURIComponent(size)}`),
};

// Orders API
export const ordersAPI = {
  createOrder: (data) => api.post('/orders/create', data),
  getUserOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders/all'),
  updateOrderStatus: (data) => api.put('/orders/status', data),
  getRiderOrders: () => api.get('/orders/rider-orders'),
  updateDeliveryStatus: (data) => api.put('/orders/delivery-status', data),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

// Riders API
export const ridersAPI = {
  getAll: () => api.get('/rider/all'),
  create: (data) => api.post('/rider/create', data),
  updateStatus: (data) => api.put('/rider/status', data),
  updateLocation: (data) => api.put('/rider/location', data),
  update: (id, data) => api.put(`/rider/${id}`, data),
};

export default api; 