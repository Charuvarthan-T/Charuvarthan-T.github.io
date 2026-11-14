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
    "I try my best to write clean code, or at least try to keep the chaos within engineering principles. My product ideas outnumber my finished projects by a large margin, some rest in repos with nothing but initial commits, while others fade from my own memory, lost somewhere in the abyss of ideas I'll probably never remember (have a really *bad memory*). Usually found committing at night, somewhere between midnight motivation and the *insomnia* I suffer from.",
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
      degree: "Bachelor of Technology, Computer Science and Artificial Intelligence Engineering",
      logoUrl: "/cityuhk.jpg",
      start: "2023",
      end: "2027",
    },
  ],


projects: [
  {
    title: "Raseed: AI Receipt Manager",
    href: "https://github.com/TensorTroops/Raseed",
    dates: "2025 - Present",
    active: true,
    description:
      "An AI-powered receipt manager with Google Wallet integration and intelligent financial insights. A hackathon-recognized project.",
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
      "An AI-powered legal assistant for research, case tracking, and document management. A hackathon-recognized project.",
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
      "A real-time coding assessment platform used by numerous students in coding contests, built for secure proctoring and fair evaluation.",
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
      "A Go-based WebSocket load testing tool for benchmarking high-concurrency systems.",
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

pursuits: [
  {
    title: "Competitive Programming",
    description: "The intersection of programming and math. A 2,208 LeetCode Guardian and 6-star Div. 1 CodeChef coder.",
    number: 1,
  },
  {
    title: "Software Engineering",
    description: "Love building solutions that solve genuine problems, keeping code simple, and letting good engineering principles do the talking.",
    number: 2,
  },
  {
    title: "Red Until I’m Dead",
    description: "love playing football and A proud and unwavering Liverpool FC supporter. YNWA.",
    number: 3,
  },
  {
    title: "Timeless Melodies",
    description: "I find myself drawn to Vivaldi, Beethoven, and other old melodies that never seem to lose their charm.",
    number: 4,
  },
],



} as const;
