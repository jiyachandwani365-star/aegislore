import Link from "next/link";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import type { NotificationFilters, NotificationReadFilter, NotificationSeverityFilter } from "@/features/notifications";

const severityOptions: Array<{ label: string; value: NotificationSeverityFilter }> = [
  { label: "All", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" }
];

const readOptions: Array<{ label: string; value: NotificationReadFilter }> = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" }
];

export function NotificationFilterTabs({ filters }: Readonly<{ filters: NotificationFilters }>) {
  return (
    <div className="space-y-5">
      <FilterGroup
        activeValue={filters.severity}
        buildHref={(value) => hrefFor({ ...filters, severity: value })}
        label="Severity"
        options={severityOptions}
      />
      <FilterGroup
        activeValue={filters.read}
        buildHref={(value) => hrefFor({ ...filters, read: value })}
        label="Status"
        options={readOptions}
      />
    </div>
  );
}

function FilterGroup<TValue extends string>({
  label,
  options,
  activeValue,
  buildHref
}: Readonly<{
  label: string;
  options: Array<{ label: string; value: TValue }>;
  activeValue: TValue;
  buildHref: (value: TValue) => Route;
}>) {
  return (
    <div>
      <p className="mb-2 text-caption text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            asChild
            size="sm"
            variant={activeValue === option.value ? "default" : "quiet"}
          >
            <Link href={buildHref(option.value)}>{option.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

function hrefFor(filters: NotificationFilters): Route {
  const params = new URLSearchParams();

  if (filters.severity !== "all") {
    params.set("severity", filters.severity);
  }

  if (filters.read !== "all") {
    params.set("read", filters.read);
  }

  const query = params.toString();

  return (query ? `/notifications?${query}` : "/notifications") as Route;
}
