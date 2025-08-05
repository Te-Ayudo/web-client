export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Bs. 0';
  
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}; 