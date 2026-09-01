import api from './api';

export const getCategories = () => {
  return api.get('/categories');
};

export const createCategory = (categoryData) => {
  return api.post('/categories', categoryData);
};

export default {
  getCategories,
  createCategory,
};
