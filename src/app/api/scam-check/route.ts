import { NextResponse } from "next/server";
import { z } from "zod";

import { createScamScan } from "@/features/scam-check/repository";
import { scanForScam } from "@/features/scam-check/scanner";
import { auth } from "@/server/auth";

const scamCheckRequestSchema = z.object({
  contentType: z.enum(["email", "sms", "url", "social", "ocr"]),
  inputText: z.string().trim().min(5).max(8_000)
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = scamCheckRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter at least a few words to check." }, { status: 400 });
  }

  const result = scanForScam(parsed.data.inputText, parsed.data.contentType);
  const scan = await createScamScan({
    userId: session.user.id,
    contentType: parsed.data.contentType,
    inputText: parsed.data.inputText,
    result
  });

  return NextResponse.json({ scan });
}
