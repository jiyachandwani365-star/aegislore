import type { AiAssistantRequest, AiAssistantResponse, AiAssistantService } from "@/server/ai/types";

class LocalAiAssistantService implements AiAssistantService {
  async generateResponse(request: AiAssistantRequest): Promise<AiAssistantResponse> {
    const latestMessage = request.messages.at(-1)?.content.trim().toLowerCase() ?? "";

    return {
      message: responseFor(latestMessage, request.securityContext)
    };
  }
}

let assistantService: AiAssistantService = new LocalAiAssistantService();

export function getAiAssistantService() {
  return assistantService;
}

export function setAiAssistantService(service: AiAssistantService) {
  assistantService = service;
}

function responseFor(message: string, context: AiAssistantRequest["securityContext"]) {
  const nextAction = context.rankedActions.at(0);
  const activeFindings = context.activeFindings;
  const completedFixes = context.completedFixes.slice(0, 3);

  if (!message) {
    return coachSummary(context);
  }

  if (message.includes("safe")) {
    return `Your current score is ${context.currentScore}, which is ${context.severity} risk. You have ${activeFindings.length} active finding${activeFindings.length === 1 ? "" : "s"}. ${nextAction ? nextActionSentence(context.currentScore, nextAction) : "No high-impact fixes are waiting right now."}`;
  }

  if (message.includes("explain") || message.includes("score")) {
    return explainScore(context);
  }

  if (message.includes("improve")) {
    return nextAction
      ? `${nextActionSentence(context.currentScore, nextAction)} After that, continue with actions ranked by security improvement per effort: ${context.rankedActions
          .slice(1, 3)
          .map((action) => `${action.title} (${action.estimatedCompletionTime})`)
          .join(", ") || "no additional fixes are currently recommended"}.`
      : "You do not have a high-impact fix waiting right now. Keep reviewing your accounts weekly so changes are caught early.";
  }

  if (message.includes("first")) {
    return nextAction
      ? `Fix this first: ${nextAction.title}. It is the highest security gain for the least effort. ${nextActionSentence(context.currentScore, nextAction)}`
      : "There is no urgent first fix right now. Your next useful step is to run another health check after your account settings change.";
  }

  if (message.includes("finding") || message.includes("issue")) {
    return explainFindings(activeFindings);
  }

  if (message.includes("done") || message.includes("completed") || message.includes("fixed")) {
    return completedFixes.length > 0
      ? `Recently completed fixes: ${completedFixes.map((fix) => `${fix.title} on ${fix.date}`).join("; ")}. These improvements help reduce old account exposure and recovery risk.`
      : "I do not see completed fixes yet. Once you close an issue or improve an account, it will become part of your security journey.";
  }

  return coachSummary(context);
}

function coachSummary(context: AiAssistantRequest["securityContext"]) {
  const nextAction = context.rankedActions.at(0);

  if (!nextAction) {
    return `Your score is ${context.currentScore}. I do not see a high-impact fix waiting right now. Keep your review streak going and check again after any account changes.`;
  }

  return `${nextActionSentence(context.currentScore, nextAction)} This is ranked first because it gives the highest security improvement for the effort required.`;
}

function nextActionSentence(currentScore: number, action: AiAssistantRequest["securityContext"]["rankedActions"][number]) {
  return `You can increase your score from ${currentScore} to ${action.projectedScore} by completing "${action.title}". This takes approximately ${action.estimatedCompletionTime} and is ${action.difficulty} effort.`;
}

function explainScore(context: AiAssistantRequest["securityContext"]) {
  const findings = context.activeFindings;

  if (findings.length === 0) {
    return `Your score is ${context.currentScore}. I do not see active findings lowering it right now.`;
  }

  const findingSummary = findings
    .map((finding) => `${finding.label}: ${finding.explanation} Fixing it could add about ${Math.round(finding.impactIfFixed)} points.`)
    .join(" ");

  return `Your score is ${context.currentScore}. It is mainly shaped by these active findings. ${findingSummary}`;
}

function explainFindings(findings: AiAssistantRequest["securityContext"]["activeFindings"]) {
  if (findings.length === 0) {
    return "I do not see active findings right now. That means the current health check is not showing obvious account-safety gaps.";
  }

  return findings
    .map(
      (finding) =>
        `${finding.label}: ${finding.whyThisMatters} Estimated improvement if fixed: ${Math.round(finding.impactIfFixed)} points.`
    )
    .join(" ");
}
