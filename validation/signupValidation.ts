import { z } from "zod";

// Regular expression for password validation
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

// Define the zod schema for validation
export const userValidation = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((value) => passwordRegex.test(value), {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character.",
    }),
});
