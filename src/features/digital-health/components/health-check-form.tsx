"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  calculateDigitalHealthScore,
  type DeviceSecurityStatus
} from "@/features/digital-health/scoring";
import { ScoreBreakdown } from "@/features/digital-health/components/score-breakdown";

export function HealthCheckForm({ focus }: Readonly<{ focus?: string }>) {
  const [passwordReuse, setPasswordReuse] = useState(focus === "passwords");
  const [knownBreachExposure, setKnownBreachExposure] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(75);
  const [emailExposure, setEmailExposure] = useState(focus === "old-accounts");
  const [deviceSecurity, setDeviceSecurity] = useState<DeviceSecurityStatus>(
    focus === "recovery" ? "needs_review" : "unknown"
  );

  const result = useMemo(
    () =>
      calculateDigitalHealthScore({
        passwordReuse,
        knownBreachExposure,
        mfaEnabled,
        passwordStrength,
        emailExposure,
        deviceSecurity
      }),
    [deviceSecurity, emailExposure, knownBreachExposure, mfaEnabled, passwordReuse, passwordStrength]
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Health check</CardTitle>
          <CardDescription>Answer a few plain questions to calculate your current score.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SettingSwitch
            checked={passwordReuse}
            description="Turn this on if you know the same password is used on more than one important account."
            label="I reuse passwords"
            onChange={setPasswordReuse}
          />
          <SettingSwitch
            checked={knownBreachExposure}
            description="Turn this on if an account or password was found in a known breach."
            label="I have known breach exposure"
            onChange={setKnownBreachExposure}
          />
          <SettingSwitch
            checked={mfaEnabled}
            description="Turn this on if your important accounts use multi-factor authentication."
            label="MFA is enabled"
            onChange={setMfaEnabled}
          />
          <SettingSwitch
            checked={emailExposure}
            description="Turn this on if your email appears in many old or unused accounts."
            label="My email has broad exposure"
            onChange={setEmailExposure}
          />
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="password-strength">Password strength</Label>
                <p className="mt-1 text-sm text-muted-foreground">Estimate the strength of your current passwords.</p>
              </div>
              <Badge variant="outline">{passwordStrength}</Badge>
            </div>
            <Input
              className="mt-4"
              id="password-strength"
              max={100}
              min={0}
              onChange={(event) => setPasswordStrength(Number(event.target.value))}
              type="range"
              value={passwordStrength}
            />
          </div>
          <div className="rounded-lg border bg-background p-4">
            <Label htmlFor="device-security">Device security</Label>
            <p className="mt-1 text-sm text-muted-foreground">Choose the best current description.</p>
            <select
              className="mt-4 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              id="device-security"
              onChange={(event) => setDeviceSecurity(event.target.value as DeviceSecurityStatus)}
              value={deviceSecurity}
            >
              <option value="unknown">I am not sure</option>
              <option value="secure">Reviewed and secure</option>
              <option value="needs_review">Needs review</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <ScoreBreakdown result={result} />
        <Card>
          <CardContent className="p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              This breakdown is an estimate based on your answers. It is meant to help you choose the next practical step.
            </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/dashboard">
              Back to dashboard
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingSwitch({
  checked,
  description,
  label,
  onChange
}: Readonly<{ checked: boolean; description: string; label: string; onChange: (checked: boolean) => void }>) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-background p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <Switch aria-label={label} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
