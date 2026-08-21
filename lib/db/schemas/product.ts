import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  sku: z.string().optional().nullable(),
  collection_id: z.number().int().positive().nullable().optional(),
  description: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  price_inr: z.number().int().nonnegative("Price must be non-negative (in paise)"),
  sale_price_inr: z.number().int().nonnegative().optional().nullable(),
  pricing_mode: z.enum(["MANUAL", "CALCULATED"]).optional().default("MANUAL"),
  metal: z.string().optional().default("18k Yellow Gold"),
  purity: z.string().optional().default("18 KT"),
  metal_weight_g: z.number().nonnegative().optional().nullable(),
  stone_type: z.string().optional().nullable(),
  stone_weight_ct: z.number().nonnegative().optional().nullable(),
  diamond_carat: z.number().nonnegative().optional().nullable(),
  diamond_clarity: z.string().optional().nullable(),
  diamond_colour: z.string().optional().nullable(),
  making_charges: z.number().int().nonnegative().optional().nullable(),
  other_charges: z.number().int().nonnegative().optional().nullable(),
  metal_rate_ref: z.string().optional().nullable(),
  gst_percent: z.number().nonnegative().optional().default(3),
  available_sizes: z.array(z.string()).or(z.string()).optional().nullable(),
  stock_quantity: z.number().int().nonnegative().optional().default(10),
  stock_status: z.enum(["in-stock", "made-to-order", "out-of-stock"]).optional().default("made-to-order"),
  is_featured: z.number().int().min(0).max(1).optional().default(0),
  is_published: z.number().int().min(0).max(1).optional().default(0),
  sort_order: z.number().int().optional().default(0),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.input<typeof createProductSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
