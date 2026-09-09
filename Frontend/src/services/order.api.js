import api from './api';

export const placeOrder = (orderData = {}) => {
  return api.post('/orders', orderData);
};

export const getMyOrders = () => {
  return api.get('/orders');
};

export const getAllOrders = () => {
  return api.get('/orders/admin');
};

export const updateOrderStatus = (orderId, status) => {
  return api.patch(`/orders/${orderId}/status`, { status });
};

export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export default {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};

