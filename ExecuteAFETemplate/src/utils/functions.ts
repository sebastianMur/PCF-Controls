const d365GuidRegex =
  /^[{(]?[0-9a-fA-F]{8}(-?[0-9a-fA-F]{4}){3}-?[0-9a-fA-F]{12}[)}]?$/;
export const isValidD365Guid = (id: string): boolean => {
  return d365GuidRegex.test(id);
};

export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
