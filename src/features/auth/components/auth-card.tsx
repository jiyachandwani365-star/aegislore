import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { signInWithEmail, signInWithGoogle } from "@/features/auth/actions";

export interface AuthCardProps {
  mode: "sign-in" | "sign-up";
  hasGoogleProvider: boolean;
  hasEmailProvider: boolean;
  error?: string;
}

const copy = {
  "sign-in": {
    title: "Sign in to AegisLore",
    description: "Access your digital health workspace.",
    submit: "Send sign-in link",
    swapText: "New to AegisLore?",
    swapHref: "/signup",
    swapLabel: "Create an account"
  },
  "sign-up": {
    title: "Create your AegisLore account",
    description: "Start with a secure email link or Google account.",
    submit: "Send signup link",
    swapText: "Already have an account?",
    swapHref: "/sign-in",
    swapLabel: "Sign in"
  }
} as const;

export function AuthCard({ mode, hasGoogleProvider, hasEmailProvider, error }: Readonly<AuthCardProps>) {
  const content = copy[mode];

  return (
    <div className="rounded-lg border bg-card p-6 shadow-soft sm:p-8">
      <p className="text-caption font-medium uppercase tracking-[0.14em] text-primary">Account access</p>
      <ShieldCheck aria-hidden="true" className="size-6 text-primary" />
      <h1 className="mt-3 text-heading-lg font-semibold leading-tight tracking-tight">{content.title}</h1>
      <p className="mt-3 text-body text-muted-foreground">{content.description}</p>

      <div className="mt-6 space-y-4">
        {error ? (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
            Enter a valid email address.
          </div>
        ) : null}

        {hasGoogleProvider ? (
          <form action={signInWithGoogle}>
            <SubmitButton className="w-full">Continue with Google</SubmitButton>
          </form>
        ) : null}

        {hasGoogleProvider && hasEmailProvider ? (
          <div className="flex items-center gap-3 text-caption text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>
        ) : null}

        {hasEmailProvider ? (
          <form action={signInWithEmail} className="space-y-3">
            <input name="mode" type="hidden" value={mode} />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
            <SubmitButton className="w-full">
              <Mail aria-hidden="true" />
              {content.submit}
            </SubmitButton>
          </form>
        ) : null}

        {!hasGoogleProvider && !hasEmailProvider ? (
          <div className="rounded-md border bg-muted p-4 text-sm text-muted-foreground">
            Configure Google or email environment variables to enable authentication.
          </div>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          {content.swapText}{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={content.swapHref}>
            {content.swapLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
