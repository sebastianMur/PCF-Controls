import { z } from "zod";

export const categorySchema = z.object({
  categorySummaryId: z.string().optional(),
  categoryId: z.string().optional(),
  templateSummaryId: z.string().optional(),
  total: z.number().optional().default(0),
  isExpanded: z.boolean().optional().default(true),
});

export const subcategorySchema = z.object({
  subCategorySummaryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  categorySummaryId: z.string().min(1, "Category is required"), // Foreign key
  total: z.number().optional().default(0),
  isExpanded: z.boolean().optional().default(true),
});

export const lineItemSchema = z.object({
  lineItemDetailsId: z.string().optional(),
  lineItemId: z.string().optional(),
  unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.coerce.number().min(0, "Quantity must be positive").default(0),
  subCategorySummaryId: z.string().min(1, "Subcategory is required"), // Foreign key
  total: z.number().optional().default(0),
});

export const templateSummarySchema = z.object({
  templateId: z.string(),
  grandTotal: z.coerce.number().min(0, "Grand total must be positive"),
});

export const templateFormSchema = z.object({
  templateSummary: templateSummarySchema,
  categories: z.array(categorySchema),
  subcategories: z.array(subcategorySchema),
  lineItems: z.array(lineItemSchema),
  attachment: z
    .object({
      name: z.string(),
      id: z.string(),
      size: z.number(),
      type: z.string(),
    })
    .optional(),
});

export type TemplateSummaryData = z.infer<typeof templateSummarySchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type SubcategoryFormData = z.infer<typeof subcategorySchema>;
export type LineItemFormData = z.infer<typeof lineItemSchema>;

export type TemplateFormData = z.infer<typeof templateFormSchema>;
