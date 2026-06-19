import { AppPageShell } from "@/components/layout/app-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <AppPageShell>
      <div className="mb-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-10 w-full max-w-xl" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </div>
      <section className="grid gap-6 xl:grid-cols-[1fr_minmax(16rem,22rem)]">
        <Skeleton className="h-56" />
        <Skeleton className="h-24" />
      </section>
      <section className="mt-6">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-4 h-64" />
      </section>
    </AppPageShell>
  );
}
