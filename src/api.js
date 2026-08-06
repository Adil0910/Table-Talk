import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`
});

export const SOCKET_URL = API_URL;

export const fetchMenu = () => api.get('/menu').then((r) => r.data);

export const placeOrder = (payload) => api.post('/orders', payload).then((r) => r.data);

export const fetchOrders = (status) =>
  api.get('/orders', { params: status ? { status } : {} }).then((r) => r.data);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((r) => r.data);
