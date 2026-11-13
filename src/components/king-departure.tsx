"use client";

/* eslint-disable @next/next/no-img-element -- Repeated local SVG fragments need exact native clipping, not image optimization. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { buildGlassShards } from "@/lib/glass-shards";
import styles from "./king-departure.module.css";

export interface KingOrigin { x: number; y: number; size: number }

export default function KingDeparture({ origin, onComplete, onSkip, leaving }: {
  origin: KingOrigin;
  onComplete: () => void;
  onSkip: () => void;
  leaving: boolean;
}) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"isolate" | "fracture" | "shatter">("isolate");
  const [viewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const height = Math.min(620, viewport.width * 1.35, viewport.height * 0.68);
  const width = height * (896 / 1755);
  const [shards] = useState(() => buildGlassShards(viewport.width < 600));
  const shattering = phase === "shatter";

  useEffect(() => {
    const started = Date.now();
    const crack = setTimeout(() => setPhase("fracture"), reduce ? 0 : 1_600);
    const split = setTimeout(() => setPhase("shatter"), reduce ? 0 : 2_100);
    // Completion is timed independently of animation callbacks: rendering or
    // background-tab throttling must never leave the visitor in the gate.
    const finish = setTimeout(onComplete, reduce ? 0 : 4_600);
    const resume = () => { if (Date.now() - started >= 4_600) onComplete(); };
    document.addEventListener("visibilitychange", resume);
    return () => {
      clearTimeout(crack);
      clearTimeout(split);
      clearTimeout(finish);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [onComplete, reduce]);

  if (reduce) return null;

  return (
    <motion.div className={styles.scene} data-king-departure data-stage={phase} aria-label="The checkmated king dissolves into the portfolio" initial={{ opacity: 1 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.3 }}>
      <motion.div className={styles.curtain} initial={{ opacity: 1 }} animate={{ opacity: shattering ? 0 : 1 }} transition={{ duration: 1.45, delay: shattering ? 0.1 : 0 }} />
      <button data-cinema-skip className={styles.skip} onClick={onSkip} autoFocus>Skip this nonsense <ArrowUpRight size={14} aria-hidden="true" /></button>
      <motion.div className={styles.king} style={{ width, height }} initial={{ x: origin.x - width / 2, y: origin.y - height / 2, scale: origin.size / height }} animate={{ x: viewport.width / 2 - width / 2, y: viewport.height / 2 - height / 2, scale: 1 }} transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}>
        {!shattering ? (
          <motion.div className={styles.sculpture} initial={{ rotateY: -5 }} animate={{ rotateY: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}>
            <img className={styles.face} src="/chess/king-sculpture.png" alt="" draggable={false} />
            {phase === "fracture" && <motion.svg className={styles.cracks} viewBox="0 0 1 1" preserveAspectRatio="none" initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ duration: 0.4 }} aria-hidden="true">
              {shards.map(shard => <polygon key={shard.id} points={shard.points.map(p => p.x + "," + p.y).join(" ")} />)}
            </motion.svg>}
          </motion.div>
        ) : (
          <div className={styles.fragments} data-fragments>
            {shards.map(shard => {
              const nx = shard.cx - 0.5;
              const ny = shard.cy - 0.39;
              return <motion.div key={shard.id} className={styles.fragment} style={{ left: shard.left * width, top: shard.top * height, width: shard.width * width, height: shard.height * height, clipPath: shard.clip }} initial={{ x: 0, y: 0, rotate: 0, rotateY: 0, opacity: 1 }} animate={{ x: nx * (viewport.width < 600 ? 260 : 430), y: ny * 260 + 25, rotate: nx * 40 + ny * 12, rotateY: nx * 65, opacity: [1, 1, 0] }} transition={{ duration: 2.05, delay: Math.abs(ny) * 0.13 + Math.abs(nx) * 0.12, ease: [0.22, 0.1, 0.3, 1], opacity: { times: [0, 0.25, 1], duration: 2.05 } }}>
                <img src="/chess/king-sculpture.png" alt="" draggable={false} style={{ left: -shard.left * width, top: -shard.top * height, width, height }} />
              </motion.div>;
            })}
          </div>
        )}
      </motion.div>
      <span className={styles.status} role="status">Opening the portfolio.</span>
    </motion.div>
  );
}
