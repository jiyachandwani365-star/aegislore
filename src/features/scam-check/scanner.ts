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
    weight: 18,
    matches: (text) => /\b(urgent|immediately|right now|act now|limited time|expires today|final notice)\b/i.test(text)
  },
  {
    label: "Threatening language",
    description: "The message says something bad will happen if you do not respond.",
    weight: 22,
    matches: (text) => /\b(suspended|locked|arrest|legal action|penalty|account closed|terminated|blocked)\b/i.test(text)
  },
  {
    label: "Unexpected reward",
    description: "The message offers a prize, refund, grant, or gift you were not expecting.",
    weight: 16,
    matches: (text) => /\b(prize|winner|gift card|reward|refund|bonus|grant|free money|cashback)\b/i.test(text)
  },
  {
    label: "Sign-in details requested",
    description: "The message asks for a password, code, or account sign-in information.",
    weight: 28,
    matches: (text) => /\b(password|passcode|verification code|one-time code|otp|login|sign in|confirm your account)\b/i.test(text)
  },
  {
    label: "Money requested",
    description: "The message asks you to pay, transfer money, or buy something unusual.",
    weight: 26,
    matches: (text) => /\b(wire transfer|bank transfer|crypto|bitcoin|gift card|payment|pay now|invoice|deposit)\b/i.test(text)
  },
  {
    label: "Suspicious link",
    description: "The message includes a link that should be checked before opening.",
    weight: 20,
    matches: (text) => hasSuspiciousLink(text)
  },
  {
    label: "Pretends to be someone trusted",
    description: "The message claims to be from a bank, delivery company, workplace, or support team.",
    weight: 18,
    matches: (text) => /\b(bank|paypal|apple|microsoft|google|amazon|netflix|delivery|support team|security team|manager|boss)\b/i.test(text)
  }
];

export function scanForScam(input: string, contentType: ScamContentType): ScamCheckResult {
  const text = input.trim();
  const detected = detectors.filter((detector) => detector.matches(text));
  const typeAdjustment = contentType === "url" && hasAnyLink(text) ? 8 : 0;
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
  if (indicators.some((indicator) => indicator.label === "Sign-in details requested") && score >= 48) {
    return "Critical";
  }

  if (score >= 72) {
    return "Critical";
  }

  if (score >= 50) {
    return "High";
  }

  if (score >= 30) {
    return "Medium";
  }

  if (score >= 12) {
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

function hasSuspiciousLink(text: string) {
  if (!hasAnyLink(text)) {
    return false;
  }

  return /(bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|ow\.ly|click|verify|secure|login|account|[0-9]{1,3}(?:\.[0-9]{1,3}){3})/i.test(text);
}
