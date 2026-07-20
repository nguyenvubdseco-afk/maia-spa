import fs from "fs";
import path from "path";

export interface Post {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
}

const dataPath = path.join(process.cwd(), "data", "posts.json");

export function getPosts(): Post[] {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

export function savePosts(posts: Post[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2), "utf-8");
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
