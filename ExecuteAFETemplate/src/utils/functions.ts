const d365GuidRegex =
  /^[{(]?[0-9a-fA-F]{8}(-?[0-9a-fA-F]{4}){3}-?[0-9a-fA-F]{12}[)}]?$/;
export const isValidD365Guid = (id: string): boolean => {
  return d365GuidRegex.test(id);
};

export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export const getLookupId = (lookup: any): string | undefined => {
  if (!lookup) return undefined;

  // Case 1: String (raw ID)
  if (typeof lookup === "string") {
    return lookup;
  }

  // Case 2: Array with standard structure (real app)
  if (Array.isArray(lookup) && lookup.length > 0) {
    const item = lookup[0];

    return (
      item?.id || // Real app
      item?._id // Local/test mode
    );
  }

  return undefined;
};
