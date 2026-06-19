import { AppPageShell } from "@/components/layout/app-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <AppPageShell>
      <div className="mb-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-64" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      </div>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,16rem)_1fr]">
        <Skeleton className="h-40" />
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-24" />
          ))}
        </div>
      </section>
    </AppPageShell>
  );
}
