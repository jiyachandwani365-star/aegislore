import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Eye, Fingerprint, Gauge, LockKeyhole, Radar, ShieldCheck, Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "Digital exposure map",
    description: "See the account, device, and identity signals that shape your personal security posture.",
    icon: Radar
  },
  {
    title: "Plain-language guidance",
    description: "Turn security findings into clear next steps without fear or noise.",
    icon: ShieldCheck
  },
  {
    title: "Access hygiene",
    description: "Understand where unique passwords, MFA, and recovery options matter most.",
    icon: LockKeyhole
  },
  {
    title: "Identity signals",
    description: "Review the health of the digital footprint connected to your email and online identity.",
    icon: Fingerprint
  },
  {
    title: "Health score",
    description: "Track a simple score that improves as your account safety becomes more resilient.",
    icon: Gauge
  },
  {
    title: "Private by design",
    description: "Built around careful defaults, transparent controls, and data-minimizing workflows.",
    icon: Eye
  }
];

const steps = [
  {
    title: "Run a health check",
    description: "Answer a few simple questions about account safety, password reuse, MFA, and recovery readiness."
  },
  {
    title: "Review what matters",
    description: "AegisLore groups recommendations by practical impact so you know what to fix first."
  },
  {
    title: "Improve steadily",
    description: "Make one account safer at a time and return whenever you want a fresh score."
  }
];

function SectionHeading({
  eyebrow,
  title,
  description
}: Readonly<{ eyebrow: string; title: string; description: string }>) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-heading-lg text-balance sm:text-4xl">{title}</h2>
      <p className="mt-4 text-body-lg text-pretty text-muted-foreground">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.12),transparent_28%)]" />
          <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-18 lg:grid-cols-[1.02fr_0.98fr]">
            <Reveal className="max-w-3xl">
              <Badge variant="info" className="mb-5">
                <Sparkles aria-hidden="true" />
                Cybersecurity without fear
              </Badge>
              <h1 className="text-5xl font-semibold leading-none tracking-normal text-balance sm:text-6xl lg:text-display-lg">
                Understand your digital health in minutes.
              </h1>
              <p className="mt-6 max-w-2xl text-body-lg text-pretty text-muted-foreground">
                AegisLore helps you check account safety, understand your score, and choose what to fix first.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <Link href="/signup">
                    Check My Digital Health
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link href="#features">
                    Learn More
                    <ChevronRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {["Free to use", "Private by design", "Plain next steps"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <Check aria-hidden="true" className="size-4 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12} className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
              <Card variant="elevated" className="overflow-hidden">
                <div className="border-b bg-surface/70 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-caption text-muted-foreground">Digital health</p>
                      <p className="mt-1 text-heading-md">Ready to review</p>
                    </div>
                    <Badge variant="outline">Free</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      ["Score", "82", "current"],
                      ["Issues", "3", "to review"],
                      ["Alerts", "0", "urgent"]
                    ].map(([label, value, caption]) => (
                      <div key={label} className="rounded-lg border bg-background p-4">
                        <p className="text-caption text-muted-foreground">{label}</p>
                        <p className="mt-2 text-3xl font-semibold">{value}</p>
                        <p className="mt-1 text-caption text-muted-foreground">{caption}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg border bg-background p-5">
                    <p className="font-medium">What you can do now</p>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                      {["Check for password reuse", "Confirm recovery options", "Turn on MFA where available"].map((item) => (
                        <li key={item} className="flex gap-2">
                          <Check aria-hidden="true" className="mt-0.5 size-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>

        <section id="features" className="container py-22">
          <SectionHeading
            eyebrow="Features"
            title="Everything important, nothing alarmist."
            description="A focused set of tools for understanding risk, strengthening accounts, and building confidence."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} variant="interactive">
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <feature.icon aria-hidden="true" className="size-5" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-surface py-22">
          <div className="container">
            <SectionHeading
              eyebrow="How it works"
              title="A simple rhythm for better digital health."
              description="Move from uncertainty to a clear, manageable account-safety posture."
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Card key={step.title} variant="elevated">
                  <CardHeader>
                    <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container flex flex-col justify-between gap-6 py-10 md:flex-row md:items-center">
          <div>
            <p className="font-semibold">AegisLore</p>
            <p className="mt-2 text-sm text-muted-foreground">Digital health, without panic.</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <Link className="hover:text-foreground" href="#features">
              Features
            </Link>
            <Link className="hover:text-foreground" href="#how-it-works">
              How it works
            </Link>
          </div>
          <Separator className="md:hidden" />
          <p className="text-sm text-muted-foreground">(c) 2026 AegisLore.</p>
        </div>
      </footer>
    </div>
  );
}
