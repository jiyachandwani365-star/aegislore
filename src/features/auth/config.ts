import { env } from "@/lib/env";

export const authProviderStatus = {
  google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  email:
    Boolean(env.EMAIL_SERVER_HOST && env.EMAIL_SERVER_USER && env.EMAIL_SERVER_PASSWORD && env.EMAIL_FROM) ||
    (process.env.NODE_ENV !== "production" && Boolean(env.EMAIL_FROM))
};
