import { NextResponse } from "next/server";
import { z } from "zod";

import { getSecurityCoachContext } from "@/features/ai-assistant/security-coach-context";
import { getAiAssistantService } from "@/server/ai";
import { auth } from "@/server/auth";

const assistantRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2_000)
      })
    )
    .min(1)
    .max(20)
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = assistantRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const response = await getAiAssistantService().generateResponse({
    messages: parsed.data.messages,
    userId: session.user.id,
    securityContext: getSecurityCoachContext()
  });

  return NextResponse.json(response);
}
