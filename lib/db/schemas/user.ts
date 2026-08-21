import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional().nullable(),
  role: z.enum(["admin", "editor"]).default("admin"),
});

export const addImageSchema = z.object({
  path: z.string().min(1, "Image path is required"),
  alt: z.string().optional().nullable(),
  is_primary: z.number().int().min(0).max(1).default(0),
  sort_order: z.number().int().default(0),
});
