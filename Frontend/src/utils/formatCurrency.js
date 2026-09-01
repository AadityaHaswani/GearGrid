/**
 * Format numeric price value into Indian Rupee currency format (₹).
 * Keeps numeric value unchanged and applies Indian numbering system formatting.
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  const num = Number(amount);
  return `₹${num.toLocaleString('en-IN')}`;
};

export const formatCurrency = formatPrice;
export default formatPrice;
