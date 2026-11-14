"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export function PerspectiveReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: .08 });
  const reduce = useReducedMotion();
  return <motion.div ref={ref} className={className} data-perspective-reveal
    initial={false}
    animate={visible || reduce ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(4px)" }}
    transition={{ duration: reduce ? 0 : .5, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>;
}
