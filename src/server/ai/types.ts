import type { SecurityCoachContext } from "@/features/ai-assistant/security-coach-context";

export interface AiAssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiAssistantRequest {
  messages: AiAssistantMessage[];
  userId: string;
  securityContext: SecurityCoachContext;
}

export interface AiAssistantResponse {
  message: string;
}

export interface AiAssistantService {
  generateResponse(request: AiAssistantRequest): Promise<AiAssistantResponse>;
}
