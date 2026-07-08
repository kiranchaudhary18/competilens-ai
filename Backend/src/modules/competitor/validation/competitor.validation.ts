import { z } from "zod";
import { CompetitorStatus } from "@prisma/client";

// Simple domain regex
const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

const contactSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  designation: z.string().optional(),
  email: z.string().email("Invalid contact email format").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid contact LinkedIn URL").optional().or(z.literal("")),
});

const technologySchema = z.object({
  technology: z.string().min(1, "Technology name is required"),
  category: z.string().optional(),
});

const pricingPlanSchema = z.object({
  planName: z.string().min(1, "Pricing plan name is required"),
  price: z.number().nonnegative("Price must be a non-negative number"),
  currency: z.string().default("USD"),
  billingType: z.string().min(1, "Billing type is required (e.g., monthly, yearly)"),
  description: z.string().optional(),
});

const socialSchema = z.object({
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  youtube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
});

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.string().optional(),
});

export const createCompetitorSchema = z.object({
  name: z.string().min(1, "Competitor name is required"),
  domain: z.string().regex(domainRegex, "Invalid domain format (e.g., example.com)"),
  website: z.string().url("Invalid website URL"),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  headquarters: z.string().optional(),
  description: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  status: z.nativeEnum(CompetitorStatus).optional(),
  categoryName: z.string().optional(),
  tags: z.array(tagSchema).optional(),
  contacts: z.array(contactSchema).optional(),
  technologies: z.array(technologySchema).optional(),
  pricingPlans: z.array(pricingPlanSchema).optional(),
  social: socialSchema.optional(),
});

export const updateCompetitorSchema = createCompetitorSchema.partial();
