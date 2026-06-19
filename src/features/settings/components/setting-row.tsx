"use client";

import { Switch } from "@/components/ui/switch";

export function SettingRow({
  title,
  description,
  enabled = false,
  disabled = false
}: Readonly<{ title: string; description: string; enabled?: boolean; disabled?: boolean }>) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <Switch aria-label={title} className="shrink-0" defaultChecked={enabled} disabled={disabled} />
    </div>
  );
}
