import api from './api';

export const getProducts = (params = { page: 1, limit: 8 }) => {
  return api.get('/products', { params });
};

export const getProductById = (productId) => {
  return api.get(`/products/${productId}`);
};

export const createProduct = (productData) => {
  return api.post('/products', productData);
};

export const updateProduct = (productId, productData) => {
  return api.put(`/products/${productId}`, productData);
};

export const deleteProduct = (productId) => {
  return api.delete(`/products/${productId}`);
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
