export const calculatePercentageChange = (previous, current) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const calculateProfitLoss = (buyPrice, currentPrice, quantity) => {
  return (currentPrice - buyPrice) * quantity;
};

export const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

export const calculateTotal = (amounts) => {
  return amounts.reduce((a, b) => a + b, 0);
};

export const roundToDecimal = (number, decimals = 2) => {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
