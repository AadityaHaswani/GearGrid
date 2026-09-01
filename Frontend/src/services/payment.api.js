import api from './api';

export const createPayment = ({ orderId, paymentMethod }) => {
  return api.post('/payments', { orderId, paymentMethod });
};

export default {
  createPayment,
};
