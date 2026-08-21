import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  sort_order: z.number().int().optional().default(0),
  is_active: z.number().int().min(0).max(1).optional().default(1),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export type CreateCollectionInput = z.input<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.input<typeof updateCollectionSchema>;
