export interface TemplateColumn {
  id: string;
  name: string;
  displayName: string;
  type: "text" | "number" | "currency" | "date" | "boolean";
  level: "category" | "subcategory" | "lineitem" | "combined";
  isCalculated?: boolean;
}

export interface LineItem {
  id: string;
  lineItemId: string;
  name: string;
  unitPrice?: number;
  unit?: string;
  quantity?: number;
  total?: number;
  subCategoryId: string;
  [key: string]: any;
}

export interface Subcategory {
  id: string;
  subCategoryId: string;
  name: string;
  categoryId: string;
  gfcmId?: string;
  total?: number;
  lineItems: LineItem[];
  isExpanded: boolean;
  [key: string]: any;
}

export interface Category {
  id: string;
  categoryId: string;
  name: string;
  templateId: string;
  total?: number;
  subcategories: Subcategory[];
  isExpanded: boolean;
  [key: string]: any;
}

export interface Template {
  id: string;
  templateId: string;
  name: string;
  categories: Category[];
}

export interface TemplateData {
  template: Template;
  columns: TemplateColumn[];
}

export default TemplateData;
