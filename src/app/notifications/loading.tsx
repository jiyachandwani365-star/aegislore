import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-4 h-10 w-64" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        </div>
        <section className="grid gap-5 lg:grid-cols-[18rem_1fr]">
          <Skeleton className="h-52" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-28" />
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
