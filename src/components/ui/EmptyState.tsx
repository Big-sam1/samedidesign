import React from "react";
import { motion } from "framer-motion";
import { EASE_SMOOTH } from "../../animations/variants";
import { Button } from "./Button";
import { BoxIcon } from "lucide-react";
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  onAction?: () => void;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  secondaryLabel,
  secondaryTo,
  onAction
}: EmptyStateProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.4,
    ease: EASE_SMOOTH
  }} className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-line bg-white px-6 py-14 text-center">
      <motion.span initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      delay: 0.06,
      duration: 0.35,
      ease: EASE_SMOOTH
    }} className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </motion.span>
      <h2 className="mt-6 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      {(actionLabel || secondaryLabel) && <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && actionTo && <Button to={actionTo}>{actionLabel}</Button>}
          {actionLabel && !actionTo && <Button onClick={onAction}>{actionLabel}</Button>}
          {secondaryLabel && secondaryTo && <Button to={secondaryTo} variant="secondary">
              {secondaryLabel}
            </Button>}
        </div>}
    </motion.div>;
}