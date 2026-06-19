import type { ScamCheckResult, ScamContentType, ScamIndicator, ScamRiskLevel } from "@/features/scam-check/types";

interface Detector {
  label: string;
  description: string;
  weight: number;
  matches(text: string): boolean;
}

const detectors: Detector[] = [
  {
    label: "Urgent pressure",
    description: "The message pushes you to act immediately.",
    weight: 20,
    matches: (text) =>
      /\b(urgent|urgently|immediately|right now|act now|limited time|expires today|final notice|don't wait|do not wait|hurry|asap|within 24 hours)\b/i.test(
        text
      )
  },
  {
    label: "Threatening language",
    description: "The message says something bad will happen if you do not respond.",
    weight: 24,
    matches: (text) =>
      /\b(suspended|locked|arrest|legal action|penalty|account closed|terminated|blocked|unauthorized|compromised)\b/i.test(
        text
      )
  },
  {
    label: "Unexpected reward",
    description: "The message offers a prize, refund, grant, or gift you were not expecting.",
    weight: 20,
    matches: (text) =>
      /\b(prizes?|winners?|won|gift cards?|rewards?|refunds?|bonuses?|grants?|free money|cashback|claim(?:ing)?|cash prize|lottery|inheritance)\b/i.test(
        text
      )
  },
  {
    label: "Sign-in details requested",
    description: "The message asks for a password, code, or account sign-in information.",
    weight: 32,
    matches: (text) =>
      /\b(passwords?|passcodes?|verification codes?|one-time codes?|otps?|2fa codes?|security codes?|authentication codes?|pin codes?|logins?|sign[\s-]?in|confirm your account|share your code|send (us )?your (otp|code))\b/i.test(
        text
      )
  },
  {
    label: "Money requested",
    description: "The message asks you to pay, transfer money, or buy something unusual.",
    weight: 28,
    matches: (text) =>
      /\b(wire transfers?|bank transfers?|crypto|bitcoin|gift cards?|payments?|pay now|invoices?|deposits?|send money|transfer funds)\b/i.test(
        text
      )
  },
  {
    label: "Financial incentive",
    description: "The message promises a large payout, cash reward, or unrealistic financial gain.",
    weight: 22,
    matches: (text) =>
      /\b(get|receive|earn|win|claim)\b[^.]{0,30}\$?\d{3,}|\b(up to|worth|valued at)\b[^.]{0,20}\$?\d{3,}|\$\d{3,}(?:,\d{3})*|\b\d{4,}\s*\$|\b100,?000\b/i.test(
        text
      )
  },
  {
    label: "Link prompt",
    description: "The message tells you to click or open a link, which is a common phishing tactic.",
    weight: 20,
    matches: (text) => hasLinkPrompt(text)
  },
  {
    label: "Suspicious link",
    description: "The message includes a link that should be checked before opening.",
    weight: 24,
    matches: (text) => hasSuspiciousLink(text)
  },
  {
    label: "Pretends to be someone trusted",
    description: "The message claims to be from a bank, delivery company, workplace, or support team.",
    weight: 20,
    matches: (text) =>
      /\b(bank|paypal|apple|microsoft|google|amazon|netflix|delivery|support teams?|security teams?|managers?|boss|irs|government|fedex|ups|dhl)\b/i.test(
        text
      )
  }
];

export function scanForScam(input: string, contentType: ScamContentType): ScamCheckResult {
  const text = input.trim();
  const detected = detectors.filter((detector) => detector.matches(text));
  const typeAdjustment = contentType === "url" && hasAnyLink(text) ? 10 : 0;
  const score = Math.min(100, detected.reduce((sum, detector) => sum + detector.weight, 0) + typeAdjustment);
  const riskLevel = riskFromScore(score, detected);
  const confidenceScore = confidenceFrom(text, detected);

  return {
    riskLevel,
    confidenceScore,
    indicators: detected.map(toIndicator),
    explanation: explanationFor(riskLevel, detected),
    recommendedAction: actionFor(riskLevel)
  };
}

function toIndicator(detector: Detector): ScamIndicator {
  return {
    label: detector.label,
    description: detector.description
  };
}

function riskFromScore(score: number, indicators: Detector[]): ScamRiskLevel {
  const labels = new Set(indicators.map((indicator) => indicator.label));
  const hasCredentialRequest = labels.has("Sign-in details requested");
  const hasLinkPrompt = labels.has("Link prompt") || labels.has("Suspicious link");
  const hasRewardSignal = labels.has("Unexpected reward") || labels.has("Financial incentive");

  if (hasCredentialRequest && (hasLinkPrompt || hasRewardSignal)) {
    return score >= 70 ? "Critical" : "High";
  }

  if (hasCredentialRequest && score >= 32) {
    return score >= 64 ? "Critical" : "High";
  }

  if (hasLinkPrompt && hasRewardSignal) {
    return score >= 56 ? "High" : "Medium";
  }

  if (score >= 68) {
    return "Critical";
  }

  if (score >= 46) {
    return "High";
  }

  if (score >= 26) {
    return "Medium";
  }

  if (score >= 8) {
    return "Low";
  }

  return "Safe";
}

function confidenceFrom(text: string, indicators: Detector[]) {
  const lengthConfidence = text.length > 120 ? 16 : text.length > 40 ? 10 : 4;
  return Math.min(98, 62 + indicators.length * 6 + lengthConfidence);
}

function explanationFor(riskLevel: ScamRiskLevel, indicators: Detector[]) {
  if (riskLevel === "Safe") {
    return "This does not show common scam signs. Still, only reply or click if you recognize the sender and expected the message.";
  }

  const names = indicators.map((indicator) => indicator.label.toLowerCase()).join(", ");
  return `This looks ${riskLevel.toLowerCase()} risk because it includes ${names}. These are common signs of messages that try to rush, scare, or mislead people.`;
}

function actionFor(riskLevel: ScamRiskLevel) {
  if (riskLevel === "Critical" || riskLevel === "High") {
    return "Do not reply, do not click links, and do not share personal information. Contact the company or person using a trusted website, app, or phone number.";
  }

  if (riskLevel === "Medium") {
    return "Pause before responding. Check the sender in another way and avoid opening links until you are sure it is real.";
  }

  if (riskLevel === "Low") {
    return "Be cautious. If anything feels unexpected, confirm it through a trusted source before taking action.";
  }

  return "No action is needed unless the message was unexpected. Keep using trusted apps or websites for sensitive tasks.";
}

function hasAnyLink(text: string) {
  return /(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(text);
}

function hasLinkPrompt(text: string) {
  return (
    hasAnyLink(text) ||
    /\b(click|tap|open|follow|visit)\b[^.]{0,24}\b(link|url|here|below|attachment)\b/i.test(text) ||
    /\bclick\s+link\b/i.test(text)
  );
}

function hasSuspiciousLink(text: string) {
  if (!hasAnyLink(text)) {
    return false;
  }

  return /(bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|ow\.ly|[0-9]{1,3}(?:\.[0-9]{1,3}){3})/i.test(text);
}
