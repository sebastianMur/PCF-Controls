import type TemplateData from "@utils/types/utility-types";

// Mock data matching the database schema
export interface ColumnMetadata {
  id: string;
  name: string;
  displayName: string;
  type: "text" | "number" | "currency" | "date" | "boolean";
  level: "category" | "subcategory" | "lineitem" | "combined";
  isCalculated?: boolean;
}

export interface TableMetadata {
  tableName: string;
  columns: ColumnMetadata[];
}

export const mockMetadata: TableMetadata[] = [
  {
    tableName: "Category",
    columns: [
      {
        id: "cat_name",
        name: "name",
        displayName: "Name",
        type: "text",
        level: "category",
      },
      {
        id: "cat_total",
        name: "total",
        displayName: "Total",
        type: "currency",
        level: "category",
        isCalculated: true,
      },
    ],
  },
  {
    tableName: "Subcategory",
    columns: [
      {
        id: "sub_name",
        name: "name",
        displayName: "Name",
        type: "text",
        level: "subcategory",
      },
      {
        id: "sub_gfcm",
        name: "gfcm",
        displayName: "GFCM",
        type: "text",
        level: "subcategory",
      },
      {
        id: "sub_total",
        name: "total",
        displayName: "Total",
        type: "currency",
        level: "subcategory",
        isCalculated: true,
      },
    ],
  },
  {
    tableName: "LineItem",
    columns: [
      {
        id: "item_name",
        name: "name",
        displayName: "Item",
        type: "text",
        level: "lineitem",
      },
      {
        id: "item_unit_price",
        name: "unitPrice",
        displayName: "Unit Price",
        type: "currency",
        level: "lineitem",
      },
      {
        id: "item_unit",
        name: "unit",
        displayName: "Unit",
        type: "text",
        level: "lineitem",
      },
      {
        id: "item_quantity",
        name: "quantity",
        displayName: "Quantity",
        type: "number",
        level: "lineitem",
      },
      {
        id: "item_total",
        name: "total",
        displayName: "Total",
        type: "currency",
        level: "lineitem",
        isCalculated: true,
      },
    ],
  },
  {
    tableName: "Combined",
    columns: [
      {
        id: "comb_cc_ct",
        name: "ccCt",
        displayName: "CC/CT",
        type: "text",
        level: "combined",
      },
      {
        id: "comb_gfcm",
        name: "gfcm",
        displayName: "GFCM",
        type: "text",
        level: "combined",
      },
      {
        id: "comb_gfcm2",
        name: "gfcm2",
        displayName: "GFCM2",
        type: "text",
        level: "combined",
      },
    ],
  },
];

// Mock template data matching the schema
export const mockTemplateData: TemplateData = {
  template: {
    id: "tmpl1",
    templateId: "TMPL001",
    name: "Project Template",
    categories: [
      {
        id: "cat1",
        categoryId: "CAT001",
        name: "Category 1",
        templateId: "TMPL001",
        total: 0,
        isExpanded: true,
        subcategories: [
          {
            id: "sub1",
            subCategoryId: "SUB001",
            name: "SubCategory 1",
            categoryId: "CAT001",
            gfcmId: "12334 NAME 1",
            total: 0,
            isExpanded: true,
            lineItems: [
              {
                id: "item1",
                lineItemId: "ITEM001",
                name: "Line Item 1",
                unitPrice: 321,
                unit: "Per day",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB001",
              },
              {
                id: "item2",
                lineItemId: "ITEM002",
                name: "Line Item 2",
                unitPrice: 323,
                unit: "per foot",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB001",
              },
              {
                id: "item3",
                lineItemId: "ITEM003",
                name: "Line Item 3",
                unitPrice: 232,
                unit: "Per day",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB001",
              },
            ],
          },
          {
            id: "sub2",
            subCategoryId: "SUB002",
            name: "SubCategory 2",
            categoryId: "CAT001",
            gfcmId: "45335 NAME 2",
            total: 0,
            isExpanded: true,
            lineItems: [
              {
                id: "item4",
                lineItemId: "ITEM004",
                name: "Line Item 1",
                unitPrice: 32,
                unit: "Per day",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB002",
              },
              {
                id: "item5",
                lineItemId: "ITEM005",
                name: "Line Item 2",
                unitPrice: 32,
                unit: "per foot",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB002",
              },
              {
                id: "item6",
                lineItemId: "ITEM006",
                name: "Line Item 3",
                unitPrice: 232,
                unit: "Per day",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB002",
              },
            ],
          },
        ],
      },
      {
        id: "cat2",
        categoryId: "CAT002",
        name: "Category 2",
        templateId: "TMPL001",
        total: 0,
        isExpanded: true,
        subcategories: [
          {
            id: "sub3",
            subCategoryId: "SUB003",
            name: "SubCategory 3",
            categoryId: "CAT002",
            gfcmId: "23423 NAME 4",
            total: 0,
            isExpanded: true,
            lineItems: [
              {
                id: "item7",
                lineItemId: "ITEM007",
                name: "Line Item 1",
                unitPrice: 432,
                unit: "Per day",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB003",
              },
              {
                id: "item8",
                lineItemId: "ITEM008",
                name: "Line Item 2",
                unitPrice: 232,
                unit: "per foot",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB003",
              },
              {
                id: "item9",
                lineItemId: "ITEM009",
                name: "Line Item 3",
                unitPrice: 2343,
                unit: "per foot",
                quantity: 0,
                total: 0,
                subCategoryId: "SUB003",
              },
            ],
          },
        ],
      },
    ],
  },
  columns: [
    {
      id: "item",
      name: "name",
      displayName: "Item",
      type: "text",
      level: "combined",
    },
    {
      id: "unit_price",
      name: "unitPrice",
      displayName: "unit price",
      type: "currency",
      level: "lineitem",
    },
    {
      id: "unit",
      name: "unit",
      displayName: "Unit",
      type: "text",
      level: "lineitem",
    },
    {
      id: "quantity",
      name: "quantity",
      displayName: "Quantity",
      type: "number",
      level: "lineitem",
    },
    {
      id: "total",
      name: "total",
      displayName: "Total",
      type: "currency",
      level: "combined",
    },
  ],
};
