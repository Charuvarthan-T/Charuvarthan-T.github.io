"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface EthicsQuoteProps {
  delay?: number;
}

export const EthicsQuote = ({ delay = 0 }: EthicsQuoteProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay + 0.2,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="space-y-content-md"
    >
      {/* Section title */}
      <h2 className="text-xl font-bold">Rare moments</h2>

      {/* Achievements list */}
      <motion.div
        variants={textVariants}
        className="space-y-content-sm"
      >
        <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground dark:text-muted-foreground">
<li><strong>GenderX AI Hackathon</strong> — Winner. (had to move to a new city for the first time to do something useful)</li>
<li><strong>Google Cloud Agentic AI Day</strong> — Breakthrough Concept Award. 30 hours of chaos and Appetizing food</li>
<li><strong>IEEE PIICON 2024</strong> — Published <em>LSTM-Driven State of Charge Estimation for Battery Management</em>. (yep in 1st year at college, long before)</li>

        </ul>
      </motion.div>
    </motion.div>
  );
}