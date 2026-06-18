"use client";

import { Send, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card variant="elevated" className="h-full">
      <CardHeader>
        <Badge className="mb-3 w-fit" variant="info">
          <Sparkles aria-hidden="true" />
          Security Coach
        </Badge>
        <CardTitle className="text-xl">Security Coach</CardTitle>
        <CardDescription>Personal guidance based on your score, findings, and progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  ? "bg-secondary text-secondary-foreground"
                  : "ml-auto bg-primary text-primary-foreground"
              )}
            >
              {message.content}
            </div>
          ))}
          {isLoading ? (
            <div className="max-w-[88%] rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">
              Thinking...
            </div>
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
          <Button className="w-full" disabled={isLoading || !input.trim()} type="submit">
            <Send aria-hidden="true" />
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
