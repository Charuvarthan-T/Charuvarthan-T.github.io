"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const SectionRevealContext = createContext(false);
export const useSectionReveal = () => useContext(SectionRevealContext);

export function ScrollSection({ children, id, className }: { children: ReactNode; id: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: false, amount: "some" });
  const reduce = useReducedMotion();
  return (
    <motion.section ref={ref} id={id} className={className} data-scroll-section
      initial={false}
      animate={reduce || visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 6, filter: "blur(6px)" }}
      transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}>
      <SectionRevealContext.Provider value={true}>{children}</SectionRevealContext.Provider>
    </motion.section>
  );
}
