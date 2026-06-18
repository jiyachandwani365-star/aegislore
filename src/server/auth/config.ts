import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";

import { env } from "@/lib/env";

const providers: Provider[] = [];
const hasSmtpEmail =
  Boolean(env.EMAIL_SERVER_HOST && env.EMAIL_SERVER_USER && env.EMAIL_SERVER_PASSWORD && env.EMAIL_FROM);
const hasDevelopmentEmail = process.env.NODE_ENV !== "production" && Boolean(env.EMAIL_FROM);

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false
    })
  );
}

if (hasSmtpEmail || hasDevelopmentEmail) {
  providers.push(
    Nodemailer({
      id: "email",
      name: "Email",
      from: env.EMAIL_FROM,
      maxAge: 10 * 60,
      ...(hasSmtpEmail
        ? {
            server: {
              host: env.EMAIL_SERVER_HOST,
              port: env.EMAIL_SERVER_PORT,
              auth: {
                user: env.EMAIL_SERVER_USER,
                pass: env.EMAIL_SERVER_PASSWORD
              }
            }
          }
        : {
            async sendVerificationRequest({ identifier, url }) {
              console.info(`AegisLore sign-in link for ${identifier}: ${url}`);
            }
          })
    })
  );
}

export const authConfig = {
  providers,
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/auth/verify-request"
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    }
  }
} satisfies NextAuthConfig;
