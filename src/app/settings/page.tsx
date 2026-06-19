import {
  CreditCard,
  Link2,
  MonitorCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { DeleteAccountPanel } from "@/features/account/components/delete-account-panel";
import { ExportDataPanel } from "@/features/account/components/export-data-panel";
import { SettingRow } from "@/features/settings/components/setting-row";
import { AppPageHeader, AppPageShell } from "@/components/layout/app-page";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Settings"
};

const navItems = [
  "Account",
  "Privacy",
  "Notifications",
  "Security",
  "Billing",
  "Connected Accounts",
  "Export Data",
  "Delete Account"
] as const;

const connectedAccounts = [
  { provider: "Google", status: "Available when configured" },
  { provider: "Email magic link", status: "Passwordless sign-in" }
];

const sessions = [{ device: "Current browser", location: "This session", lastActive: "Active now" }];

function SettingsSection({
  id,
  title,
  description,
  children
}: Readonly<{ id: string; title: string; description: string; children: ReactNode }>) {
  return (
    <section className="scroll-mt-24 border-t py-5 first:border-t-0 first:pt-0" id={id}>
      <div className="mb-4 max-w-2xl">
        <h2 className="text-heading-md">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon: Icon,
  title,
  detail,
  badge
}: Readonly<{ icon: LucideIcon; title: string; detail: string; badge?: string }>) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      </div>
      {badge ? (
        <Badge className="w-fit shrink-0" variant="subtle">
          {badge}
        </Badge>
      ) : null}
    </div>
  );
}

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <AppPageShell>
      <AppPageHeader
        description="Manage your account, privacy, notifications, sessions, and data controls."
        eyebrow="Account"
        title="Settings"
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="min-w-0 xl:sticky xl:top-28 xl:self-start">
          <nav
            aria-label="Settings sections"
            className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 xl:mx-0 xl:flex-col xl:overflow-visible xl:px-0"
          >
            {navItems.map((item) => (
              <a
                key={item}
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <SettingsSection description="Your visible account identity." id="account" title="Account">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user.name ?? ""} placeholder="Add your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user.email ?? ""} disabled />
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            description="Control how much data AegisLore uses to personalize guidance."
            id="privacy"
            title="Privacy"
          >
            <div className="divide-y">
              <SettingRow
                description="Allow recent activity to improve your dashboard guidance."
                enabled
                title="Use activity for recommendations"
              />
              <SettingRow
                description="Share limited usage patterns to improve reliability and design."
                title="Product improvement data"
              />
            </div>
          </SettingsSection>

          <SettingsSection
            description="Choose when AegisLore should contact you."
            id="notifications"
            title="Notifications"
          >
            <div className="divide-y">
              <SettingRow description="Send a notice when something needs attention." enabled title="Important alerts" />
              <SettingRow
                description="Receive a calm summary of score changes and next steps."
                title="Weekly summary"
              />
              <SettingRow
                description="Occasional updates about new account safety features."
                title="Product updates"
              />
            </div>
          </SettingsSection>

          <SettingsSection
            description="Authentication and session safeguards."
            id="security"
            title="Security"
          >
            <div className="flex flex-wrap gap-2">
              <Badge variant="subtle">Database-backed sessions</Badge>
              <Badge variant="subtle">Passwordless email supported</Badge>
              <Badge variant="subtle">OAuth ready</Badge>
            </div>
            <Separator className="my-5" />
            <h3 className="font-medium">Session management</h3>
            <div className="mt-3 divide-y">
              {sessions.map((session) => (
                <InfoRow
                  key={session.device}
                  badge={session.lastActive}
                  detail={session.location}
                  icon={MonitorCheck}
                  title={session.device}
                />
              ))}
            </div>
          </SettingsSection>

          <SettingsSection description="Plan and payment details." id="billing" title="Billing">
            <InfoRow badge="Free" detail="Billing integration has not been connected yet." icon={CreditCard} title="Free plan" />
          </SettingsSection>

          <SettingsSection
            description="Authentication providers connected to this account."
            id="connected-accounts"
            title="Connected accounts"
          >
            <div className="divide-y">
              {connectedAccounts.map((account) => (
                <InfoRow
                  key={account.provider}
                  badge="Configured in auth"
                  detail={account.status}
                  icon={Link2}
                  title={account.provider}
                />
              ))}
            </div>
          </SettingsSection>

          <SettingsSection description="Request a copy of your account data." id="export-data" title="Export data">
            <ExportDataPanel />
          </SettingsSection>

          <SettingsSection
            description="Permanently remove your account and related data."
            id="delete-account"
            title="Delete account"
          >
            <DeleteAccountPanel userEmail={user.email ?? ""} />
          </SettingsSection>
        </div>
      </div>
    </AppPageShell>
  );
}
