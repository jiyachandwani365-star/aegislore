"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

export function SubmitButton({ children, disabled, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending || disabled} type="submit" {...props}>
      {pending ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
      {children}
    </Button>
  );
}
