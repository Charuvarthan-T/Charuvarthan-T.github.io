"use client";

import { ScrollSection } from "@/components/scroll-section";
import { useId } from "react";
import styles from "./contact-orbiting.module.css";

export const ContactOrbiting = () => {
  const arrowMask = useId();
  return (
    <ScrollSection id="contact">
      <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full">
        <div className="space-y-3">
          <p className="mx-auto max-w-[600px] text-sm text-muted-foreground sm:text-base">
            I wouldn’t say get in touch, but
          </p>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">In case you’re up for a collaboration.</h2>
        </div>
        <div id="contact-dock-anchor" className="relative h-40 w-full" aria-hidden="true">
          <svg className={styles.arrow} viewBox="0 0 420 160" fill="none" preserveAspectRatio="none" focusable="false">
            <defs>
              <mask id={arrowMask} maskUnits="userSpaceOnUse" x="0" y="0" width="420" height="160">
                <path className={styles.reveal} pathLength="1" d="M88 3 C31 8 9 82 65 80" stroke="white" strokeWidth="6" />
              </mask>
            </defs>
            <path d="M88 3 C31 8 9 82 65 80" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 7" mask={`url(#${arrowMask})`} />
            <path className={styles.head} d="M57 74 L66 80 L58 86" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </ScrollSection>
  );
};
