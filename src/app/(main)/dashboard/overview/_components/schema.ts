import { z } from "zod";

// Schema for Clerk users (matches table columns)
export const userSchema = z.object({
  id: z.number(), // Index + 1
  uid: z.string(), // User ID
  euid: z.string(), // Email ID
  fullName: z.string(), // Full Name
  username: z.string(), // Username
  email: z.string(), // Email
  address: z.string(), // Living address
  role: z.string(), // Role
  created: z.string(), // Created date
  updated: z.string(), // Updated date
  avatar: z.string().optional(), // Avatar URL
});
