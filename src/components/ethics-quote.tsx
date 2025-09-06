"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Safari } from "@/components/magicui/safari";

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

  const safariVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: delay + 0.4,
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
      <h2 className="text-xl font-bold">Achievements</h2>

      {/* Achievements list */}
      <motion.div
        variants={textVariants}
        className="space-y-content-sm"
      >
        <ul className="list-disc pl-6 text-sm text-muted-foreground dark:text-muted-foreground">
<li>Winner at GenderX AI Hackathon & recognized at Google Cloud Agentic AI Day (Breakthrough Concept Award).</li>
<li>Solved 800+ problems on LeetCode and built strong foundations in DSA & system design.</li>
<li>Published research paper on LSTM-driven battery SoC estimation at IEEE PIICON 2024.</li>
<li>Built and deployed full-stack applications integrating AI, Firebase, and Next.js.</li>
<li>Contributed to open-source projects, collaborating with global developer communities.</li>
<li>Actively learning and mastering Operating Systems, Computer Networks, and DBMS for FAANG interviews.</li>

        </ul>
      </motion.div>
    </motion.div>
  );
}