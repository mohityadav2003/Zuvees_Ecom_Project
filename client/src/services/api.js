import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
  riderLogin: (credentials) => api.post('/auth/rider/login', credentials),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateQuantity: (data) => api.put('/cart/update', data),
  removeFromCart: (data) => api.delete('/cart/remove', data),
};

// Orders API
export const ordersAPI = {
  createOrder: (data) => api.post('/orders/create', data),
  getUserOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders/all'),
  updateOrderStatus: (data) => api.put('/orders/status', data),
  getRiderOrders: () => api.get('/orders/rider-orders'),
  updateDeliveryStatus: (data) => api.put('/orders/delivery-status', data),
};

// Riders API
export const ridersAPI = {
  getAll: () => api.get('/rider/all'),
  create: (data) => api.post('/rider/create', data),
  updateStatus: (data) => api.put('/rider/status', data),
  updateLocation: (data) => api.put('/rider/location', data),
};

export default api; 