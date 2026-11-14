"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const EthicsQuote = dynamic(() => import("@/components/ethics-quote").then(mod => mod.EthicsQuote), { ssr: false });
const TechStack = dynamic(() => import("@/components/tech-stack").then(mod => mod.TechStack), { ssr: false });
const TimelineItem = dynamic(() => import("@/components/resume-card").then(mod => mod.TimelineItem), { ssr: false });
const ContactOrbiting = dynamic(() => import("@/components/contact-orbiting").then(mod => mod.ContactOrbiting), { ssr: false });

const WorldMap = dynamic(() => import("@/components/world-map").then(mod => mod.WorldMap), { ssr: false });
const BlurFade = dynamic(() => import("@/components/magicui/blur-fade").then(mod => mod.default), { ssr: false });
const BlurFadeText = dynamic(() => import("@/components/magicui/blur-fade-text").then(mod => mod.default), { ssr: false });
const ProjectCard = dynamic(() => import("@/components/project-card").then(mod => mod.ProjectCard), { ssr: false });
const BookCard = dynamic(() => import("@/components/book-card").then(mod => mod.BookCard), { ssr: false });
const TableOfContents = dynamic(() => import("@/components/table-of-contents").then(mod => mod.default), { ssr: false });
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import { useEffect, useState } from "react";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  // LeetCode stats state and fetch logic
  const [leetcode, setLeetcode] = useState({
    totalSolved: 0,
    streak: 0,
    contribution: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    async function fetchLeetcode() {
      try {
        const res = await fetch("https://leetcode-stats-api.herokuapp.com/Charuvarthan");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as {
          totalSolved?: number;
          contestAttended?: number;
          contributionPoints?: number;
        };
        setLeetcode({
          totalSolved: data.totalSolved || 805,
          streak: data.contestAttended || 0, // fallback if streak not available
          contribution: data.contributionPoints || 0,
          loading: false,
          error: false,
        });
      } catch {
        setLeetcode(l => ({ ...l, loading: false, error: true }));
      }
    }
    fetchLeetcode();
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] py-section-md">
      <TableOfContents />
      
      <section id="hero" className="mb-section-lg">
        <div className="w-full space-y-content-lg">
          <div className="gap-2 flex justify-between items-center">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Well, hello, I'm ${DATA.name.split(" ")[0]}.`}
              />
              <BlurFadeText
                className="max-w-[600px] italic text-[#876b4d] dark:text-[#c9ad87] md:text-xl"
                delay={BLUR_FADE_DELAY * 1.5}
                text={DATA.description}
              />
              <BlurFadeText
                delay={BLUR_FADE_DELAY * 2}
                className="text-sm text-muted-foreground not-italic md:text-base"
                yOffset={8}
                text={DATA.location ? `Based in ${DATA.location}.` : ''}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about" className="mb-section-lg">
        <div className="space-y-content-md">
        <BlurFade delay={BLUR_FADE_DELAY * 10}>
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl">About.</h2>
        </BlurFade>
          <div className="space-y-content-sm">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.summary.split(/(\*[^*]+\*)/g).map((part, idx) =>
              part.startsWith("*") ? <em key={idx}>{part.slice(1, -1)}</em> : part
            )}
          </p>
        </BlurFade>
          </div>
        </div>
      </section>

      <section id="achievements" className="mb-section-lg">
        <div className="space-y-content-md">
          <EthicsQuote delay={BLUR_FADE_DELAY * 15.5} />
        </div>
      </section>

      <section id="education" className="mb-section-lg">
        <div className="space-y-12">
          <BlurFade delay={BLUR_FADE_DELAY * 19}>
            <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl">Education.</h2>
          </BlurFade>
          <div className="space-y-0">
          {DATA.education.map((education, id) => (
              <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 20 + id * 0.05}>
                <TimelineItem
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                period={`${education.start} - ${education.end}`}
                  isLast={id === DATA.education.length - 1}
              />
            </BlurFade>
          ))}
        </div>
        </div>
      </section>

      <section id="tech-stack" className="mb-section-lg">
        <TechStack delay={BLUR_FADE_DELAY * 21} />
      </section>

      <section id="currently-brewing" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 22}>
            <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl">Currently Brewing.</h2>
          </BlurFade>
          <div className="max-w-[800px] mx-auto divide-y divide-border/40">
            {[
              { name: "Inksight", description: "An AI-powered journaling app that turns personal journal entries into meaningful insights and reflections." },
              { name: "Bon Appétit", description: "A cooking app that helps you make something out of whatever's in your fridge, tailored to your protein intake, calorie goals, and available time." },
            ].map((project, index) => (
              <BlurFade key={project.name} delay={BLUR_FADE_DELAY * 23 + index * 0.05}>
                <div className="grid grid-cols-1 sm:grid-cols-[0.8fr_1.4fr] items-center gap-4 sm:gap-10 py-10 sm:py-12">
                  <h3 className="font-['Georgia',serif] italic text-2xl sm:text-3xl font-normal tracking-tight text-[#876b4d] dark:text-[#c9ad87]">{project.name}</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-stone-600 dark:text-stone-400">{project.description}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 22}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Few Things That Made It Out.
                </h2>
                <p className="italic text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what else made it out on my <a href="https://github.com/Charuvarthan-T" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground transition-colors">GitHub</a>.
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 23 + id * 0.05}
              >
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="grind-journal" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 25}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  The Pursuit.
                </h2>
                <p className="italic text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The things I genuinely love getting lost in.
                </p>
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 26}>
            <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
              {DATA.pursuits.map((entry, index) => (
                <BlurFade key={entry.title} delay={BLUR_FADE_DELAY * 28 + index * 0.05}>
                  <BookCard title={entry.title} author={entry.description} number={entry.number} />
                </BlurFade>
              ))}
            </ul>
          </BlurFade>
        </div>
      </section>

      <section id="leetcode" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 29}>
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                LeetCode Stats.
              </h2>
              {leetcode.loading ? (
                <div className="text-2xl text-gray-400 mt-8">Loading...</div>
              ) : leetcode.error ? (
                <div className="flex justify-center mt-8">
                  <Button size="lg" asChild>
                    <a
                      href="https://leetcode.com/u/Charuvarthan"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Curious enough to look into my profile?
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-6">
                  <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center min-w-[260px]">
                    <span className="text-5xl font-bold text-gray-300">{leetcode.totalSolved}</span>
                    <span className="text-lg text-gray-300 mt-2">Problems Solved</span>
                  </div>
                  <a
                    href="https://leetcode.com/u/Charuvarthan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center min-w-[260px] transition hover:bg-gray-800"
                  >
                    <span className="text-2xl font-bold text-gray-300">View Profile</span>
                    <span className="text-lg text-gray-300 mt-2">Curious? Wanna peek</span>
                  </a>
                </div>
              )}
              <div className="flex justify-center mt-8">
                <img
                  src="/leetcode-heatmap.png"
                  alt="LeetCode Daily Solving Heatmap"
                  className="max-w-full h-auto rounded-lg border border-gray-700"
                />
              </div>
              <p className="text-xl text-gray-400 mt-8"></p>
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="world" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 31}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                World Map.
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Countries I want to visit and work.
              </p>
            </div>
          </div>
        </BlurFade>
          <WorldMap delay={BLUR_FADE_DELAY * 32} />
        </div>
      </section>

      <ContactOrbiting delay={BLUR_FADE_DELAY * 33} />
    </main>
  );
}