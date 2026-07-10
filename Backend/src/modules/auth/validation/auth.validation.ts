import { z } from "zod";
import { UserRole } from "@prisma/client";

// Regex for: min 8 chars, 1 uppercase, 1 lowercase, 1 number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  role: z.nativeEnum(UserRole).optional().default(UserRole.MEMBER),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name cannot be empty").optional(),
  avatar: z.string().url("Avatar must be a valid URL").or(z.string().nullable()).optional(),
  company: z.string().min(1, "Company name cannot be empty").optional(),
  phone: z.string().optional(),
  timezone: z.string().min(1, "Timezone cannot be empty").optional(),
});
