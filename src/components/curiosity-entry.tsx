"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "curiosity-gambit:entered:v1";

export default function CuriosityEntry() {
  const pathname = usePathname();
  const [Gate, setGate] = useState<ComponentType<{ onEnter: () => void }> | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Preserve direct links into the portfolio. No JS or a failed import leaves it open.
    if (pathname !== "/" || window.location.hash) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch { /* Storage restrictions must never block access. */ }
    let cancelled = false;
    import("./curiosity-gate").then(module => {
      if (!cancelled) setGate(() => module.default);
    }).catch(() => { /* Progressive enhancement: fail open. */ });
    return () => { cancelled = true; };
  }, [pathname]);

  const enter = useCallback(() => {
    setEntered(true);
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* Optional persistence. */ }
  }, []);

  useEffect(() => {
    if (!entered) return;
    const main = document.querySelector("main");
    if (main) {
      main.classList.add("portfolio-entry-focus");
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
    }
  }, [entered]);

  return Gate && !entered && pathname === "/" ? <Gate onEnter={enter} /> : null;
}
