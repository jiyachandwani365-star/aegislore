"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const transitions = {
  calm: { duration: 0.45, ease: "easeOut" },
  quick: { duration: 0.22, ease: "easeOut" },
  slow: { duration: 0.7, ease: "easeOut" }
} as const;

export interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  speed?: keyof typeof transitions;
}

export function Reveal({ className, delay = 0, speed = "calm", ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions[speed], delay }}
      className={cn(className)}
      {...props}
    />
  );
}

export function FadeIn({ className, delay = 0, speed = "calm", ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...transitions[speed], delay }}
      className={cn(className)}
      {...props}
    />
  );
}
