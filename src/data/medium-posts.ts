export interface MediumPost {
  title: string;
  url: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  isExternal?: boolean;
}

export const mediumPosts: MediumPost[] = [
  // Add your own Medium posts here when you start writing
];

export function getMediumPosts(): MediumPost[] {
  return mediumPosts;
} 