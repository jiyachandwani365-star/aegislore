import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <span
      aria-label="AegisLore"
      className={cn(
        "inline-flex size-9 items-center justify-center overflow-hidden rounded-md transition-opacity hover:opacity-90",
        className
      )}
    >
      <Image src="/aegislore-logo.png" alt="" width={36} height={36} priority className="size-9 object-cover" />
    </span>
  );
}
