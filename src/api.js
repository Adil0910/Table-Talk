import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'tt_admin_token';

export const api = axios.create({
  baseURL: `${API_URL}/api`
});

export const SOCKET_URL = API_URL;

// --- Admin session helpers -------------------------------------------------

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Attach the admin token (if any) to every request automatically.
api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Menu ---------------------------------------------------------------

// all=true returns every item (including out-of-stock) - safe to call publicly,
// since it's used by both the customer menu (to show "out of stock" badges)
// and the admin menu manager.
export const fetchMenu = (all = false) =>
  api.get('/menu', { params: all ? { all: 'true' } : {} }).then((r) => r.data);

export const createMenuItem = (payload) => api.post('/menu', payload).then((r) => r.data);
export const updateMenuItem = (id, payload) =>
  api.put(`/menu/${id}`, payload).then((r) => r.data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`).then((r) => r.data);

// --- Orders ---------------------------------------------------------------

export const placeOrder = (payload) => api.post('/orders', payload).then((r) => r.data);

export const fetchOrders = (status) =>
  api.get('/orders', { params: status ? { status } : {} }).then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

// --- Admin auth -------------------------------------------------------------

export const adminLogin = (passcode) =>
  api.post('/admin/login', { passcode }).then((r) => r.data);
