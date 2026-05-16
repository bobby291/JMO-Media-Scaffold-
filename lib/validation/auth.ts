import { z } from "zod";

const roles = ["READER", "CONTRIBUTOR", "EDITOR", "ADMIN"] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(120),
  role: z.enum(roles).default("READER"),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  token: z.string().min(12).max(200),
  password: z.string().min(8).max(120),
});
