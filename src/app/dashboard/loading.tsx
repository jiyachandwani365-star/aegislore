import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-4 h-10 w-full max-w-xl" />
          <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
        </div>
        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          {[0, 1].map((item) => (
            <Card key={item}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-28" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-3 w-full" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {[0, 1, 2].map((child) => (
                    <Skeleton key={child} className="h-24" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-56" />
          ))}
        </section>
      </main>
    </div>
  );
}
