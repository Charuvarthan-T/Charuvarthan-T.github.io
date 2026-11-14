"use client";

import { ScrollSection } from "@/components/scroll-section";

export const ContactOrbiting = () => (
  <ScrollSection id="contact">
    <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">In case of a collab.</h2>
        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          I’m only around on these platforms.
        </p>
      </div>
      <div id="contact-dock-anchor" className="h-40 w-full" aria-hidden="true" />
    </div>
  </ScrollSection>
);
