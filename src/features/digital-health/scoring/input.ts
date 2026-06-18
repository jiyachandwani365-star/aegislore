import { z } from "zod";

export const digitalHealthScoringInputSchema = z.object({
  passwordReuse: z.boolean(),
  knownBreachExposure: z.boolean(),
  mfaEnabled: z.boolean(),
  passwordStrength: z.number().min(0).max(100),
  emailExposure: z.boolean(),
  deviceSecurity: z.enum(["secure", "needs_review", "unknown"])
});
