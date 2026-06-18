import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Card variant="elevated" className="w-full max-w-md">
      <CardHeader>
        <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </div>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-md border border-primary/25 bg-primary/10 p-3 text-sm text-primary">
            Enter a valid email address.
          </div>
        ) : null}

        {hasGoogleProvider ? (
          <form action={signInWithGoogle}>
            <Button className="w-full" type="submit">
              Continue with Google
            </Button>
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
            <input type="hidden" name="mode" value={mode} />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
            <Button className="w-full" type="submit">
              <Mail aria-hidden="true" />
              {content.submit}
            </Button>
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
      </CardContent>
    </Card>
  );
}
