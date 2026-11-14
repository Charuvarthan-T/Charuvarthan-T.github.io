"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./pursuit-timeline.module.css";

export function PursuitTimeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return <ul ref={ref} data-timeline-started={started} className={`${styles.timeline} mb-4 ml-4 divide-y divide-dashed border-l`}>{children}</ul>;
}
