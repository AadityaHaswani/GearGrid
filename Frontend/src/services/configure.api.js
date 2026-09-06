import api from './api';

/**
 * Fetch calibrated PC recommendations based on consultation questionnaire answers
 * @param {Object} payload - Consultation requirements (useCases, workloads, budget, budgetFlex, priorities, experience)
 * @returns {Promise} Axios response with recommendations
 */
export const getRecommendations = (payload) => {
  return api.post('/configure/recommend', payload);
};

export default {
  getRecommendations,
};
