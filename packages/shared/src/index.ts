import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
  language: z.enum(["de", "en"]).optional(),
  website: z.string().max(0).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export * from "./i18n";
