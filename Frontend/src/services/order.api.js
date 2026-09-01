import api from './api';

export const placeOrder = () => {
  return api.post('/orders');
};

export const getMyOrders = () => {
  return api.get('/orders');
};

export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export default {
  placeOrder,
  getMyOrders,
  getOrderById,
};
