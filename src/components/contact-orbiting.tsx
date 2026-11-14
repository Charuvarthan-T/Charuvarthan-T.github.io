"use client";

import { ScrollSection } from "@/components/scroll-section";
import { motion } from "framer-motion";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { Mail, Linkedin, Github } from "lucide-react";
import { DATA } from "@/data/resume";
import Link from "next/link";
import type { MouseEvent } from "react";

interface ContactOrbitingProps {
  delay?: number;
}

export const ContactOrbiting = ({ delay = 0 }: ContactOrbitingProps) => {
  const openEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    // Preserve the native mailto link for modified clicks and blocked popups.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const compose = window.open("about:blank", "_blank");
    if (compose) {
      compose.opener = null;
      compose.location.replace("https://mail.google.com/mail/?view=cm&fs=1&to=charuvarthan05%40email.com");
      event.preventDefault();
    }
  };

  const orbitingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0,
        delay: 0,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <ScrollSection id="contact">
      <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            In case of a collab.
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            I’m only around on these platforms.
          </p>
        </div>

        {/* Orbiting Circles */}
        <motion.div
          variants={orbitingVariants}
          className="relative overflow-hidden h-[500px] w-full flex items-center justify-center"
        >
          {/* Inner orbit - Email icons */}
          <OrbitingCircles radius={80} duration={15}>
            <Mail className="size-8 text-blue-600" />
            <Mail className="size-8 text-blue-600" />
            <Mail className="size-8 text-blue-600" />
          </OrbitingCircles>
          
          {/* Outer orbit - Social icons */}
          <OrbitingCircles radius={140} reverse duration={20}>
            <Linkedin className="size-8 text-blue-700" />
            <Github className="size-8 text-gray-700 dark:text-gray-300" />
          </OrbitingCircles>

          {/* Center content - clickable links */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-4">
              <a
                href={DATA.contact.social.email.url}
                onClick={openEmail}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform duration-200"
                title="Send Email"
              >
                <Mail className="size-6 text-foreground" />
              </a>
              <Link
                href={DATA.contact.social.LinkedIn.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform duration-200"
                title="Connect on LinkedIn"
              >
                <Linkedin className="size-6 text-foreground" />
              </Link>
              <Link
                href={DATA.contact.social.GitHub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-lg hover:scale-110 transition-transform duration-200"
                title="View GitHub"
              >
                <Github className="size-6 text-foreground" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </ScrollSection>
  );
}; 