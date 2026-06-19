"use client";

import { Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { suggestedPrompts, type ChatMessage } from "@/features/ai-assistant/types";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "I can explain your score, active findings, completed fixes, and the next best action."
  }
];

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content
  };
}

export function AiAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitMessage(content: string) {
    const trimmed = content.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const userMessage = createMessage("user", trimmed);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Assistant request failed.");
      }

      const data = (await response.json()) as { message: string };
      setMessages((current) => [...current, createMessage("assistant", data.message)]);
    } catch {
      setError("The assistant could not respond. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(input);
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-4 py-4 sm:px-5">
        <p className="text-caption font-medium uppercase tracking-[0.14em] text-primary">Security coach</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Personal guidance based on your score, findings, and progress.
        </p>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <Button
              key={prompt}
              disabled={isLoading}
              onClick={() => void submitMessage(prompt)}
              size="sm"
              type="button"
              variant="outline"
            >
              {prompt}
            </Button>
          ))}
        </div>

        <div className="max-h-80 min-h-64 space-y-3 overflow-y-auto rounded-lg border bg-background p-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6",
                message.role === "assistant"
                  ? "bg-muted text-foreground"
                  : "ml-auto border border-primary/15 bg-background text-foreground"
              )}
            >
              {message.content}
            </div>
          ))}
          {isLoading ? (
            <div className="max-w-[88%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">Thinking...</div>
          ) : null}
        </div>

        {error ? <p className="text-sm text-primary">{error}</p> : null}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Textarea
            aria-label="Message"
            className="min-h-20 resize-none"
            disabled={isLoading}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your score or next step..."
            value={input}
          />
          <Button className="w-full sm:w-auto" disabled={isLoading || !input.trim()} type="submit">
            {isLoading ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Send aria-hidden="true" />}
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
