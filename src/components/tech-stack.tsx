"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Grid3X3, ArrowLeft } from "lucide-react";

interface TechStackProps {
  delay?: number;
}

interface TechItem {
  name: string;
  logo: string;
}

interface TechCategory {
  category: string;
  subcategories?: {
    name: string;
    items: TechItem[];
  }[];
  items?: TechItem[];
}

const techCategories: TechCategory[] = [
  {
    category: "Languages & Environments",
    items: [
      { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
      { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Go", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
    ],
  },
  {
    category: "AI & ML",
    items: [],
  },
  {
    category: "Web Development",
    items: [
      { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    ],
  },
  {
    category: "Backend & DevOps",
    items: [
      { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" },
      { name: "FastAPI", logo: "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" },
      { name: "Django", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
      { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "Neo4j", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg" },
      { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    ],
  },
];

const aiKnowledge = ["RAG", "Reinforcement Learning (RL)", "LLMs", "Fine-tuning", "DL", "Computer Vision"];

// Flatten all items for the scrolling marquee
const allTechItems: TechItem[] = techCategories.flatMap(category =>
  category.subcategories
    ? category.subcategories.flatMap(sub => sub.items)
    : category.items || []
);

// I renamed this component to avoid a naming conflict with the main export.
const TechItemDisplay = ({ tech, showName = false }: { tech: TechItem; showName?: boolean }) => {
  return (
    <div className={`flex ${showName ? 'flex-col' : ''} items-center justify-center ${showName ? 'p-4' : 'mx-6'} group`}>
      <div className={`relative ${showName ? 'w-16 h-16' : 'w-12 h-12'} transition-all duration-300 group-hover:scale-110 opacity-70 hover:opacity-100`}>
        <Image
          src={tech.logo}
          alt={`${tech.name} logo`}
          fill
          className="object-contain filter transition-all duration-300"
          unoptimized
        />
      </div>
      {showName && (
        <span className="text-xs font-medium text-muted-foreground text-center mt-2 whitespace-nowrap">
          {tech.name}
        </span>
      )}
    </div>
  );
};

export const TechStack = ({ delay = 0 }: TechStackProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: delay,
      },
    },
  };

  // Duplicate the tech stack for seamless infinite scroll
  const duplicatedTechStack = [...allTechItems, ...allTechItems];

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="space-y-content-md"
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Tech Stacks
          </h2>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Tech I’ve dug into through the docs and put to use in projects.
          </p>
        </div>
      </div>

      {!showAll ? (
        <>
          {/* Elegant scrolling logos */}
          <div className="relative w-full overflow-hidden py-8">
            {/* Subtle gradient overlays */}
            <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background via-background/80 to-transparent" />

            {/* Floating logos */}
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, "-50%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 45,
                  ease: "linear",
                },
              }}
            >
              {duplicatedTechStack.map((tech, index) => (
                <TechItemDisplay key={`${tech.name}-${index}`} tech={tech} />
              ))}
            </motion.div>
          </div>

          {/* Icon-only Show All Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAll(true)}
              className="h-10 w-10"
              title="Show all technologies"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Organized category view */}
          <div className="max-w-6xl mx-auto py-8 space-y-12">
            {techCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-center text-foreground">
                  {category.category}
                </h3>

                {category.category === "AI & ML" && (
                  <div className="space-y-2 text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                    <p>I don’t wish to list every package I import and call it a tech stack, ik.</p>
                    <p>Comfortable with the fundamentals and the math, enough to see the bigger picture, not just the loss curve.</p>
                  </div>
                )}

                {category.subcategories ? (
                  <div className="space-y-8">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <div key={subcategory.name} className="space-y-4">
                        <h4 className="text-lg font-semibold text-muted-foreground text-center">
                          {subcategory.name}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
                          {subcategory.items.map((tech, techIndex) => (
                            <motion.div
                              key={tech.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (categoryIndex * 0.1) + (subIndex * 0.05) + (techIndex * 0.03) }}
                            >
                              <TechItemDisplay tech={tech} showName={true} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : category.items?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
                    {category.items?.map((tech, techIndex) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (categoryIndex * 0.1) + (techIndex * 0.03) }}
                      >
                        <TechItemDisplay tech={tech} showName={true} />
                      </motion.div>
                    ))}
                  </div>
                ) : null}
                {category.category === "AI & ML" && (
                  <div className="space-y-3 text-center">
                    <h4 className="text-sm font-medium text-foreground/80">Areas of Knowledge</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {aiKnowledge.map((area, index) => (
                        <motion.span key={area} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: categoryIndex * 0.1 + index * 0.03 }} className="rounded-full border border-border/50 px-3 py-1 text-xs text-foreground/80">
                          {area}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Icon-only Back Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAll(false)}
              className="h-10 w-10"
              title="Back to scrolling view"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};