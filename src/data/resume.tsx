import { Icons } from "@/components/icons";
import { HomeIcon, DownloadIcon } from "lucide-react";

export const DATA = {
  name: "Charuvarthan",
  initials: "T",
  url: "https://charuvarthan-t.github.io",
  location: "India",
  locationLink: "https://www.google.com/maps/place/India",
  description:
    "Developer obsessed with how things work under the hood whether it's systems, networks, or AI. Just learning, Just shipping.",

  summary:
    "I'm Charuvarthan, a developer who never really fit into the easy lane. What hooked me wasn't just writing code it was the chase of making systems smarter, faster, and harder to break. Somewhere along the way, I found myself publishing research on LSTMs for battery systems, diving into CS fundamentals like they were boss fights, and grinding LeetCode like it's a sport. For me, tech isn't just about building apps it's about shaping ideas into systems that can stand tall in the real world. Whether it's system design, operating systems, or AI, I'm in it for the depth, the grind, and the fun of solving problems that actually matter.",
  avatarUrl: "/me.jpeg",

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/resume.pdf", icon: DownloadIcon, label: "Resume" },
  ],
  contact: {
    email: "charuvarthan@email.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Charuvarthan-T",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/charuvarthan-t/",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:charuvarthan05@email.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  // technicalExperience: [
  //   {
  //     company: "Your Company",
  //     href: "#",
  //     badges: [],
  //     location: "Remote",
  //     title: "Your Role",
  //     logoUrl: "/your-logo.png",
  //     start: "2025",
  //     end: "Present",
  //     bullets: [
  //       "Describe your work or achievements here."
  //     ],
  //   },
  // ],

  education: [
    {
      school: "Amrita Vishwa Vidyapeetham",
      // href: "https://www.amrita.edu",
      degree: "Bachelor of Technology in Artificial intelligence Engineering",
      logoUrl: "/cityuhk.jpg",
      start: "2023",
      end: "2027",
    },
  ],


projects: [
  {
    title: "Raseed – AI Receipt Manager",
    href: "https://github.com/TensorTroops/Raseed",
    dates: "2025 - Present",
    active: true,
    description:
      "An AI-powered receipt management system with Google Wallet integration, Firebase backend, and Gemini 2.5 Pro for enriched insights and intelligent financial graphs.",
    technologies: [
      "Flutter",
      "FastAPI",
      "Firebase",
      "Gemini Pro",
      "Knowledge Graphs",
    ],
    links: [
      {
        type: "Source",
        href: "https://github.com/TensorTroops/Raseed",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
  {
    title: "LegalSphere",
    href: "https://github.com/Charuvarthan-T/LegalSphere",
    dates: "2025 - Present",
    active: true,
    description:
      "A Flutter-based legal assistant app designed to simplify legal research, case tracking, and document management with AI-driven suggestions.",
    technologies: [
      "Dart",
      "Flutter",
      "AI",
      "Firebase",
    ],
    links: [
      {
        type: "Source",
        href: "https://github.com/Charuvarthan-T/LegalSphere",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
  {
    title: "CodeProctor",
    href: "https://github.com/TeamKraken-D03/codeproctor",
    dates: "2025",
    active: false,
    description:
      "A TypeScript-based proctoring and evaluation system for coding assessments, designed for fairness, scalability, and real-time monitoring.",
    technologies: [
      "TypeScript",
      "Next.js",
      "Node.js",
      "WebSockets",
    ],
    links: [
      {
        type: "Source",
        href: "https://github.com/TeamKraken-D03/codeproctor",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
  {
    title: "ws-load",
    href: "https://github.com/Charuvarthan-T/ws-load",
    dates: "2025",
    active: true,
    description:
      "A high-performance WebSocket load testing tool built in Go, capable of simulating thousands of concurrent connections for benchmarking real-time systems.",
    technologies: [
      "Go",
      "WebSockets",
      "Performance Testing",
    ],
    links: [
      {
        type: "Source",
        href: "https://github.com/Charuvarthan-T/ws-load",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
  {
    title: "Caching Proxy Server",
    href: "https://github.com/Charuvarthan-T/Caching-Proxy-server",
    dates: "2024",
    active: false,
    description:
      "A Python-based caching proxy server designed to optimize response times by storing frequently accessed resources and reducing redundant network calls.",
    technologies: [
      "Python",
      "Networking",
      "Caching",
    ],
    links: [
      {
        type: "Source",
        href: "https://github.com/Charuvarthan-T/Caching-Proxy-server",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
],



publications: [
  {
    theme: "Research Papers",
    papers: [
      {
        title: "LSTM-Driven State of Charge Estimation for Battery Management",
        venue: "2024 IEEE 11th Power India International Conference (PIICON), Jaipur, India",
        year: 2024,
        description: "Published research on using LSTM networks for accurate state-of-charge prediction in electric vehicle batteries.",
        link: "https://ieeexplore.ieee.org/document/10995078",
        number: 1,
      },
    ],
  },
],

books: [
  {
    theme: "LeetCode Battles",
    books: [
      {
        title: "800+ Problems Solved",
        author: "Problem solving — dynamic programming, graphs, and advanced algorithms.",
        number: 1,
      },
      {
        title: "Hard Problem Kills",
        author: "Cracked complex graph/DP challenges and optimized brute-force solutions into O(n log n) power moves.",
        number: 2,
      },
    ],
  },
  {
    theme: "Research Sparks",
    books: [
      {
        title: "IEEE Paper – LSTM-Driven SOC Estimation",
        author: "Published at PIICON 2024 — leveraging LSTM networks for accurate state-of-charge prediction in EV batteries.",
        number: 3,
      },
      {
        title: "Knowledge Graph Systems",
        author: "Engineering ontology-driven AI assistants to parse and connect scientific knowledge at scale.",
        number: 4,
      },
    ],
  },
  {
    theme: "FAANG Fundamentals",
    books: [
      {
        title: "System Design",
        author: "Studying distributed systems, scalability, caching, and high availability for FAANG-level interviews.",
        number: 5,
      },
      {
        title: "Operating Systems",
        author: "Digging deep into processes, scheduling, memory management, and synchronization.",
        number: 6,
      },
      {
        title: "Computer Networks",
        author: "Mastering TCP/IP, routing, DNS, HTTP/2, and WebSockets — the backbone of real-time systems.",
        number: 7,
      },
      {
        title: "Databases & Beyond",
        author: "From SQL and indexing to NoSQL, Firestore internals, and Kafka for streaming data pipelines.",
        number: 8,
      },
    ],
  },
  {
    theme: "Hackathon Heat",
    books: [
      {
        title: "GenderX AI Hackathon",
        author: "🏆 Winner — built AI-driven solutions for gender inclusivity with impact-focused design.",
        number: 9,
      },
      {
        title: "Google Cloud Agentic AI Day",
        author: "⚡ Breakthrough Concept Award — recognized for next-gen agentic AI design.",
        number: 10,
      },
    ],
  },
  {
    theme: "Vision Sparks",
    books: [
      {
        title: "Graph-Driven Future",
        author: "Passionate about using knowledge graphs + AI to map complex systems for developers and scientists.",
        number: 11,
      },
      {
        title: "Personal Philosophy",
        author: "Grind like an engineer, think like a researcher, ship like a founder.",
        number: 12,
      },
    ],
  },
],



} as const;
