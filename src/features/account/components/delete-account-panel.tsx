"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";

import { deleteAccount, type DeleteAccountState } from "@/features/account/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: DeleteAccountState = {};

export function DeleteAccountPanel({ userEmail }: Readonly<{ userEmail: string }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(deleteAccount, initialState);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-medium">Deletion is permanent</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            This removes your account, sessions, connected providers, and saved scam checks.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} type="button" variant="destructive">
          <Trash2 aria-hidden="true" />
          Delete account
        </Button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label="Close delete account dialog"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              if (!isPending) {
                setIsOpen(false);
              }
            }}
            type="button"
          />
          <div
            aria-labelledby="delete-account-title"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-lift"
            role="dialog"
          >
            <h3 className="text-heading-md" id="delete-account-title">
              Delete your account?
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This action cannot be undone. Confirm your email and type DELETE to permanently remove your account.
            </p>

            <form action={formAction} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delete-email">Email</Label>
                <Input
                  autoComplete="email"
                  defaultValue={userEmail}
                  id="delete-email"
                  name="email"
                  required
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-confirmation">Type DELETE to confirm</Label>
                <Input
                  autoComplete="off"
                  id="delete-confirmation"
                  name="confirmation"
                  placeholder="DELETE"
                  required
                  type="text"
                />
              </div>

              {state.error ? <p className="text-sm text-primary">{state.error}</p> : null}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button disabled={isPending} onClick={() => setIsOpen(false)} type="button" variant="outline">
                  Cancel
                </Button>
                <Button disabled={isPending} type="submit" variant="destructive">
                  {isPending ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Trash2 aria-hidden="true" />}
                  {isPending ? "Deleting..." : "Delete account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
