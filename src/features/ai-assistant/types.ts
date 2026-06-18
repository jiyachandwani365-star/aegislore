export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export const suggestedPrompts = [
  "Am I safe?",
  "Explain my score",
  "Explain active findings",
  "What should I fix first?"
] as const;
