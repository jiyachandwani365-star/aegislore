import {
  Bell,
  CreditCard,
  Database,
  Download,
  KeyRound,
  Link2,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  Trash2,
  UserRound
} from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Settings"
};

const connectedAccounts = [
  { provider: "Google", status: "Available when configured" },
  { provider: "Email magic link", status: "Passwordless sign-in" }
];

const sessions = [
  { device: "Current browser", location: "This session", lastActive: "Active now" },
  { device: "Other sessions", location: "Future session history", lastActive: "Coming soon" }
];

function SectionIcon({ icon: Icon }: Readonly<{ icon: typeof UserRound }>) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
      <Icon aria-hidden="true" className="size-5" />
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled = false,
  disabled = false
}: Readonly<{ title: string; description: string; enabled?: boolean; disabled?: boolean }>) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-background p-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <Switch aria-label={title} defaultChecked={enabled} disabled={disabled} />
    </div>
  );
}

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="mb-8">
          <div>
            <Badge variant="info" className="mb-4">
              <ShieldCheck aria-hidden="true" />
              Account center
            </Badge>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Settings</h1>
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">
              Manage your account, privacy, notifications, sessions, and data controls.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[18rem_1fr]">
          <aside className="h-fit rounded-lg border bg-card p-3">
            {[
              "Account",
              "Privacy",
              "Notifications",
              "Security",
              "Billing",
              "Connected Accounts",
              "Export Data",
              "Delete Account"
            ].map((item) => (
              <a
                key={item}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              >
                {item}
              </a>
            ))}
          </aside>

          <div className="grid gap-5">
            <Card id="account" variant="elevated">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SectionIcon icon={UserRound} />
                  <div>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Your visible account identity.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user.name ?? ""} placeholder="Add your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email ?? ""} disabled />
                </div>
              </CardContent>
            </Card>

            <Card id="privacy">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SectionIcon icon={LockKeyhole} />
                  <div>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>Control how much data AegisLore uses to personalize guidance.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <SettingRow
                  title="Use activity for recommendations"
                  description="Allow recent activity to improve your dashboard guidance."
                  enabled
                />
                <SettingRow
                  title="Product improvement data"
                  description="Share limited usage patterns to improve reliability and design."
                />
              </CardContent>
            </Card>

            <Card id="notifications">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SectionIcon icon={Bell} />
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose when AegisLore should contact you.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <SettingRow title="Important alerts" description="Send a notice when something needs attention." enabled />
                <SettingRow title="Weekly summary" description="Receive a calm summary of score changes and next steps." />
                <SettingRow title="Product updates" description="Occasional updates about new account safety features." />
              </CardContent>
            </Card>

            <Card id="security" variant="elevated">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SectionIcon icon={KeyRound} />
                  <div>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Authentication and session safeguards.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">Database-backed sessions</Badge>
                  <Badge variant="info">Passwordless email supported</Badge>
                  <Badge variant="subtle">OAuth ready</Badge>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Session Management</h3>
                  <div className="mt-3 grid gap-3">
                    {sessions.map((session) => (
                      <div key={session.device} className="flex items-center justify-between gap-4 rounded-lg border bg-background p-4">
                        <div className="flex items-center gap-3">
                          <MonitorCheck aria-hidden="true" className="size-5 text-primary" />
                          <div>
                            <p className="font-medium">{session.device}</p>
                            <p className="text-sm text-muted-foreground">{session.location}</p>
                          </div>
                        </div>
                        <Badge variant={session.lastActive === "Active now" ? "success" : "subtle"}>
                          {session.lastActive}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="billing">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SectionIcon icon={CreditCard} />
                  <div>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Plan and payment details.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-background p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-medium">Free plan</p>
                      <p className="mt-1 text-sm text-muted-foreground">Billing integration has not been connected yet.</p>
                    </div>
                    <Badge variant="subtle">Free</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="connected-accounts">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SectionIcon icon={Link2} />
                  <div>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>Authentication providers connected to this account.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                {connectedAccounts.map((account) => (
                  <div key={account.provider} className="flex items-center justify-between gap-4 rounded-lg border bg-background p-4">
                    <div>
                      <p className="font-medium">{account.provider}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{account.status}</p>
                    </div>
                    <Badge variant="subtle">Configured in auth</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card id="export-data">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <SectionIcon icon={Download} />
                  <div>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Request a copy of your account data.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col justify-between gap-4 rounded-lg border bg-background p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-medium">Portable account export</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Future exports should include profile, settings, alerts, and score history.
                    </p>
                  </div>
                  <Button disabled variant="outline">
                    <Database aria-hidden="true" />
                    Export coming soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card id="delete-account" className="border-primary/30">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Trash2 aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Delete Account</CardTitle>
                    <CardDescription>Permanently remove your account and related data.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-medium text-primary">Deletion is permanent</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        A production delete flow should require confirmation, re-authentication, and an audit record.
                      </p>
                    </div>
                    <Button disabled variant="destructive">
                      <Trash2 aria-hidden="true" />
                      Delete coming soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
