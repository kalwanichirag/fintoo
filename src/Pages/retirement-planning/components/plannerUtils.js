export function formatCurrencyLabel(value) {
  const number = Number(value);
  if (number >= 100000) {
    return `₹${(number / 100000).toFixed(1)}L`;
  }
  return `₹${number.toLocaleString("en-IN")}`;
}

export function calculateCorpus(currentAge, retirementAge, monthlyExpenses, expectedReturns) {
  const inflation = 6;
  const years = Math.max(retirementAge - currentAge, 1);
  const annualExpenses = monthlyExpenses * 12;
  const futureAnnualExpenses = annualExpenses * Math.pow(1 + inflation / 100, years);
  const realRate = (expectedReturns - inflation) / 100;
  const corpus = realRate > 0 ? futureAnnualExpenses / realRate : futureAnnualExpenses * 25;

  if (corpus >= 1e7) {
    return `₹${(corpus / 1e7).toFixed(1)} Cr`;
  }

  return `₹${Math.round(corpus / 1e5).toLocaleString("en-IN")} L`;
}
