"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [docked, setDocked] = useState(false);
  const reduce = useReducedMotion();
  const targetY = useMotionValue(0);
  const targetScale = useMotionValue(1);
  const y = useSpring(targetY, { stiffness: 160, damping: 28 });
  const scale = useSpring(targetScale, { stiffness: 160, damping: 28 });

  useEffect(() => {
    let frame = 0;
    let active = false;
    let observer: IntersectionObserver | undefined;
    const update = () => {
      frame = 0;
      const anchor = document.getElementById("contact-dock-anchor");
      const baseCenter = window.innerHeight - 44;
      const center = anchor ? anchor.getBoundingClientRect().top + anchor.offsetHeight / 2 : baseCenter;
      targetY.set(active ? Math.min(0, center - baseCenter) : 0);
      targetScale.set(active ? (window.innerWidth < 640 ? 1.05 : 1.12) : 1);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    // Contact is dynamically loaded; watch until its anchor mounts.
    const connect = () => {
      if (observer) return;
      const contact = document.getElementById("contact");
      if (!contact) return;
      observer = new IntersectionObserver(([entry]) => {
        active = entry.isIntersecting;
        setDocked(active);
        schedule();
      });
      observer.observe(contact);
      mutations.disconnect();
    };
    const mutations = new MutationObserver(connect);
    mutations.observe(document.body, { childList: true, subtree: true });
    connect();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      mutations.disconnect();
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetY, targetScale]);

  const openEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const compose = window.open("about:blank", "_blank");
    if (compose) {
      compose.opener = null;
      compose.location.replace("https://mail.google.com/mail/?view=cm&fs=1&to=charuvarthan05%40email.com");
      event.preventDefault();
    }
  };

  return (
    <>
      <div className={cn("pointer-events-none fixed bottom-0 inset-x-0 z-20 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background transition-opacity duration-500 motion-reduce:transition-none", docked && "opacity-0")} />
    <motion.div data-social-dock data-docked={docked} style={{ x: "-50%", y: reduce ? targetY : y, scale: reduce ? targetScale : scale }} className="pointer-events-none fixed left-1/2 bottom-0 z-30 mb-4 flex origin-center h-14 w-max">

      <Dock className={cn(styles.pill, docked && styles.docked, "z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background/90 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ")}>
        {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    onClick={name === "email" ? openEmail : undefined}
                    aria-label={social.name}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                  >
                    <social.icon className="size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </motion.div>
    </>
  );
}
