import styles from "./book-card.module.css";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  title: string;
  author: string;
  number: number;
}

export function BookCard({
  title,
  author,
  number,
}: Props) {
  return (
    <li className="relative ml-10 py-4">
      <div className="absolute -left-16 top-2 flex items-center justify-center bg-white rounded-full">
        <Avatar className="border size-12 m-auto">
          <AvatarFallback className="text-xs font-bold">{String(number).padStart(2, "0")}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1">
        <h2 className="font-semibold leading-none">{title}</h2>
        <p className="text-sm text-muted-foreground">{title === "Red Until I’m Dead" ? (
          <><em>love playing football</em> and <strong>A proud and unwavering <span className={styles.liverpool}>Liverpool FC</span> supporter. YNWA.</strong></>
        ) : title === "Competitive Programming" ? author.split(/(LeetCode|Guardian)/).map((part, index) =>
          part === "LeetCode" || part === "Guardian" ? (
            <a key={index} className="text-[#3B82F6] italic hover:underline underline-offset-2 whitespace-nowrap" href={part === "LeetCode" ? "https://leetcode.com/u/charuvarthan" : "https://leetcode.com/u/_abyss/"} target="_blank" rel="noopener noreferrer">{part}<span aria-hidden="true" className="ml-0.5 inline-block text-[0.75em] not-italic">↗</span></a>
          ) : part
        ) : author}</p>
      </div>
    </li>
  );
} 