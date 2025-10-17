import type { TemplateSummaryFormData } from "@/forms/form-schemas";

const d365GuidRegex =
  /^[{(]?[0-9a-fA-F]{8}(-?[0-9a-fA-F]{4}){3}-?[0-9a-fA-F]{12}[)}]?$/;
export const isValidD365Guid = (id: string): boolean => {
  return d365GuidRegex.test(id);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

export const base64ToBlob = (base64: string, contentType: string): Blob => {
  // const [prefix, base64Data] = base64.split(',');
  // const contentType = prefix.match(/:(.*?);/)?.[1] || '';
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const getTemplateSummaryRequiredFields = (
  templateSummary: TemplateSummaryFormData,
  hasAttachments = false,
): string[] => {
  // Map fields to human-friendly labels
  const fieldLabels: Record<keyof TemplateSummaryFormData, string> = {
    xomuog_companycode: "Company Code",
    xomuog_costcenter: "Cost Center",
    xomuog_descriptionscopeofwork: "Description / Scope of Work",
    xomuog_projectdescription: "Project Description",
    xomuog_subprojecttype: "Subproject Type",
    xomuog_engineerid: "Engineer",
    xomuog_landmanid: "Landman",
    xomuog_operator: "Operator",
    xomuog_capexopex: "Capex/Opex",
    xomuog_mainprojecttype: "Main Project Type",
    xomuog_projectnumber: "Project Number",
    xomuog_grandtotal: "Grand Total",
    xomuog_wpnid: "WPN",
    statuscode: "Status",
    xomuog_templateid: "Template ID",
    xomuog_templatesummaryid: "Template Summary ID",
    xomuog_afeexecutebusinessunit: "Business Unit",
    xomuog_projectteam: "Project Team",
    xomuog_isfilereplaced: "Is File Replaced",
    xomuog_aferecordurl: "AFE Record URL",
    xomuog_afedocumentid: "AFE Document ID",
  };

  // Define which fields are required
  const requiredFields: (keyof TemplateSummaryFormData)[] = [
    "xomuog_companycode",
    "xomuog_costcenter",
    "xomuog_descriptionscopeofwork",
    "xomuog_projectdescription",
    "xomuog_subprojecttype",
    "xomuog_engineerid",
    "xomuog_landmanid",
    "xomuog_operator",
    "xomuog_capexopex",
    "xomuog_mainprojecttype",
    "xomuog_afeexecutebusinessunit",
    "xomuog_projectteam",
  ];

  // Check which required fields are empty
  const missingMessages = requiredFields
    .filter(field => {
      const value = templateSummary[field];
      return (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
      );
    })
    .map(field => `${fieldLabels[field]} is required.`);

  if (!hasAttachments) {
    missingMessages.push("Attachment is required.");
  }
  return missingMessages;
};
